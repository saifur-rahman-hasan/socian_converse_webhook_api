import {
    ConversationCreateInputInterface, ConversationDocOutputInterface, ConversationUpdateInputInterface,
} from "@/actions/interface/ConversationInterface";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import { throwIf } from "@/lib/ErrorHandler";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import { Conversation } from "@/lib/QueryServices/models/Conversation";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";
import bodybuilder from "bodybuilder";
import collect from "collect.js";
import {debugLog} from "@/utils/helperFunctions";


export default class ConversationQuery {

    client: ElasticsearchDBAdapter;
    es_index: string;

    private newDate: Date;

    private messageQuery: MessageQuery;
    threadQuery = new ThreadQuery()
    taskQuery = new TaskQuery()

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__messenger_conversations`;
        this.newDate = new Date
        
        this.messageQuery = new MessageQuery()
        
    }

    async removeConversationByUid(conversationUid: string) {
        try {
            const query = bodybuilder()
                .query('term', 'conversationUid', conversationUid)
                .size(1)
                .build()

            const queryResponse = await this.client.execQuery(this.es_index, query)
            const conversation = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            const deleteResponse = this.client.deleteDocumentById(this.es_index, conversation._id)

            return Promise.resolve(deleteResponse)
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findConversationByConsumerId(
        channelId: number,
        consumerId: string
    ): Promise<ConversationDocOutputInterface> {
        try {

            // Execute the query and get conversation documents
            const conversationDocResponse = await this.client.execQuery(
                this.es_index,
                EsQuery.findConversationByConsumerIdQuery(channelId, consumerId)
            );

            // Convert the Elasticsearch response to ConversationDocOutputInterface[]
            const conversationDoc: ConversationDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(conversationDocResponse));

            return Promise.resolve(conversationDoc);
        }catch (e) {
            return Promise.reject(e)
        }
    }
    
    async findConversationByConsumerName(
        channelId: number,
        consumerName: string
    ): Promise<any> {
        try {

            // Execute the query and get conversation documents
            const conversationDocResponse = await this.client.execQuery(
                this.es_index,
                EsQuery.findConversationByConsumerNameQuery(channelId, consumerName)
            );
            const conversationDocs: ConversationDocOutputInterface[] = this.client.getFormattedUniqueConsumerResults(conversationDocResponse)
            
            return Promise.resolve(conversationDocs);
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async getConversationsByIdList(conversationIdList: any) {
        try {

            const conversationListQuery = conversationIdList.map(_id => {
                return {
                    "match_phrase": {
                        "_id": _id
                    }
                }
            });

            const query = {
                "query": {
                    "bool": {
                        "should": conversationListQuery,
                        "minimum_should_match": 1
                    }
                }
            }

            // return query
            const conversationDocResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const conversationDocs: ConversationDocOutputInterface[] = this.client.getFormattedDocResults(conversationDocResponse)


            return Promise.resolve(conversationDocs)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async findConversationById(conversationDocId: string): Promise<ConversationDocOutputInterface> {
        try {
            const queryResponse = await this.client.findDocumentById(
                this.es_index,
                conversationDocId
            )

            const conversationDoc: ConversationDocOutputInterface = this.client.getFormattedFirstResult(queryResponse)

            return Promise.resolve(conversationDoc)
        }catch (e) {
            return Promise.reject("Conversation Doc Not found in (findConversationById)")
        }
    }

    async findUniqueConversationDoc(conversationUid) {
        try {
            const conversationDocs = await this.client
                .getDocumentsByQuery(
                    this.es_index,
                    null,
                    {conversationUid: conversationUid},
                    null,
                    null,
                    null,
                    1
                )
            return conversationDocs?.length > 0 ? conversationDocs[0] : null
        } catch (err) {
            console.log("Error", err.toString())
            return null
        }
    }

    async findUniqueConversationByUid(conversationUid: string) {
        try {
            const query = EsQuery.getFindUniqueConversationByUidQuery(conversationUid)

            const queryResponse = await this.client.execQuery(this.es_index, query )
            const docData : ConversationDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(docData)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    getFirstResult(data){
        return data?.hits?.hits[0] || null
    }

    async saveConversationToEs(conversation: Conversation) {
        try {
            // Return the created conversation document
            const newConversationDoc = await this.client.createDocument(
                this.es_index,
                conversation
            );

            const newConversationDocId = newConversationDoc?._id
            throwIf (!newConversationDocId, new Error('New conversation document not found'))

            return newConversationDocId
        } catch (err) {
            console.log("Error", err.toString())
            throw new Error('New conversation document not found')
        }
    }

    async updateConversationThreadId(newConversationDocId, thread) {
        try {
            const updatableConversationData = {
                currentThreadId: thread.id,
                thread: thread,
                updated_at: new Date().toString()
            }

            return await this.client.updateAndGetDocumentById(
                this.es_index,
                newConversationDocId,
                updatableConversationData
            )
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async closeTheConversation(conversationId: string) {
        try {
            const updatableConversationData = {
                currentThreadId: null,
                conversationClosed: true,
                canReplay: false,
                updatedAt: this.newDate
            }

            const promiseDatta: ConversationDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                conversationId,
                updatableConversationData
            )

            return Promise.resolve(promiseDatta)
        } catch (err) {
            console.log('Failed to close the conversation')
            console.log(err.message)
            
            return Promise.reject(err)
        }
    }

    async createNewConversation(conversationUid, workspaceId, channelId, fromConsumer, toAgent,textMessage,fbMsgId) {
        try {
            const participants = [
                {...fromConsumer},
                {...toAgent}
            ]

            const conversation = new Conversation(
                conversationUid,
                workspaceId,
                channelId,
                null,
                participants,
                null,
                null,
                true,
                new Date().toISOString(),
                new Date().toISOString(),
            )

            const newConversationDocId = await this.saveConversationToEs(conversation);

            const thread = await this.threadQuery.createThread(workspaceId, channelId, newConversationDocId, fromConsumer,textMessage);
            const task = await this.taskQuery.createTask(workspaceId, channelId, newConversationDocId, fbMsgId, thread?.id,thread?.content)
            return await this.updateConversationThreadId(newConversationDocId, thread);
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async updateConversationLastMessage(conversationDocId, lastMessageData) {
        try {
            return await this.client.updateAndGetDocumentById(
                this.es_index,
                conversationDocId,
                {
                    lastMessage: lastMessageData,
                    updatedAt: new Date(),
                    updated_at: new Date()
                }
            )
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async createAndGetConversationDoc(data: ConversationCreateInputInterface): Promise<ConversationDocOutputInterface> {
        try {
            data['conversationClosed'] = false
            data['createdAt'] = this.newDate
            data['updatedAt'] = this.newDate
            
            const document = await this.client.createAndGetDocument(this.es_index, data )
            const docData: ConversationDocOutputInterface = this.client.getFormattedFirstResult(document)

            return Promise.resolve(docData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async updateAndGetConversationDoc (conversationId: string, data: ConversationUpdateInputInterface): Promise<ConversationDocOutputInterface> {
        try {
            data['updatedAt'] = this.newDate

            const docResult: ConversationDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                conversationId,
                data
            )

            return Promise.resolve(docResult)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async getTotalMessagesCount(conversationDocId: string) {
        try {
            const messagesCount = await this.messageQuery.countMessagesByConversationId(conversationDocId)
            return Promise.resolve(messagesCount)
        }catch (e) {
            return Promise.reject(e)
        }
    }
}