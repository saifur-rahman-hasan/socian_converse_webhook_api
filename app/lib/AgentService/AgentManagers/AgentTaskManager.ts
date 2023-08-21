import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";
import collect from "collect.js";

export default class AgentTaskManager {
    private agentId: number;
    private assignedTasks: any;

    constructor(agentId: number) {
        this.agentId = agentId
        this.assignedTasks = [];
    }

    getAssignedTasksQuery() {
        return bodybuilder()
            .query('term', 'assigned', true)
            .query('term', 'assignedAgentId', this.agentId)
            .query('exists', 'sourceData.workspaceId')
            .query('exists', 'sourceData.channelId')
            .query('exists', 'sourceData.conversationId')
            .query('exists', 'sourceData.threadId')
            .query('exists', 'sourceData.messageId')
            .sort('createdAt', 'asc')
            .build();
    }

    async getAssignedTasks(): Promise<any> {
        const elasticsearchDBAdapter = new ElasticsearchDBAdapter('socian_converse')
        const AGENT_TASKS_INDEX = '__agent_tasks'

        try {
            const assignedTasks = await elasticsearchDBAdapter.execQuery(
                AGENT_TASKS_INDEX,
                this.getAssignedTasksQuery()
            )

            const assignedTasksDocs = assignedTasks?.hits?.hits || []

            if(assignedTasksDocs.length > 0){
                this.assignedTasks = collect(assignedTasksDocs)
                    .map(task => ({_id: task._id, ...(<object> task._source)}))
                    .toArray()

                return this.assignedTasks
            }
        }catch (e) {
            return []
        }
    }


    async getTasksByThread(thread_id): Promise<any> {
        const elasticsearchDBAdapter = new ElasticsearchDBAdapter('socian_converse')
        const AGENT_TASKS_INDEX = '__agent_tasks'
        const query = bodybuilder()
            .query('term', 'sourceData.threadId', thread_id)
            .query('exists', 'sourceData.threadId')
            .sort('createdAt', 'asc')
            .build();
        const assignedTasks = await elasticsearchDBAdapter.execQuery(
            AGENT_TASKS_INDEX,
            query
        )

        const assignedTasksDocs = assignedTasks?.hits?.hits || []

        if(assignedTasksDocs.length > 0){
            const tasks = collect(assignedTasksDocs)
                .map(task => ({_id: task._id, ...(<object> task._source)}))
                .toArray()

            return tasks[0]
        }
        return {}
    }
}