export class Conversation {
    conversationUid: string;
    workspaceId: number;
    channelId: number;
    currentThreadId: number;
    participants: any[];
    sourceConversationId: string;
    lastMessage: {};
    webhookResolved:boolean
    created_at: string;
    updated_at: string;

    constructor(
        conversationUid: string,
        workspaceId: number,
        channelId: number,
        currentThreadId: number,
        participants: any[],
        sourceConversationId: string,
        lastMessage: {} ,
        webhookResolved: boolean,
        created_at: string,
        updated_at: string,
    ) {
        this.conversationUid = conversationUid;
        this.workspaceId = workspaceId;
        this.channelId = channelId;
        this.currentThreadId = currentThreadId;
        this.participants = participants;
        this.sourceConversationId = sourceConversationId;
        this.lastMessage = lastMessage;
        this.webhookResolved = webhookResolved;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
