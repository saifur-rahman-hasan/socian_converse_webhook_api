import {throwIf} from "@/lib/ErrorHandler";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import {
    ThreadCreateInputOutputInterfaceEs
} from "@/lib/QueryServices/interfaces/ThreadInterface";

export default class ThreadQueryEs {
    client: ElasticsearchDBAdapter;
    es_index: string;
    private newDate: Date;

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__threads`;
        this.newDate = new Date
    }

    async createThread(workspaceId, channelId, conversationDocId,conversationMessageDocId,fromConsumer, title, textMessage) {
        try {
            const threadInputData: ThreadCreateInputOutputInterfaceEs = {
                _id:null,
                workspaceId:workspaceId,
                channelId:channelId,
                conversationId: conversationDocId,
                messageId: conversationMessageDocId,
                title: title,
                content: textMessage,
                author: { ...fromConsumer },
                isClosed:false,
                isPublished:false,
                createdAt:new Date(),
                updatedAt:new Date(),
            }

            const indexResponse = await this.client.createDocument(
                this.es_index,
                threadInputData
            );
            throwIf(!indexResponse || indexResponse.result !== 'created',new Error("Thread not found")) ;

            const createdDocument = await this.findThreadById(indexResponse._id)
            return Promise.resolve(createdDocument);
        } catch (err) {
            console.log("Error", err.toString());
            return Promise.resolve(null)
        }
    }

    async findThreadById(threadId:string):Promise<ThreadCreateInputOutputInterfaceEs> {
        try {
            const searchResponse:any = await this.client.findDocumentById(this.es_index,threadId);
            throwIf(Object.keys(searchResponse).length==0,new Error("Thread not found")) ;
            const promiseData: ThreadCreateInputOutputInterfaceEs = this.client.getFormattedJoinedDocId(searchResponse)
            return Promise.resolve(promiseData);
        } catch (err) {
            console.log("Error:", err.toString());
            return Promise.resolve(null)
        }
    }

    async closeThread(threadId: string): Promise<ThreadCreateInputOutputInterfaceEs> {
        try {
            const messageUpdatableData = {
                isClosed: true,
                updatedAt: new Date()
            }
            const promiseData: ThreadCreateInputOutputInterfaceEs = await this.client.updateAndGetDocumentById(
                this.es_index,
                threadId,
                messageUpdatableData
            )
            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.resolve(null)
        }
    }
}
