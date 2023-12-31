import BaseAction from "@/actions/BaseAction";
import {ActionResponseInterface} from "@/actions/interface/ActionResponseInterface";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {
    AgentAssignedTaskCloseInsertInterface,
    AgentAssignedTaskDocReadInterface
} from "@/actions/interface/AgentInterface";
import {throwIf} from "@/lib/ErrorHandler";
import AgentTaskQuery from "@/lib/QueryServices/elasticsearch/AgentTaskQuery";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import ConversationMessageCreateAction from "@/actions/Conversation/ConversationMessageCreateAction";
import {
    ConversationDocOutputInterface,
    ConversationMessageCreateInputInterface, ConversationMessageDocOutputInterface,
    ConversationParticipantUserInterface, ConversationThreadTaskDocReadInterface
} from "@/actions/interface/ConversationInterface";
import {generateTimestamp} from "@/utils/helperFunctions";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import collect from "collect.js";
import {getAutoGeneratedSourceMid} from "@/components/Converse/ConverseMessengerApp/MessengerReplayForm";

export default class CloseAgentAssignedTaskAction extends BaseAction {
    private _agentId: number;
    private _taskId: number;
    private _taskQuery: TaskQuery;
    private _threadQuery: ThreadQuery;
    private _conversationQuery: ConversationQuery;
    private _task: AgentAssignedTaskDocReadInterface;
    private _agentQuery: AgentTaskQuery;
    private workspaceId: number;
    private channelId: number;
    private consumerUser: ConversationParticipantUserInterface;
    private channelUser: ConversationParticipantUserInterface;
    private channelAccountId: string;
    private channel: any
    private conversationId: string;
    private userId: number;
    private threadId: number;
    private closedTask: ConversationThreadTaskDocReadInterface;
    private conversation: ConversationDocOutputInterface;
    private agentIceMessage: ConversationMessageDocOutputInterface;

    constructor(
        agentId: number,
        taskId: number
    ) {
        super();

        this._taskId = taskId
        this._agentId = agentId
        this._taskQuery = new TaskQuery()
        this._threadQuery = new ThreadQuery()
        this._conversationQuery = new ConversationQuery()
        this._agentQuery = new AgentTaskQuery()
    }

    async execute(data: AgentAssignedTaskCloseInsertInterface) {
        try {

            // TODO: Find The Agent Assigned Task which was not closed yet
            this._task = await this._taskQuery.getAgentAssignedNotClosedTask(
                this._agentId,
                this._taskId,
            )
            throwIf(!this._task?._id, new Error('Sorry! You are not allowed to close the task or the task is already closed'))
            this.setVirtualData('task', this._task)

            this.workspaceId = this._task.sourceData.workspaceId
            this.channelId = this._task.sourceData.channelId
            this.conversationId = this._task.sourceData.conversationId
            this.threadId = this._task.sourceData.threadId

            // TODO: Find the channel
            this.channel = await (new ChannelQuery()).findChannelById(this.channelId)
            this.channelAccountId = this.channel?.channelData?.accountId
            this.userId = this?.channel?.workspace?.userId
            throwIf(!this.channelAccountId, new Error('Invalid Channel Id on task closing.'))


            // TODO: Close the task from the agent and mark the status as partially closed from agent
            const closedTask = await this._agentQuery.closeAgentAssignedTask(
                this._agentId,
                this._task?._id,
                data.assignedTags,
                this._task.taskStartTimestamp
            )
            throwIf(!closedTask?._id, new Error('Invalid Closed Task'))
            this.closedTask = closedTask
            this.setVirtualData('closedTask', closedTask)

            this.conversation = await this._conversationQuery.findConversationById(this.conversationId)
            throwIf(!this.conversation?._id, new Error("Cannot find the conversationDoc"))


            // TODO: Send Ice Feedback message to the consumer if iceFeedback param value is true
            if(data.iceFeedback === true){
                await this.sendIceFeedbackMessageToTheConsumer()
            }

            const promiseData: ActionResponseInterface = this.getActionResolvedData()
            return Promise.resolve(promiseData)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    get agentId(): number {
        return this._agentId;
    }

    set agentId(value: number) {
        this._agentId = value;
    }
    get taskId(): number {
        return this._taskId;
    }

    set taskId(value: any) {
        this._taskId = value;
    }

    private async sendIceFeedbackMessageToTheConsumer() {
        try {

            this.consumerUser = collect(this.conversation.participants).firstWhere('role', 'consumer')
            this.channelUser = collect(this.conversation.participants)
                .where('id', this.channelAccountId)
                .where('role', 'agent')
                .first()

            const iceMessageContent = "ice_message_content"
            const sourceMid = getAutoGeneratedSourceMid('AGENT_ICE_FEEDBACK__')
            const conversationId = this.conversationId

            const iceFeedbackMessageData: ConversationMessageCreateInputInterface = {
                messageType: 'iceFeedback',
                content: iceMessageContent,
                from: this.channelUser,
                to: this.consumerUser,
                threadId: this.threadId,
                createdTime: generateTimestamp(),
                channelAccountId: this.channelAccountId,
                sourceMid,
                conversationId,
                isAgentReplied: true,
                iceFeedback: true
            }

            const agentIceMessageCreateResponse = await (new ConversationMessageCreateAction(
                this.workspaceId,
                this.channelId,
                this.userId,
                this.conversationId,
                this._task.taskId,
                sourceMid,
                this.channel,
                iceFeedbackMessageData
            )).execute()

            this.agentIceMessage = agentIceMessageCreateResponse.conversationMessage
            this.conversation = agentIceMessageCreateResponse.conversation

            throwIf(!this.agentIceMessage?._id, new Error('Agent Ice Feedback Message Create Failed'))

            return Promise.resolve(this.agentIceMessage)

        }catch (e) {
            return Promise.reject(e)
        }
    }
}