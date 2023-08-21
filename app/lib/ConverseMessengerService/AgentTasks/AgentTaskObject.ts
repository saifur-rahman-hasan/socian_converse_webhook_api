enum TaskStatusEnum {
    New = "new",
    Assigned = "assigned",
    Opened = "opened",
    Accepted = "accepted",
    Declined = "declined",
    Forwarded = "forwarded",
    AgentTaskClosed = "agentTaskClosed",
    IceFeedbackSent = "iceFeedbackSent",
    IceFeedbackReplay = "iceFeedbackReplay",
    Closed = "closed",
    ClosedAndVerified = "closedAndVerified",
    Completed = "completed",
    None = ""
}

export default class AgentTaskObject {
    taskId: number;
    taskDescription: string;
    taskStatus: TaskStatusEnum | string;
    taskStartTimestamp: Date | null;
    taskEndTimestamp: Date | null;
    taskDurationSeconds: number;
    sourceData: {
        workspaceId: number;
        channelId: number;
        conversationId: string;
        threadId: number;
        messageId: string | null;
    };
    taskActivityGroupId: string;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId: number;
    assignedTaskIsClosed: boolean;
    assignedTaskIsFullFilled: boolean;
    assignedTaskIsVerifiedAndClosed: boolean;
    createdAt: Date;
    updatedAt: Date;
    agentNotes: string;

    constructor(
        taskId: number,
        taskDescription: string,
        taskStatus: string,
        sourceData: {
            workspaceId: number;
            channelId: number;
            conversationId: string;
            threadId: number;
            messageId: string;
        },
        taskActivityGroupId: string,
        assignable: boolean,
        assigned: boolean,
        assignedAgentId: number,
        assignedTaskIsClosed: boolean,
        assignedTaskIsFullFilled: boolean,
        assignedTaskIsVerifiedAndClosed: boolean,
        agentNotes: string
    ) {
        this.taskId = taskId;
        this.taskDescription = taskDescription;
        this.taskStatus = taskStatus;
        this.taskStartTimestamp = new Date();
        this.taskEndTimestamp = new Date();
        this.taskDurationSeconds = 0;
        this.sourceData = sourceData;
        this.taskActivityGroupId = taskActivityGroupId;
        this.assignable = assignable;
        this.assigned = assigned;
        this.assignedAgentId = assignedAgentId;
        this.assignedTaskIsClosed = assignedTaskIsClosed;
        this.assignedTaskIsFullFilled = assignedTaskIsFullFilled;
        this.assignedTaskIsVerifiedAndClosed = assignedTaskIsVerifiedAndClosed;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.agentNotes = agentNotes;
    }
}
