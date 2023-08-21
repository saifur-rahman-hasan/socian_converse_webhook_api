import bodybuilder, {Bodybuilder} from "bodybuilder";

export default class EsQuery {
    static query(): Bodybuilder {
        return bodybuilder();
    }

    static getMessageCountByThreadIdQuery(threadId): Bodybuilder {
         // We only need the count, so set the size to 0
        return bodybuilder()
            .query('term', 'threadId', threadId)
            .size(0)
    }

    static findTaskByThreadIdQuery(threadId: number) {
        return bodybuilder()
            .query('term', 'taskId', threadId)
            .size(1)
            .build();
    }

    static findAssignableTaskByThreadIdQuery(taskId: number) {
        return bodybuilder()
            .query('term', 'taskId', taskId)
            .query('term', 'taskStatus', 'new')
            .query('term', 'assignable', true)
            .query('term', 'assigned', false)
            .query('term', 'assignedTaskIsClosed', false)
            .size(1)
    }

    static getAgentAssignedTasksQuery(
        agentId: number,
        taskId: number | null = null,
        assignedTaskIsClosed: boolean = false,
        maxLimit: number = 10000
    ) {
        const queryBuilder = bodybuilder()
            .query('term', 'assigned', true)
            .query('term', 'assignedAgentId', agentId)
            .query('term', 'assignedTaskIsClosed', assignedTaskIsClosed)
            .sort('createdAt', 'desc');

        if (taskId !== null) {
            queryBuilder.query('term', 'taskId', taskId);
        }

        queryBuilder.size(maxLimit);

        return queryBuilder.build();
    }

    static getAgentAssignedNotClosedTasksQuery(agentId: number) {
        return bodybuilder()
            .query('term', 'assignedAgentId', agentId.toString())
            .query('term', 'taskStatus', 'assigned')
            .query('term', 'assignable', false)
            .query('term', 'assigned', true)
            .query('term', 'assignedTaskIsClosed', false)
            .size(10000)
            .build()
    }



    static getAgentAssignedNotClosedTaskByIdQuery(agentId: number) {
        return bodybuilder()
            .query('term', 'assignedAgentId', agentId.toString())
            .query('term', 'taskStatus', 'assigned')
            .query('term', 'assignable', false)
            .query('term', 'assigned', true)
            .query('term', 'assignedTaskIsClosed', false)
            .size(10000)
            .build()
    }

    static getFindUniqueConversationByUidQuery(conversationUid: string) {
        return bodybuilder()
            .query('match', 'conversationUid', conversationUid)
            .size(1)
            .build();
    }

    static findChannelConsumerQuery(
        channelAccountId: string,
        channelType: string,
        consumerId: string
    ) {

        return bodybuilder()
            .query('match', 'channelAccountId', channelAccountId)
            .andQuery('match', 'channelType.keyword', channelType)
            .andQuery('match', 'consumerId', consumerId)
            .size(1)
            .build();
    }

    static findConversationByConsumerIdQuery(channelId: number, consumerId: string) {
        return bodybuilder()
            .query('term', 'participants.id', consumerId)
            .query('term', 'canReply', true)
            .query('term', 'conversationClosed', false)
            .query('match', 'channelId', channelId)
            .size(1)
            .build()
    }
    
    static findConversationByConsumerNameQuery(channelId: number, consumerName: string) {
        return bodybuilder()
            .query('match', 'participants.name', consumerName)
            .query('term', 'participants.role', "consumer")
            .query('match', 'channelId', channelId)
            .size(10)
            .build()
    }

    static findConsumerAssignedAgentTaskByThreadIdQuery(threadId: number) {
        return bodybuilder()
            .query('term', 'taskId', threadId)
            .query('term', 'assignable', false)
            .query('term', 'assigned', true)
            // .query('term', 'assignedTaskIsClosed', false)
            .size(1)
            .build();
    }

    static getConsumerMessagesByConsumerIdQuery(consumerId: string, size: number = 1000) {
        return bodybuilder()
            .orQuery('term', 'from.id', consumerId)
            .orQuery('term', 'to.id', consumerId)
            .size(size)
            .build()

    }
}