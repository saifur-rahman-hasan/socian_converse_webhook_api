import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {calculateDurationInSeconds, calculateTaskDurationInSeconds} from "@/utils/helperFunctions";
import {throwIf} from "@/lib/ErrorHandler";
import {AgentAssignedTaskDocReadInterface} from "@/actions/interface/AgentInterface";

export default class AgentTaskQuery {
    private client: ElasticsearchDBAdapter;
    private es_index: string;
    private newDate: Date;

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__agent_tasks`;
        this.newDate = new Date
    }

    async findAgentAssignedTaskByDocId(
        agentId: number,
        taskDockId: string
    ) {
        try {
            const queryResponse = await this.client.getDocumentsByQuery(
                this.es_index,
                {
                    _id: taskDockId,
                    assignedAgentId: agentId,
                },
                null, null, null, null, 1
            )

            const assignedTask: AgentAssignedTaskDocReadInterface = this.client.getFormattedFirstResult(queryResponse[0])

            return Promise.resolve(assignedTask)
        }catch (e) {
            return Promise.reject("The selected task is not not found or not assigned to you.")
        }
    }

    async closeAgentAssignedTask(
        agentId: number,
        taskDocId: string,
        closingTags: any[] = [],
        taskStartTimestamp: string
    ) {
        try {
            const data = {
                taskStatus: 'AgentTaskClosed',
                taskEndTimestamp: this.newDate.toISOString(),
                taskDurationSeconds: calculateTaskDurationInSeconds(taskStartTimestamp), // TODO: Need to work on calculate duration
                assignable: false,
                closingTags: closingTags,
                assignedTaskIsClosed: true,
            }

            const queryResponse = await this.client.updateAndGetDocumentById(
                this.es_index,
                taskDocId,
                data
            )

            return Promise.resolve(queryResponse)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async closeAgentAssignedTaskByThreadId(
        agentId: number,
        threadId: number,
        closingTags: any[] = [],
        closeNote: null
    ) {
        try {

            const findTaskDocQueryRes = await this.client.getDocumentsByQuery(
                this.es_index,
                {taskId: threadId},
                null,
                null,
                null,
                null,
                1
            )

            const findTaskDocData: AgentAssignedTaskDocReadInterface = this.client.getFormattedFirstResult(findTaskDocQueryRes[0])
            const taskDocId = findTaskDocData?._id
            throwIf(!taskDocId, new Error('You are not allowed to close the thread.'))

            const updatableTaskData = {
                taskStatus: 'AgentTaskClosed',
                taskEndTimestamp: this.newDate.toISOString(),
                taskDurationSeconds: calculateTaskDurationInSeconds(findTaskDocData.taskStartTimestamp),
                assignable: false,
                closingTags: closingTags,
                closeNote: closeNote || null,
                closedBy: agentId
            }

            const updatedTaskDoc = await this.client.updateAndGetDocumentById(
                this.es_index,
                taskDocId,
                updatableTaskData
            )

            return Promise.resolve(updatedTaskDoc)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async updateAgentAssignedTaskByDocId(taskDocId: string, data: any) {
        try {

            const updatableData = {
                ...data,
                updatedAt: this.newDate
            }

            const updatedTask : AgentAssignedTaskDocReadInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                taskDocId,
                updatableData
            )

            return Promise.resolve(updatedTask)
        }catch (e) {
            return Promise.reject("Failed to updated Agent Assigned Task Data")
        }
    }
}