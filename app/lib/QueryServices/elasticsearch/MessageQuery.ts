import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import {Message} from "@/lib/QueryServices/models/Message";
import {
    ConversationMessageCreateInputInterface,
    ConversationMessageDocOutputInterface
} from "@/actions/interface/ConversationInterface";
import bodybuilder, {Bodybuilder} from "bodybuilder";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";
import {debugLog} from "@/utils/helperFunctions";
import collect from "collect.js";

export default class MessageQuery {
    private client: ElasticsearchDBAdapter;
    private es_index: string;
    private newDate: Date;

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__messenger_conversation_messages`;
        this.newDate = new Date
    }

    async removeMessageById(
        messageId: string,
    ) {
        try {
            const deleteResponse = await this.client.deleteDocumentById(this.es_index, messageId);

            return Promise.resolve(deleteResponse);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async removeMessagesByConversationId(
        conversationId: string,
    ) {
        try {
            const query = bodybuilder()
                .query('term', 'conversationId.keyword', conversationId)
                .build()

            const queryResponse = await this.client.execQuery(this.es_index, query);
            const messages = this.client.getFormattedDocResults(queryResponse)
            const messageIds = collect(messages).pluck('_id').toArray()
            messageIds.forEach((messageId: string) => {
                this.client.deleteDocumentById(this.es_index, messageId)
            })

            return Promise.resolve(messages);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async removeMessagesByConversationIdAndThreadId(
        conversationId: string,
        threadId: number
    ) {
        try {
            const query = bodybuilder()
                .query('term', 'conversationId', conversationId)
                .query('term', 'threadId', threadId)
                .build()

            const deleteResponse = await this.client.deleteDocumentsByQuery(this.es_index, query);

            return Promise.resolve(deleteResponse);
        } catch (e) {
            return Promise.reject(e);
        }
    }


    async saveMessageToEs(message: Message) {
        try {
            return await this.client.createAndGetDocument(
                this.es_index,
                message
            )
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async findMessageDocById(messageDocId) {
        try {
            const queryResponse = await this.client
                .getDocumentById(
                    this.es_index,
                    messageDocId
                )

            const messageDoc : ConversationMessageDocOutputInterface = this.client.getFormattedFirstResult(queryResponse)
            return Promise.resolve(messageDoc)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async findUniqueConversationMessageDoc(conversationDocId, fbMessageId) {
        try {
            const messageDocs = await this.client
                .getDocumentsByQuery(
                    this.es_index,
                    null,
                    {
                        conversationId: conversationDocId,
                        sourceMessageId: fbMessageId
                    },
                    null,
                    null,
                    null,
                    1
                )

            return messageDocs?.length > 0 ? messageDocs[0] : null
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async createNewConversationMessage(channel, conversationDoc, pageId, fbMessageId, fromConsumer, toAgent, textMessage, messageType) {
        try {
            const currentThreadId = parseInt(conversationDoc?.currentThreadId)
            const channelAccountId = channel.channelData?.accountId || channel.channelData?.id || pageId || undefined

            if (!channelAccountId) {
                throw new Error('channelAccountId not found')
            }

            let fromParticipantRole = channelAccountId.toString() === fromConsumer?.id ? 'agent' : 'consumer'
            let toParticipantRole = channelAccountId.toString() === toAgent?.id ? 'agent' : 'consumer'

            const fromParticipant = {
                "id": fromConsumer?.id,
                "name": fromConsumer?.name || 'The Customer',
                "role": fromParticipantRole,
                "image": null
            }

            const toParticipant = {
                "id": toAgent?.id,
                "name": toAgent?.name || 'The Agent',
                "role": toParticipantRole,
                "image": null
            }

            const messageContext = {
                "type": messageType,
                "content": textMessage || 'context not found'
            }

            const message = new Message(
                conversationDoc?._id,
                fromParticipant,
                toParticipant,
                messageContext,
                currentThreadId,
                conversationDoc?.thread || null,
                fbMessageId || null,
                new Date().toString(),
                new Date().toString()
            )

            const newMessageDoc = await this.saveMessageToEs(message)

            return {
                _id: newMessageDoc?._id,
                ...(<Object>newMessageDoc._source)
            }
        } catch (err) {
            console.log("Error", err.toString())
        }
    }

    async updateConversationMessage(messageDocId, fbMessageId): Promise<ConversationMessageDocOutputInterface> {
        try {
            const messageUpdatableData = {
                sourceMessageId: fbMessageId,
                updated_at: new Date()
            }
            const promiseData: ConversationMessageDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                messageDocId,
                messageUpdatableData
            )

            return Promise.resolve(promiseData)
        } catch (err) {
            return Promise.reject(err)
        }
    }


    async createAndGetMessageDoc(data: ConversationMessageCreateInputInterface) {
        try {
            data['createdAt'] = this.newDate
            data['updatedAt'] = this.newDate

            const document = await this.client.createAndGetDocument(this.es_index, data)

            const promiseData: ConversationMessageDocOutputInterface = this.client.getFormattedFirstResult(document)

            return Promise.resolve(promiseData)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async findUniqueConversationMessageDocBySourceMid(conversationId: string, sourceMid: string): Promise<ConversationMessageDocOutputInterface> {
        try {
            const query = findConversationMessageDocBySourceMidQuery(conversationId, sourceMid).build()

            const docResult = await this
                .client
                .execQuery(
                    this.es_index,
                    query
                )

            const promiseResult: ConversationMessageDocOutputInterface = this.client.getFormattedFirstResult(
                this.client.getFirstResult(docResult)
            )

            return Promise.resolve(promiseResult)

        } catch (e) {
            return Promise.reject(e)
        }
    }

    async updateAndGetConversationMessageDoc(messageDocId, data: any): Promise<ConversationMessageDocOutputInterface> {
        try {
            data['updatedAt'] = this.newDate

            const promiseData: ConversationMessageDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                messageDocId,
                data
            );

            return Promise.resolve(promiseData)
        } catch (e) {
            return Promise.reject(e)
        }
    }


    async getTotalMessageCountByThread(thread_id): Promise<any> {
        let totalMessageCount = 0
        try {
            const query = bodybuilder()
                .query('term', 'threadId', thread_id.toString())
                .size(10000)
                .build();
            const totalMessageCountResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            totalMessageCount = totalMessageCountResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }
        return totalMessageCount
    }

    async countMessagesByConversationId(conversationDocId: string) {
        try {
            const countQuery = bodybuilder()
                .size(0) // Set size to 0 to only get the count, no actual messages
                .query('bool', (q) =>
                    q.filter('term', 'conversationId.keyword', conversationDocId)
                ).build();

            const result: any = await this.client.execQuery(
                this.es_index,
                countQuery
            )

            const totalCount = result.hits.total.value;

            return Promise.resolve(totalCount || 0)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getConversationMessages(conversationId: string, threadId: number = 0) {
        try {

            let query = getMessagesByConversationIdQuery(
                conversationId,
                threadId
            )
            // return Promise.resolve(query)

            const docResult = await this.client.execQuery(
                this.es_index,
                query
            )

            const docData = this.client.getFormattedDocResults(docResult)
            const promiseData: ConversationMessageDocOutputInterface[] = docData?.length > 0 ? docData : []

            return Promise.resolve(promiseData)

        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getConsumerMessagesByConsumerId(consumerId: string, size: number = 1000) {
        try {
            let query = EsQuery.getConsumerMessagesByConsumerIdQuery(consumerId, size)

            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const consumerMessages: ConversationMessageDocOutputInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(consumerMessages)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    async getTotalIceFeedBack(dateFrom = "1900-01-01", dateTo = "2100-12-31", channelIds,agentAllTaskList=[]): Promise<any> {

        let totalIceFeedbackMessage = []
        let totalIceFeedbackMessageY = 0
        let totalIceFeedbackMessageN = 0


        try {
            const channel_account_ids = []
            const channelQuery = new ChannelQuery()
            for (const chennel of channelIds) {
                const chennelData = await channelQuery.findChannelById(parseInt(chennel))
                if (chennelData?.channelData?.accountId) {
                    channel_account_ids.push(chennelData?.channelData?.accountId)
                }
            }
            const query = bodybuilder()
                .query('range', 'updatedAt', { gte: dateFrom, lte: dateTo })
                .filter('terms', 'channelAccountId', channel_account_ids)
                .query('match', 'messageType.keyword', 'text')
                .filter('bool', {
                    should: [
                        {
                            match: { content: 'Y' },
                        },
                        {
                            match: { content: 'N'},
                        }
                    ],
                    minimum_should_match: 1,
                })
                .size(10000)
                .build();
            const totalIceMessageResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )
            totalIceFeedbackMessage = totalIceMessageResponse?.hits?.hits
            if(totalIceFeedbackMessage.length>0){
                for (const item of totalIceFeedbackMessage){
                    if (item?._source.content === 'Y'){
                        totalIceFeedbackMessageY++
                    }else if (item?._source.content === 'N'){
                        totalIceFeedbackMessageN++
                    }
                    console.log("Item",item?._source.content)
                }
            }

        } catch
            (e) {
            console.log(e)
        }
        return {totalIceFeedbackMessageY,totalIceFeedbackMessageN}
    }
    async getTotalIceMessage(dateFrom = "1900-01-01", dateTo = "2100-12-31", channelIds,agentAllTaskList=[]): Promise<any> {
        let filterAgentThreads= []
        if (agentAllTaskList.length>0){
            for(const item of agentAllTaskList){
                filterAgentThreads.push(
                    {
                        match: { threadId: item._source.sourceData.threadId },
                    }
                )
            }
        }

        let total_ice_message = 0
        try {
            const channel_account_ids = []
            const channelQuery = new ChannelQuery()
            for (const chennel of channelIds) {
                const chennelData = await channelQuery.findChannelById(parseInt(chennel))
                if (chennelData?.channelData?.accountId) {
                    channel_account_ids.push(chennelData?.channelData?.accountId)
                }
            }
            // debugLog("channel_account_ids",channel_account_ids)
            const query = bodybuilder()
                .query('range', 'updatedAt', { gte: dateFrom, lte: dateTo })
                .filter('terms', 'channelAccountId', channel_account_ids)
                .filter('term', 'iceFeedback', true)
                .filter('bool', {
                    should: filterAgentThreads,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const totalIceMessageResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_ice_message = totalIceMessageResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }
        return total_ice_message
    }
    async getAgentFirstMessages(threadId): Promise<any> {
        try {
            const query = bodybuilder()
                .filter('term', 'threadId', threadId)
                .filter('term', 'from.role', 'agent')
                .sort('createdAt', 'asc')
                .size(10)
                .build();
            const totalAgentMessagesResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )
            if (totalAgentMessagesResponse?.hits?.hits?.length >= 2){
                return {
                    _id:totalAgentMessagesResponse?.hits?.hits[1]._id,
                    ...totalAgentMessagesResponse?.hits?.hits[1]._source
                }
            }else{
                return {}
            }

        } catch
            (e) {
            console.log(e)
            return {}
        }
    }
    async getAgentAndConsumerMessages(dateFrom = "1900-01-01", dateTo = "2100-12-31", channelIds,agentAllTaskList): Promise<any> {
        let filterAgentThreads= []
        if (agentAllTaskList.length>0){
            for(const item of agentAllTaskList){
                filterAgentThreads.push(
                    {
                        match: { threadId: item._source.sourceData.threadId },
                    }
                )
            }
        }

        let total_agent_message = 0
        let total_consumer_message = 0
        const channel_account_ids = []
        const channelQuery = new ChannelQuery()
        for (const channel of channelIds) {
            const channelData = await channelQuery.findChannelById(parseInt(channel))
            if (channelData?.channelData?.accountId) {
                channel_account_ids.push(channelData?.channelData?.accountId)
            }
        }

        try {
            const query = bodybuilder()
                .query('range', 'updatedAt', { gte: dateFrom, lte: dateTo })
                .filter('terms', 'channelAccountId', channel_account_ids)
                .filter('bool', {
                    should: filterAgentThreads,
                    minimum_should_match: 1,
                })
                .filter('term', 'from.role', 'agent')
                .size(0)
                .build();
            const totalAgentMessagesResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_agent_message = totalAgentMessagesResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }

        try {
            const query = bodybuilder()
                .query('range', 'updatedAt', { gte: dateFrom, lte: dateTo })
                .filter('terms', 'channelAccountId', channel_account_ids)
                .filter('term', 'from.role', 'consumer')
                .filter('bool', {
                    should: filterAgentThreads,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const totalConsumerMessagesResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_consumer_message = totalConsumerMessagesResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }
        return {
            total_agent_message:total_agent_message,
            total_consumer_message:total_consumer_message
        }
    }

    async getMessagesCountByThreadId(threadId: number) {
        try {
            const query = EsQuery.getMessageCountByThreadIdQuery(threadId).build()
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const count = this.client.getCountFromResponse(queryResponse)

            return Promise.resolve(count)

        }catch (e) {
            return Promise.reject(e)
        }
    }
}

export function findConversationMessageDocBySourceMidQuery(conversationId: string, sourceMid: string): Bodybuilder {
    return bodybuilder()
        .size(1)
        .query('bool', (q) =>
            q
                .filter('term', 'sourceMid.keyword', sourceMid)
                .filter('term', 'conversationId.keyword', conversationId)
        );
}


export function getMessagesByConversationIdQuery(conversationDocId: string, threadId: number = 0) {
    const query = bodybuilder();
    query.filter('exists', 'field', 'sourceMid');

    if (threadId > 0) {
        query.filter('match_phrase', 'conversationId', conversationDocId);
        query.filter('match_phrase', 'threadId', threadId);
    } else {
        query.filter('match_phrase', 'conversationId', conversationDocId);
    }

    query.sort('createdAt', 'asc')

    // Add the size of 200 to the query
    query.size(10000);

    return query.build()
}