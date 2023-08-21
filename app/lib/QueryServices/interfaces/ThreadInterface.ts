import {ThreadAuthorUserInterface} from "@/actions/interface/ConversationInterface";

export interface ThreadCreateInputOutputInterfaceEs {
    _id: string | null,
    workspaceId: number,
    channelId: number,
    conversationId: string,
    messageId?: string | null,
    title: string | null,
    content: string | null,
    author: ThreadAuthorUserInterface | object,
    isClosed: boolean | false,
    isPublished: boolean | false,
    createdAt: Date| null,
    updatedAt: Date | null,
}