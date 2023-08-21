export interface TaskObjectInterface {
    taskId: number;
    taskDescription: string;
    taskStatus: string;
    taskStartTimestamp: string;
    taskEndTimestamp: string;
    taskDurationSeconds: number;
    sourceData: {
        workspaceId: number;
        channelId: number;
        conversationId: string;
        threadId: number;
        messageId: string;
    };
    taskActivityGroupId: string;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId: number;
    assignedTaskIsClosed: boolean;
    assignedTaskIsFullFilled: boolean;
    assignedTaskIsVerifiedAndClosed: boolean;
    createdAt: string;
    updatedAt: string;
    agentNotes: string;
}
