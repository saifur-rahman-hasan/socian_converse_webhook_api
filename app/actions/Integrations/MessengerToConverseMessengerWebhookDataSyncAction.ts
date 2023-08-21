import BaseAction from "@/actions/BaseAction";
import { ChannelDataRequiredInterface } from "@/actions/interface/ChannelInterface";
import {
	ConversationDocOutputInterface, ConversationMessageCreateInputInterface, ConversationMessageDocOutputInterface,
	ConversationParticipantUserInterface, ConversationThreadOutputInterface, ConversationThreadTaskDocReadInterface
} from "@/actions/interface/ConversationInterface";
import { WebhookDocOutputInterface } from "@/actions/interface/WebhookDocInterface";
import { throwIf } from "@/lib/ErrorHandler";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {
	debugLog,
	generateChannelUid,
	generateConsumerConversationUid, getCurrentTimestamp, isCloseableIceResponse,
} from "@/utils/helperFunctions";
import ConversationMessageCreateAction from "@/actions/Conversation/ConversationMessageCreateAction";
import MessengerPayloadDetector from "@/lib/integrations/messenger/MessengerPayloadDetector";
import ConversationCreateAction from "@/actions/Conversation/ConversationCreateAction";
import collect from "collect.js";
import ConversationThreadCloseAction from "@/actions/Conversation/ConversationThreadCloseAction";
import ConversationThreadCreateAction from "@/actions/Conversation/ConversationThreadCreateAction";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import WebhookDataQuery from "@/lib/QueryServices/utils/WebhookDataQuery";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";

export default class MessengerToConverseWebhookDataSyncAction extends BaseAction {
	private channelType: string;
	private webhookMessagingObj: any = null;
	private channelAccountId: string | null = null;
	private channelUid: string;
	private webhookPayloadEntryObj: any | null = null;
	private channel: any = null;
	private channelId: number;
	private workspaceId: number;
	private userId: number;
	private conversationUid: string | null;
	private channelData: ChannelDataRequiredInterface;
	private senderId: string;
	private recipientId: string;
	private isConsumerMessage: boolean = false;
	private isChannelMessage: boolean = false;
	private isNewConversation: boolean = false;
	private conversation: ConversationDocOutputInterface | null = null;
	private conversationId: string | null = null;
	private currentThreadId: number | null = null;
	private isNewThread: boolean = false;
	private consumerId: string;
	private isChannelSentTheIceMessageToTheConsumer: boolean = false;
	private isConsumerRespondOnIceMessage: boolean = false;
	private message: any;
	private messageType: string;
	private consumerUser: ConversationParticipantUserInterface;
	private channelUser: ConversationParticipantUserInterface;
	private messageSourceMid: string;
	private conversationMessage: ConversationMessageDocOutputInterface;
	private conversationThread: ConversationThreadOutputInterface;
	private conversationThreadTask: ConversationThreadTaskDocReadInterface;
	private conversationThreadMessages: ConversationMessageDocOutputInterface [];
	private threadQuery: ThreadQuery;
	private taskQuery: TaskQuery;
	private webhookQuery: WebhookDataQuery;
	private webhookDock: WebhookDocOutputInterface;
	private messageQuery: MessageQuery;

	constructor() {
		super();

		this.channelAccountId = null;
		this.channelData = null;
		this.isConsumerMessage = false;
		this.isChannelMessage = false;
		this.isNewConversation = false;
		this.conversation = null;
		this.conversationId = null;
		this.isNewThread = false;

		this.webhookPayloadEntryObj = null;
		this.channelType = "messenger";
		this.channelAccountId = null;
		this.webhookMessagingObj = null;
		this.conversation = null;
		
		this.threadQuery = new ThreadQuery()
		this.taskQuery = new TaskQuery()
		this.webhookQuery = new WebhookDataQuery()
		this.messageQuery = new MessageQuery()
	}

