export class Message {
    conversationId: string;
    from: object;
    to: object;
    message: {
        type: string;
        content: string;
    };
    threadId: number;
    thread: object;
    sourceMessageId: string;
    created_at: string;
    updated_at: string;

    constructor(
        conversationId: string,
        from: object,
        to: object,
        message: { type: string; content: string },
        threadId: number,
        thread: object,
        sourceMessageId: string,
        created_at: string,
        updated_at: string
    ) {
        this.conversationId = conversationId;
        this.from = from;
        this.to = to;
        this.message = message;
        this.threadId = threadId;
        this.thread = thread;
        this.sourceMessageId = sourceMessageId;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
