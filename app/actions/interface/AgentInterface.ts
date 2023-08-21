import {ConversationParticipantUserInterface} from "@/actions/interface/ConversationInterface";

export interface AgentInfoInsertInterface {}
export interface AgentInfoUpdateInterface {}
export interface AgentInfoReadInterface {}
export interface AgentInfoDeleteInterface {}

export interface AssignedTaskClosingTag {
    id: number | string;
    name: string;
}

export interface AgentAssignedTaskCloseInsertInterface {
    taskId: number;
    iceFeedback: boolean;
    assignedTags: AssignedTaskClosingTag[];
    closeNote: string;
}

export interface AgentAssignedTaskDocReadInterface {
    _id: string;
    taskId: number;
    taskDescription: string;
    taskStatus: string;
    taskStartTimestamp: string;
    taskEndTimestamp: string | null;
    taskDurationSeconds: number;
    sourceData: {
        workspaceId: number;
        channelId: number;
        conversationId: string;
        threadId: number;
        messageId: string;
    };
    taskActivityGroupId: string | null;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId?: number | null;
    assignedTaskIsClosed: boolean;
    assignedTaskIsFullFilled: boolean;
    assignedTaskIsVerifiedAndClosed: boolean;
    createdAt: string;
    updatedAt: string;
    author?: ConversationParticipantUserInterface | null;
    consumerIceFeedbackReceived?: boolean,
    consumerForceClosed?: boolean,
    agentLog?: object | null
}


export interface AgentAssignTaskActionParamInterface {
    agentId: number
    threadId: number
}


export interface AgentAssignTaskOutputInterface {
    agentId: number
    threadId: number
}

export interface AgentAssignedActiveTaskDocReadInterface extends AgentAssignedTaskDocReadInterface {
    assignable: false;
    assigned: true;
    assignedAgentId: number;
    assignedTaskIsClosed: false;
    assignedTaskIsFullFilled: false;
    assignedTaskIsVerifiedAndClosed: false;
    consumerForceClosed?: false
}