	async execute(webhookDoc: WebhookDocOutputInterface) {
		try {
			this.webhookPayloadEntryObj = webhookDoc.payloadData.entry[0];
			this.webhookMessagingObj = this.webhookPayloadEntryObj.messaging[0] || null

			const payloadDetector = new MessengerPayloadDetector(
				this.webhookMessagingObj,
				this.channelAccountId
			)

			this.messageType = payloadDetector.detectPayloadType()
			this.messageSourceMid = payloadDetector.getSourceMidFromMessageType()

			this.channelAccountId = this.webhookPayloadEntryObj.id || null;
			this.channelUid = generateChannelUid(
				this.channelType,
				this.channelAccountId
			);

			this.channel = await new ChannelQuery().findUniqueChannelByChannelUid(
				this.channelType,
				this.channelUid
			);
			throwIf(!this.channel.id, new Error("Sorry! Channel Not Found"));

			this.channelId = this.channel.id;
			this.workspaceId = this.channel.workspaceId;
			this.userId = this.channel.workspace.userId;
			this.channelAccountId = this.channel.channelData.accountId;
			this.channelData = this.channel.channelData;
			throwIf(!this.webhookMessagingObj, new Error('Invalid webhook messaging object'))

			this.webhookDock = await this.webhookQuery.updateWebhookCall(
				webhookDoc._id,
				{
					workspaceId: this.workspaceId,
					channelType: this.channelType,
					channelId: this.channelId,
					synced: true
				}
			)

			this.senderId = this.webhookMessagingObj.sender.id;
			this.recipientId = this.webhookMessagingObj.recipient.id;
			this.isConsumerMessage = this.senderId !== this.channelAccountId;
			this.isChannelMessage = this.senderId === this.channelAccountId;


			this.consumerId = this.isConsumerMessage
				? this.senderId
				: this.recipientId;


			this.conversationUid = generateConsumerConversationUid(
				this.workspaceId,
				this.channelType,
				this.channelId,
				this.consumerId
			);

			this.conversation =
				await new ConversationQuery().findUniqueConversationByUid(
					this.conversationUid
				);

			this.conversationId = this.conversation?._id;
			this.currentThreadId = this.conversation?.currentThreadId;

			if (!this.conversationId) {

				// TODO: Create new Conversation Process
				await this.createNewConsumerConversation();

			} else {

				// Work on existing conversation

				this.consumerUser = collect(this.conversation.participants).firstWhere('role', 'consumer')
				this.channelUser = collect(this.conversation.participants)
					.where('id', this.channelAccountId)
					.where('role', 'agent')
					.first()

				this.consumerId = this.consumerUser.id

				await this.prepareMessageDataFromWebhookMessagePayload()

				if (this.isMessageFromConsumer()) {

					if (!this.hasCurrentThreadId()) {

						// TODO: Create new Conversation Thread
						await this.createNewConversationThread();

					} else {

						const threadProcessResponse = await this.processExisingConversationThread()

						this.conversation = threadProcessResponse.conversation
						this.conversationThread = threadProcessResponse.conversationThread
						this.conversationThreadTask = threadProcessResponse.conversationThreadTask
						this.conversationThreadMessages = threadProcessResponse.conversationThreadMessages
					}

				} else if (!this.isMessageFromConsumer() && this.isMessageFromChannel()) {

					await this.addNewMessageToTheConversationThread();

				} else {

					debugLog("Skipping Unhandled message", this.webhookMessagingObj);
					throw new Error("Unhandled message")

				}
			}

			throwIf(
				!this.conversation?._id ||
				!this.conversationThread?.id ||
				!this.conversationThreadTask?._id,
				new Error('Invalid Data to complete sync response')
			)

			return Promise.resolve({
				conversation: this.conversation,
				conversationThread: this.conversationThread,
				conversationThreadTask: this.conversationThreadTask,
				conversationThreadMessages: this.conversationThreadMessages, 
			});
		} catch (e) {
			debugLog(`MessengerToConverseWebhookDataSyncAction Error: `, e.message)
			return Promise.reject('Failed to sync Messenger to Converse Data Sync');
		}
	}

