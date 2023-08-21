export interface AgentWorkspaceCommonProperties {
    workspaceId: number;
    agentId: number;
}

export interface AgentActivityLogDataInterface {
    workspaceId: number | null;
    agentId: number | null;
    channelId: number | null;
    conversationId: string | null;
    threadId: number | null;
    activityInfo: string;
    activityState: "start" | "end";

    parentActivityId: string | null;
    activityGroup: string | null;
    activityType: string;
    activityTime: string;
    activityData: object | null;
}