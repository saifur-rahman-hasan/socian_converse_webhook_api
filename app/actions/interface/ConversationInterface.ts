export interface ConversationParticipantUserInterface {
    id: string;
    name: string;
    role: string;
    email?: string;
}

export interface ConversationLastMessageInterface {
    id: string,
    messageType: string,
    content: string | object
    createdTime: string
}


export interface ConversationCreateInputInterface {
    conversationUid: string,
    workspaceId: number,
    channelId: number,
    currentThreadId: number | null
    participants: ConversationParticipantUserInterface [],
    sourceConversationId: string | null,
    sourceData: object | null,
    lastMessage: ConversationLastMessageInterface | null,
    messagesCount: number,
    canReply: boolean,
    conversationClosed?: boolean
}

export interface ConversationUpdateInputInterface {
    currentThreadId?: number | null | string
    participants?: ConversationParticipantUserInterface [],
    sourceConversationId?: string | null,
    sourceData?: object | null,
    lastMessage?: ConversationLastMessageInterface | null,
    messagesCount?: number,
    canReply?: boolean,
    conversationClosed?: boolean
}

export interface ConversationDocOutputInterface extends ConversationCreateInputInterface {
    _id: string,
    createdAt: string,
    updatedAt: string,
}

export interface ConversationMessageCreateInputInterface {
    messageType: string,
    content: object | string,
    from: ConversationParticipantUserInterface;
    to: ConversationParticipantUserInterface;
    threadId: number|string;
    createdTime: string | null;
    channelAccountId: string,
    sourceMid: string,
    conversationId?: string,
    isAgentReplied?: boolean,
    iceFeedback?: boolean,
    messageSentStatus?: any,
    messageSentResponse?: any,
    sourceData?:any
    closed?: boolean
    consumerForceClosed?: boolean
}

export interface ConversationMessageDocOutputInterface extends ConversationMessageCreateInputInterface{
    _id: string,
    createdAt: string,
    updatedAt: string
    closed?: boolean,
}

export interface ThreadAuthorUserInterface {
    id: string,
    name: string,
    role: string
}

export interface ThreadCreateInputInterface {
    workspaceId: number,
    channelId: number,
    conversationId: string,
    messageId?: string | null,
    title: string | null,
    content: string | null,
    author: ThreadAuthorUserInterface | object
}

export enum TaskStatusEnum {
    New = "new",
    Assigned = "assigned",
    Opened = "opened",
    Accepted = "accepted",
    Declined = "declined",
    Forwarded = "forwarded",
    Completed = "completed",
    None = ""
}

export interface TaskSourceDataInterface {
    workspaceId: number;
    channelId: number;
    conversationId: string;
    threadId: number | string;
    messageId: string | null;
}

export interface TaskCreateInputInterface {
    taskId: number | string;
    taskDescription: string| object;
    sourceData: TaskSourceDataInterface;
}

export interface AssignableTaskCreateDocInputInterface {
    taskId: number |string;
    taskDescription: string| object;
    taskStatus: string | TaskStatusEnum;
    taskStartTimestamp: Date | string;
    taskEndTimestamp: Date | string | null;
    taskDurationSeconds: number;
    sourceData: TaskSourceDataInterface;
    taskActivityGroupId: string | null;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId: number | null,
    assignedTaskIsClosed: boolean,
    assignedTaskIsFullFilled: boolean, // When Consumer Ice Feedback Received we will make this true
    assignedTaskIsVerifiedAndClosed: boolean,
    consumerIceFeedbackReceived?: boolean,
    consumerForceClosed?: boolean
}

export interface ConversationThreadTaskDocReadInterface {
    _id: string;
    taskId: number;
    taskDescription: string;
    taskStatus: string | TaskStatusEnum;
    taskStartTimestamp: string;
    taskEndTimestamp: string | null;
    taskDurationSeconds: number;
    sourceData: TaskSourceDataInterface;
    taskActivityGroupId: string | null;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId: number | null,
    assignedTaskIsClosed: boolean,
    assignedTaskIsFullFilled: boolean,
    assignedTaskIsVerifiedAndClosed: boolean
}

export interface AssignableTaskDocOutputInterface {
    _id: string;
    taskId: number;
    taskDescription: string;
    taskStatus: string | TaskStatusEnum;
    taskStartTimestamp: string;
    taskEndTimestamp: string | null;
    taskDurationSeconds: number;
    sourceData: TaskSourceDataInterface;
    taskActivityGroupId: string | null;
    assignable: boolean;
    assigned: boolean;
    assignedAgentId: number | null,
    assignedTaskIsClosed: boolean,
    assignedTaskIsFullFilled: boolean,
    assignedTaskIsVerifiedAndClosed: boolean
}

export interface ConversationThreadCreateInputInterface {}

export interface ConversationThreadOutputInterface {
    id: number,
    workspaceId: number,
    channelId: number,
    conversationId: string,
    messageId: string,
    title: string | null,
    content: string | null,
    author: ThreadAuthorUserInterface | object,
    isClosed: boolean,
    isPublished: boolean,
    createdAt: string,
    updatedAt: string
}

export interface ConversationMessageUpdateInputInterface {
    threadId?: number | null,
    sourceMid?: string
}

export interface AccountInfoResponseInterface {
    id: string,
    name: string,
    email?: string,
    phone?: string,
}

export interface ThreadMessage {
    _id: string;
    messageType: string;
    isAgentReplied: boolean;
    iceFeedback: boolean;
    closed?: boolean;
}