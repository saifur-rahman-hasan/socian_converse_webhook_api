import prisma from "@/lib/prisma";
import {
    ConversationThreadOutputInterface,
    ThreadCreateInputInterface
} from "@/actions/interface/ConversationInterface";
import {throwIf} from "@/lib/ErrorHandler";
import {debugLog} from "@/utils/helperFunctions";
import ThreadQueryEs from "@/lib/QueryServices/elasticsearch/ThreadQueryEs";

export default class ThreadQuery {
    private now: Date
    private prismaClient: any
    private threadQueryEs: ThreadQueryEs;

    constructor() {
        this.now = new Date
        this.prismaClient = prisma
        
        this.threadQueryEs = new ThreadQueryEs()
    }

    async removeThreadsByConversationId(conversationId: string): Promise<boolean> {
        try {
            // Delete all threads with the given conversationId
            const deleteResponse = await this.prismaClient.thread.deleteMany({
                where: {
                    conversationId: conversationId
                }
            });

            return Promise.resolve(deleteResponse);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async createNewThread(data: ThreadCreateInputInterface) {
        try {
            const threadAuthor = {...data.author}

            const thread: any = await prisma.thread.create({
                data: {
                    workspaceId: data.workspaceId,
                    channelId: data.channelId,
                    conversationId: data.conversationId,
                    messageId: data?.messageId || null,
                    title: data.title,
                    content: data.content,
                    author: threadAuthor,
                    createdAt: this.now,
                    updatedAt: this.now,
                }
            })

            throwIf (!thread?.id, new Error("Invalid Thread object"))
            const promiseData: ConversationThreadOutputInterface = thread

            return Promise.resolve(promiseData)
        } catch (error) {
            throw new Error("Failed to create Thread.")
        }
    }

    async findThreadById(threadId: number): Promise<ConversationThreadOutputInterface> {
        try {
            debugLog('threadId', threadId)

            throwIf(!threadId, new Error("Invalid threadId"))

            const thread: ConversationThreadOutputInterface = await this.prismaClient.thread.findFirst({
                where: {id: threadId}
            })

            return Promise.resolve(thread)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async findThreadByQuery(where: object): Promise<any> {
        try {
            const thread = await prisma.thread.findFirst({
                where: where
            })

            return Promise.resolve(thread)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async updateThreadByQuery(where: object, data: object) {
        try {
            const thread = await prisma.thread.update({
                where: where,
                data: data
            })

            return Promise.resolve(thread)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async closeTheThread(threadId: number): Promise<ConversationThreadOutputInterface> {
        try {
            const thread: ConversationThreadOutputInterface = await this.prismaClient.thread.update({
                where: {id: threadId},
                data: {
                    isClosed: true,
                    updatedAt: this.now
                }
            })

            return Promise.resolve(thread)
        }catch (e) {
            return Promise.reject(e)
        }
    }
}
