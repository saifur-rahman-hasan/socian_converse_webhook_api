import BaseAction from "@/actions/BaseAction";
import {debugLog, generateConsumerConversationUid} from "@/utils/helperFunctions";
import {
	AssignableTaskDocOutputInterface,
	ConversationCreateInputInterface,
	ConversationDocOutputInterface,
	ConversationLastMessageInterface,
	ConversationMessageCreateInputInterface,
	ConversationMessageDocOutputInterface,
	ConversationParticipantUserInterface,
	ConversationThreadOutputInterface
} from "@/actions/interface/ConversationInterface";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import {ChannelDataRequiredInterface, ConsumerDataOutputInterface} from "@/actions/interface/ChannelInterface";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {throwIf} from "@/lib/ErrorHandler";
import ChannelConsumerQuery from "@/lib/QueryServices/elasticsearch/ChannelConsumerQuery";
import collect from "collect.js";
import ConversationThreadCreateAction from "@/actions/Conversation/ConversationThreadCreateAction";

export default class ConversationCreateAction extends BaseAction {
	private conversation: ConversationDocOutputInterface;
	private workspaceId: number;
	private channelId: number;
	private userId: number;
	private channel: any;
	private channelData: ChannelDataRequiredInterface;
	private channelAccountId: string;
	private channelType: string;
	private consumerId: string;
	private conversationUid: string;
	private conversationQuery: ConversationQuery;
	private message: ConversationMessageCreateInputInterface;
	private messageSourceMid: string;
	private currentThreadId: number;
	private conversationThread: ConversationThreadOutputInterface;
	private conversationThreadAssignableTask: AssignableTaskDocOutputInterface;
	private conversationThreadMessages: {
		startMessage: ConversationMessageDocOutputInterface | null;
		consumerMessage: ConversationMessageDocOutputInterface | null;
		channelAutoReplyMessage: ConversationMessageDocOutputInterface | null
	};

	constructor(
		channelId: number,
		message: ConversationMessageCreateInputInterface
	) {
		super();

		this.channelId = channelId
		this.consumerId = message.from.id
		this.message = message
		this.messageSourceMid = message.sourceMid

		// Query Class
		this.conversationQuery = new ConversationQuery()

		this.conversation = null
	}

	async execute() {
		try {
			this.channel = await new ChannelQuery().findChannelById(this.channelId);
			this.channelData = this.channel.channelData
			this.channelAccountId = this.channelData.accountId
			this.workspaceId = this.channel.workspaceId
			this.userId = this.channel.workspace.userId
			this.channelType = this.channel.channelType
						
			this.conversationUid = generateConsumerConversationUid(
				this.workspaceId,
				this.channelType,
				this.channelId,
				this.consumerId
			)

			// TODO: Throw Error if the conversation is already exists
			const existingConversation = await this.conversationQuery.findUniqueConversationByUid(this.conversationUid)

			throwIf(
				existingConversation?._id,
				new Error("Sorry! this conversation is already exists.")
			)

			// TODO: Create a new Conversation for the consumer.
			const conversation = await this.createNewConversationDoc()

			throwIf(
				!conversation?._id || conversation?.currentThreadId > 0,
				new Error("Invalid new Conversation Doc.")
			)

			this.conversation = conversation
			this.currentThreadId = this.conversation.currentThreadId

			const conversationThreadCreateAction = new ConversationThreadCreateAction(
				this.workspaceId,
				this.channelId,
				this.conversation._id,
				this.message
			)

			const conversationThreadCreateActionResponse = await conversationThreadCreateAction.execute()
			this.conversation = conversationThreadCreateActionResponse.conversation
			this.conversationThread = conversationThreadCreateActionResponse.conversationThread
			this.conversationThreadAssignableTask = conversationThreadCreateActionResponse.conversationThreadAssignableTask
			this.conversationThreadMessages = conversationThreadCreateActionResponse.threadMessages

			return Promise.resolve({
				conversation: this.conversation,
				conversationThread: this.conversationThread,
				conversationThreadAssignableTask: this.conversationThreadAssignableTask,
				conversationThreadMessages: this.conversationThreadMessages,
			})
		}catch (e) {
			debugLog(`ConversationCreateActionNew Error: `, e.message)
			return Promise.reject(e)
		}
	}

	private getConversationCreateInputDocData() {
		return {
			conversationUid: this.conversationUid,
			workspaceId: this.workspaceId,
			channelId: this.channelId,
			currentThreadId: null,
			participants: this.getConversationParticipantsData(),
			sourceConversationId: null,
			sourceData: null,
			lastMessage: this.getLastMessageData(),
			messagesCount: 0,
			canReply: false,
			conversationClosed: false
		};
	}

	private getLastMessageData(): ConversationLastMessageInterface {
		return {
			id: this.message.sourceMid,
			messageType: this.message.messageType,
			content: this.message.content,
			createdTime: this.message.createdTime,
		};
	}


	private getConversationParticipantsData(): ConversationParticipantUserInterface[] {
		const consumerData: ConversationParticipantUserInterface = {
			id: this.message.from.id,
			name: "The Consumer",
			role: "consumer",
		};
		const agentData: ConversationParticipantUserInterface = {
			id: this.channel.channelData.accountId,
			name: this.channel.channelName,
			role: "agent",
		};

		return [{ ...consumerData }, { ...agentData }];
	}

	private async fetchConsumerData(
		channel: any,
		consumerId: string,
		sourceId: string
	) {
		try {
			const channelData: ChannelDataRequiredInterface =
				channel?.channelData || null;

			const channelType = channel?.channelType;
			const channelAccountId = channelData?.accountId;
			const channelAccessToken = channelData?.accessToken;

			const consumerData: ConsumerDataOutputInterface =
				await new ChannelConsumerQuery().findOrSyncChannelConsumer(
					channelAccountId,
					channelType,
					consumerId,
					channelAccessToken,
					sourceId
				);

			return Promise.resolve(consumerData);
		} catch (e) {
			return Promise.resolve(null);
		}
	}

	private async createNewConversationDoc() {
		try {

			let newConversationDocData: ConversationCreateInputInterface = this.getConversationCreateInputDocData();

			// TODO 1.1 . Fetch The Consumer Data
			const consumerData = await this.fetchConsumerData(
				this.channel,
				this.message.from.id,
				this.messageSourceMid
			);

			if (consumerData?.id && consumerData?.name) {
				const updatedParticipants: ConversationParticipantUserInterface[] =
					collect(newConversationDocData["participants"])
						.map((participant) => {
							if (
								participant.id === consumerData.id &&
								participant.role === "consumer"
							) {
								return { ...consumerData, role: "consumer" };
							} else {
								return participant;
							}
						})
						.toArray();

				newConversationDocData = {
					...newConversationDocData,
					participants: updatedParticipants,
				};
			}

			const conversation = await this.conversationQuery.createAndGetConversationDoc(
				newConversationDocData
			)

			return Promise.resolve(conversation)

		}catch (e) {
			return Promise.reject('Failed to create new conversation document.')
		}
	}
}