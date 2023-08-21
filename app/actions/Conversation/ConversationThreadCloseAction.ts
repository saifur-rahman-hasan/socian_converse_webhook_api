import BaseAction from "@/actions/BaseAction";
import {debugLog, getCurrentTimestamp, isCloseableIceResponse} from "@/utils/helperFunctions";
import {throwIf} from "@/lib/ErrorHandler";
import {
	ConversationDocOutputInterface, ConversationLastMessageInterface, ConversationMessageCreateInputInterface,
	ConversationMessageDocOutputInterface, ConversationParticipantUserInterface, ConversationThreadOutputInterface
} from "@/actions/interface/ConversationInterface";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import {getAutoGeneratedSourceMid} from "@/components/Converse/ConverseMessengerApp/MessengerReplayForm";
import ConversationMessageCreateAction from "@/actions/Conversation/ConversationMessageCreateAction";
import collect from "collect.js";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import {AgentAssignedTaskDocReadInterface, AssignedTaskClosingTag} from "@/actions/interface/AgentInterface";

export default class ConversationThreadCloseAction extends BaseAction {
	private workspaceId: number;
	private channelId: number;
	private threadId: number;
	private conversationId: string;
	private conversation: ConversationDocOutputInterface;
	private conversationQuery: ConversationQuery;
	private channelQuery: ChannelQuery;
	private threadQuery: ThreadQuery;
	private messageQuery: MessageQuery;
	private threadClosingMessage: ConversationMessageDocOutputInterface;
	private channelUser: ConversationParticipantUserInterface;
	private consumerUser: ConversationParticipantUserInterface;
	private channel: any;
	private userId: number;
	private taskQuery: TaskQuery;
	private consumerForceClosed: boolean = false;
	private consumerIceFeedbackReceived: boolean = false;
	private assignedTaskIsFullFilled: boolean = false;
	private closedThread: ConversationThreadOutputInterface;
	private closedThreadTask: AgentAssignedTaskDocReadInterface;
	private closingTags: AssignedTaskClosingTag[] | null = null;
	private closingNote: string | null = null;
	private closedById: number | string | null = null;
	private agentHasSentIceFeedbackToTheConsumer: boolean;
	private threadMessages: ConversationMessageDocOutputInterface [];
	private consumerHasRepliedOnIceFeedback: boolean;

	constructor(
		workspaceId: number,
		channelId: number,
		conversationId: string,
		threadId: number | null,
		closingNote?: string | null,
		closingTags?: AssignedTaskClosingTag[] | null,
		consumerForceClosed?: boolean,
	) {
		super();

		this.workspaceId = workspaceId
		this.channelId = channelId
		this.conversationId = conversationId
		this.threadId = threadId
		this.consumerForceClosed = consumerForceClosed || false

		this.conversationQuery = new ConversationQuery
		this.channelQuery = new ChannelQuery
		this.threadQuery = new ThreadQuery
		this.taskQuery = new TaskQuery
		this.messageQuery = new MessageQuery
		this.closingNote = closingNote || null
		this.closingTags = closingTags || null
	}