	private async createNewConsumerConversation() {
		try {
			const messageContent = this.getMessageContent()

			const fromConsumer : ConversationParticipantUserInterface = {
				id: this.consumerId,
				name: 'The Consumer',
				role: 'consumer'
			}

			const toChannel : ConversationParticipantUserInterface = {
				id: this.channelAccountId,
				name: this.channel.channelName,
				role: 'agent'
			}

			const messageData: ConversationMessageCreateInputInterface = {
				messageType: this.messageType,
				content: messageContent,
				from: fromConsumer,
				to: toChannel,
				threadId: null,
				createdTime: this?.webhookPayloadEntryObj?.time || getCurrentTimestamp(),
				channelAccountId: this.channelAccountId,
				sourceMid: this.webhookMessagingObj.message.mid,
			}

			const createConversationAction = new ConversationCreateAction(
				this.channelId,
				messageData
			)

			const createConversationActionResponse = await createConversationAction.execute()

			this.conversation = createConversationActionResponse.conversation
			this.conversationId = createConversationActionResponse.conversation._id
			this.currentThreadId = createConversationActionResponse.conversationThread.id
			this.conversationThread = createConversationActionResponse.conversationThread
			this.conversationThreadTask = createConversationActionResponse.conversationThreadAssignableTask
			this.conversationThreadMessages = [
				{...createConversationActionResponse.conversationThreadMessages.startMessage},
				{...createConversationActionResponse.conversationThreadMessages.consumerMessage},
				{...createConversationActionResponse.conversationThreadMessages.channelAutoReplyMessage},
			]

			return Promise.resolve({
				conversation: createConversationActionResponse.conversation,
				conversationThread: createConversationActionResponse.conversationThread,
				conversationThreadAssignableTask: createConversationActionResponse.conversationThreadAssignableTask,
				conversationThreadMessages: createConversationActionResponse.conversationThreadMessages,
			});
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private async createNewConversationThread() {
		try {
			debugLog('creating new thread', true)

			const threadCreateAction = new ConversationThreadCreateAction(
				this.workspaceId,
				this.channelId,
				this.conversationId,
				this.message
			)

			const threadCreateActionResponse = await threadCreateAction.execute()

			this.conversation = threadCreateActionResponse.conversation
			this.currentThreadId = this.conversation.currentThreadId
			this.conversationThread = threadCreateActionResponse.conversationThread
			this.conversationThreadTask = threadCreateActionResponse.conversationThreadAssignableTask
			this.conversationThreadMessages = [
				{...threadCreateActionResponse.threadMessages.startMessage},
				{...threadCreateActionResponse.threadMessages.consumerMessage},
				{...threadCreateActionResponse.threadMessages.channelAutoReplyMessage},
			]

			debugLog(`this.conversationThreadMessages: `, this.conversationThreadMessages)

			return Promise.resolve(threadCreateActionResponse);
		} catch (e) {
			debugLog(`createNewConversationThread Error: `, e)
			return Promise.reject('Failed to create new conversation thread.');
		}
	}

	private async getChannelHasSentTheIceMessageToTheConsumer() {
		try {
			const threadMessages = await this.messageQuery
				.getConversationMessages(
					this.conversation._id,
					this.conversation.currentThreadId
				)

			const iceFeedbackMessage = collect(threadMessages).firstWhere('iceFeedback', true)
			const isSentIceMessageToTheConsumer = iceFeedbackMessage?.iceFeedback == true

			return Promise.resolve(isSentIceMessageToTheConsumer);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private getMessageContent() {
		let messageContent = ''

		switch (this.messageType){
			case "text":
				messageContent = this.webhookMessagingObj.message.text
				break

			case "attachment_image":
			case "attachment_audio":
			case "attachment_video":
			case "attachment_file":
				messageContent = this.webhookMessagingObj.message.attachments[0].payload.url
				break

			case "product_referral":
				messageContent = "product_referral"
				break

			case "reply":
				messageContent = this.webhookMessagingObj?.message?.text || this.webhookMessagingObj?.message?.attachments[0]?.payload?.url || 'undefined__reply'
				break

			case "quick_reply":
				messageContent = this.webhookMessagingObj.message.quick_reply.payload
				break

			case "message_reads":
				messageContent = this.webhookMessagingObj?.read?.watermark.toString() || "undefined__message_reads"
				break

			case "message_reactions":
				messageContent = "undefined__message_reactions"
				break

			case "postback":
				messageContent = "undefined__postback"
				break

			case "message_deliveries":
				messageContent = this.webhookMessagingObj?.delivery?.mids[0] || "undefined__message_deliveries"
				break

			case "echo":
				messageContent = this.webhookMessagingObj?.message?.text || "undefined__echo_message"
				break

			default:
				messageContent = "undefined_content"
		}

		return messageContent
	}

	private async getConsumerRespondOnIceMessage() {
		try {
			const quickReplyContent = this.getMessageContent()
			const isClosedIceReply = isCloseableIceResponse(quickReplyContent)

			if(
				this.isConsumerMessage &&
				this.messageType === 'quick_reply' &&
				quickReplyContent?.length &&
				isClosedIceReply
			){
				debugLog('Thread Closed by Ice Reply received from consumer to channel', true)
				return Promise.resolve(true)
			}

			return Promise.resolve(false);
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private async closeConversationThread() {
		try {
			const threadCloseAction = new ConversationThreadCloseAction(
				this.workspaceId,
				this.channelId,
				this.conversationId,
				this.currentThreadId,
			)

			const threadCloseActionResponse = await threadCloseAction.execute()

			this.conversation = threadCloseActionResponse.conversation
			this.currentThreadId = null
			this.conversationThread = null
			this.conversationThreadTask = null
			this.conversationThreadMessages = null

			return Promise.resolve({
				conversation: threadCloseActionResponse.conversation,
				closedThread: threadCloseActionResponse.closedThread,
				closedThreadTask: threadCloseActionResponse.closedThreadTask,
				threadClosingMessage: threadCloseActionResponse.threadClosingMessage,
			});

		} catch (e) {
			return Promise.reject(`Failed to close the conversation thread.`);
		}
	}

	private async addNewMessageToTheConversationThread() {
		try {
			const messageObj = {
				messageType: this.messageType,
				content: this.getMessageContent(),
				from: this.consumerUser,
				to: this.channelUser,
				threadId: this.currentThreadId,
				createdTime: this.webhookPayloadEntryObj?.time || getCurrentTimestamp(),
				channelAccountId: this.channelAccountId,
				sourceMid: this.messageSourceMid,
				conversationId: this.conversationId,
			}

			const messageCreateAction = new ConversationMessageCreateAction(
				this.workspaceId,
				this.channelId,
				this.userId,
				this.conversationId,
				this.currentThreadId,
				this.messageSourceMid,
				this.channel,
				messageObj
			)

			const messageCreateActionResponse = await messageCreateAction.execute()

			this.conversation = messageCreateActionResponse.conversation
			this.conversationMessage = messageCreateActionResponse.conversationMessage
			this.conversationThreadMessages = [ {...messageCreateActionResponse.conversationMessage}]

			return Promise.resolve({
				conversation: messageCreateActionResponse.conversation,
				conversationThreadMessages: messageCreateActionResponse.conversationMessage
			});

		} catch (e) {
			debugLog(`addNewMessageToTheConversationThread Error: `, e)
			return Promise.reject(e);
		}
	}

	private isMessageFromConsumer() {
		return this.isConsumerMessage && !this.isChannelMessage
	}

	private isMessageFromChannel() {
		return !this.isConsumerMessage && this.isChannelMessage;
	}

	private async processExisingConversationThread() {
		try {
			debugLog('processing exising conversation thread message', true)

			// TODO: Work on existing conversation thread
			this.isChannelSentTheIceMessageToTheConsumer = await this.getChannelHasSentTheIceMessageToTheConsumer();

			if (this.isChannelSentTheIceMessageToTheConsumer) {

				// TODO: Check and Detect the consumer replay after sending ice message and try to close or force close.
				await this.tryToCloseTheConversationThread()

			} else {

				// TODO: Add new Message to the conversation thread
				await this.addNewMessageToTheConversationThread();
			}

			return Promise.resolve({
				conversation: this.conversation,
				conversationThread: this.conversationThread,
				conversationThreadTask: this.conversationThreadTask,
				conversationThreadMessages: this.conversationThreadMessages,
			})

		}catch (e) {
			debugLog('processExisingConversationThread Error: ', e.message)
			return Promise.reject('Failed to process the existing conversation thread.')
		}
	}

	private async tryToCloseTheConversationThread() {
		try {

			this.isConsumerRespondOnIceMessage = await this.getConsumerRespondOnIceMessage();
			// this.isConsumerRespondOnIceMessage = true;

			if (this.isConsumerRespondOnIceMessage) {

				// TODO: Close the current conversation thread
				await this.closeConversationThread();

			} else {

				// TODO: Close the current conversation thread
				await this.closeConversationThread();

				// TODO: Create a new Conversation Thread
				await this.createNewConversationThread();

			}

			return Promise.resolve({
				conversation: this.conversation,
				conversationThread: this.conversationThread,
				conversationThreadTask: this.conversationThreadTask,
				conversationThreadMessages: this.conversationThreadMessages,
			})

		}catch (e) {
			return Promise.resolve('Failed to close the conversation thread')
		}
	}

	private hasCurrentThreadId() {
		return this.currentThreadId > 0;
	}

	private async prepareMessageDataFromWebhookMessagePayload() {
		try {
			let messageData = {
				messageType: this.messageType,
				content: this.getMessageContent(),
				from: null,
				to: null,
				threadId: this.currentThreadId,
				createdTime: this.webhookPayloadEntryObj?.time || getCurrentTimestamp(),
				channelAccountId: this.channelAccountId,
				sourceMid: this.messageSourceMid,
				conversationId: this.conversationId,
			}

			this.consumerUser = { id: this.consumerUser.id, name: this.consumerUser.name, role: this.consumerUser.role }

			if(this.isMessageFromConsumer()){
				messageData = {
					...messageData,
					from: this.consumerUser,
					to: this.channelUser
				}

			} else if(!this.isMessageFromConsumer() && this.isMessageFromChannel()){
				messageData = {
					...messageData,
					from: this.channelUser,
					to: this.consumerUser
				}
			} else{
				return Promise.reject('Unhandled Payload')
			}

			if(messageData?.from?.id && messageData?.to?.id){
				this.message = messageData
			}

			return Promise.resolve(messageData)
		}catch (e) {
			return Promise.reject(e)
		}
	}
}
