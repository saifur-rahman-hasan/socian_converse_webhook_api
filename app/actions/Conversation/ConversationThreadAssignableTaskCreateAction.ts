import BaseAction from "@/actions/BaseAction";
import {
    AssignableTaskDocOutputInterface,
    ConversationMessageCreateInputInterface,
    TaskCreateInputInterface,
    TaskSourceDataInterface
} from "@/actions/interface/ConversationInterface";
import {ConversationCreateActionParamsInterface} from "@/actions/interface/ConversationActionClassInterface";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import {throwIf} from "@/lib/ErrorHandler";
import {ActionResponseInterface} from "@/actions/interface/ActionResponseInterface";

export interface AssignableTaskCreateDataInterface {
    conversationId: string,
    threadId: number,
    messageDocId: string,
    threadTitle: string
}

export default class ConversationThreadAssignableTaskCreateAction extends BaseAction {
    private workspaceId: number;
    private channelId: number;
    private userId: number;
    private params: ConversationCreateActionParamsInterface;

    private taskQuery: TaskQuery
    private data: AssignableTaskCreateDataInterface;

    constructor(
        params: ConversationCreateActionParamsInterface,
        data: AssignableTaskCreateDataInterface
    ) {
        super();

        this.workspaceId = params?.workspaceId;
        this.channelId = params?.channelId;
        this.userId = params?.userId;

        this.params = params
        this.data = data

        this.taskQuery = new TaskQuery()
    }

    async execute() {
        try {
            const conversationDocId = this.data.conversationId
            const threadId = this.data.threadId
            const messageDocId = this.data.messageDocId
            const threadTitle = this.data.threadTitle

            // TODO: 6. create an agent assignable task
            const assignableTask: AssignableTaskDocOutputInterface = await this.createNewAssignableTask(
                conversationDocId,
                threadId,
                messageDocId,
                threadTitle
            )

            throwIf(!assignableTask?._id, new Error("Invalid assignable task data"))
            this.setVirtualData('assignableTask', assignableTask)

            const promiseData: ActionResponseInterface = this.getActionResolvedData()
            return Promise.resolve(promiseData)

        }catch (e) {
            this.setActionErrorReject(e)
            return Promise.reject(e)
        }
    }

    private async createNewAssignableTask(
        conversationDocId: string,
        threadId: number,
        messageId: string,
        messageText:string
    ) {
        try {

            const taskSourceData: TaskSourceDataInterface = {
                workspaceId: this.workspaceId,
                channelId: this.channelId,
                conversationId: conversationDocId,
                threadId: threadId,
                messageId: messageId
            }

            const newTaskData: TaskCreateInputInterface = {
                taskId: threadId,
                taskDescription: messageText,
                sourceData: taskSourceData
            }

            const promiseData: AssignableTaskDocOutputInterface = await this.taskQuery.createAndGetTaskDoc(newTaskData)
            return Promise.resolve(promiseData)

        }catch (e) {
            return Promise.reject(e)
        }
    }
}