	async execute() {
		try {

			this.conversation = await this.conversationQuery.findConversationById(this.conversationId)

			throwIf(
				!this.threadId,
				new Error("This conversation has no current thread to close.")
			)

			const thread = await this.threadQuery.findThreadById(this.threadId)
			throwIf(thread.isClosed, new Error('The thread is already closed.'))

			this.channel = await this.channelQuery.findChannelById(this.channelId)
			this.userId = this.channel.workspace.userId

			this.channelUser = {
				id: this.channel.channelData.accountId,
				name: this.channel.channelName,
				role: 'agent'
			}

			this.consumerUser = collect(this.conversation.participants).firstWhere('role', 'consumer')
			this.threadMessages = await this.getThreadMessages()
			this.agentHasSentIceFeedbackToTheConsumer = !!collect(this.threadMessages)
				.where('isAgentReplied', true)
				.where('iceFeedback', true)
				.first()?._id

			this.consumerHasRepliedOnIceFeedback = !!collect(this.threadMessages)
				.where('from.id', this.consumerUser.id)
				.where('messageType', 'iceFeedbackReplay')
				.whereIn('content', ['Y','y','N','n'])
				.first()?._id

			// TODO: Find the task to close
			const task = await this.taskQuery.getTaskByThreadId(this.threadId, false)
			this.consumerIceFeedbackReceived = this.agentHasSentIceFeedbackToTheConsumer || false
			this.assignedTaskIsFullFilled = this.consumerHasRepliedOnIceFeedback || false
			this.consumerForceClosed = this.agentHasSentIceFeedbackToTheConsumer && this.consumerHasRepliedOnIceFeedback ? false : task?.consumerForceClosed || false


			// TODO: insert thread closing message
			await this.insertThreadClosingMessage()

			if(task?._id){
				// TODO: close the thread assignable task
				this.closedThreadTask = await this.closeThreadTask()
			}

			// TODO: close the current thread
			this.closedThread = await this.closeThread()

			throwIf(
				!this.closedThread?.id,
				new Error('Invalid thread Closed')
			)

			// TODO: Close the conversation and current thread
			const conversationLastMessage: ConversationLastMessageInterface = {
				id: this.threadClosingMessage._id,
				messageType: this.threadClosingMessage.messageType,
				content: this.threadClosingMessage.content,
				createdTime: this.threadClosingMessage.createdTime
			}

			this.conversation = await this.conversationQuery.updateAndGetConversationDoc(
				this.conversationId,
				{
					currentThreadId: null,
					lastMessage: conversationLastMessage,
					canReply: false,
					conversationClosed: true
				}
			)

			// TODO: Fire Socket Events


			return Promise.resolve({
				conversation: this.conversation,
				closedThread: this.closedThread,
				closedThreadTask: this.closedThreadTask,
				threadClosingMessage: this.threadClosingMessage,
			})

		}catch (e) {
			debugLog('ConversationThreadTaskCloseAction Error: ', e.message)

			return Promise.reject(e)
		}
	}

	private async getAgentHasSentIceFeedbackToTheConsumer() {
		const threadMessages = await (new MessageQuery()).getConversationMessages(
			this.conversation._id,
			this.conversation.currentThreadId
		)
		const iceFeedbackMessage = collect(threadMessages).firstWhere('iceFeedback', true)
		return iceFeedbackMessage?.iceFeedback == true
	}

	private async insertThreadClosingMessage() {
		try {
			const consumerMessageData: ConversationMessageCreateInputInterface = {
				messageType : "conversation_stop",
				content : "/stop",
				from : this.consumerUser,
				to : this.channelUser,
				threadId : this.threadId,
				createdTime : getCurrentTimestamp(),
				channelAccountId: this.channelUser.id,
				sourceMid : getAutoGeneratedSourceMid('THREAD_CONVERSATION_STOP__'),
				conversationId: this.conversationId,
				closed: true,
				consumerForceClosed: this.consumerForceClosed
			}

			const threadClosingMessage = await (new ConversationMessageCreateAction(
				this.workspaceId,
				this.channelId,
				this.userId,
				this.conversationId,
				this.threadId,
				consumerMessageData.sourceMid,
				this.channel,
				consumerMessageData,
			)).execute()

			this.threadClosingMessage = threadClosingMessage.conversationMessage


			return Promise.resolve({
				conversation: threadClosingMessage.conversation,
				threadClosingMessage: threadClosingMessage.conversationMessage
			})
		}catch (e) {
			return Promise.reject("Failed to create conversation /stop message")
		}
	}

	private async closeThreadTask() {
		try {

			const closedTask = await this.taskQuery.closeTheTaskByThreadId(
				this.threadId,
				this.assignedTaskIsFullFilled,
				this.consumerIceFeedbackReceived,
				this.consumerForceClosed
			)
			
			return Promise.resolve(closedTask)
		}catch (e) {
			return Promise.reject("Failed to close the thread task")
		}
	}

	private async closeThread() {
		try {

			const closedThread = await this.threadQuery.closeTheThread(this.threadId)

			return Promise.resolve(closedThread)
		}catch (e) {
			return Promise.reject("Failed to close the thread")
		}
	}

	private async getThreadMessages() {
		try {
			const threadMessages = await (new MessageQuery()).getConversationMessages(
				this.conversationId,
				this.threadId
			)

			return Promise.resolve(threadMessages)
		}catch (e) {
			return Promise.reject("Failed to fetch thread messages")
		}
	}
}