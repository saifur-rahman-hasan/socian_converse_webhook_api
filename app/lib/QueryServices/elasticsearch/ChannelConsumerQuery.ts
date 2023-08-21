import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";
import AgentTaskObject from "@/lib/ConverseMessengerService/AgentTasks/AgentTaskObject";
import {throwIf} from "@/lib/ErrorHandler";
import collect from "collect.js";
import {
    AssignableTaskCreateDocInputInterface,
    AssignableTaskDocOutputInterface,
    TaskCreateInputInterface,
} from "@/actions/interface/ConversationInterface";
import {AgentAssignedTaskDocReadInterface} from "@/actions/interface/AgentInterface";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";
import {ChannelConsumerDocOutputInterface, ConsumerDataOutputInterface} from "@/actions/interface/ChannelInterface";
import MessengerService from "@/lib/messenger/MessengerService";
import {debugLog} from "@/utils/helperFunctions";

export default class ChannelConsumerQuery {
    client: ElasticsearchDBAdapter;
    es_index: string;
    private newDate: Date;
    private maxLimit = 10000

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__channel_consumers`;
        this.newDate = new Date

        this.client.indexExists(this.es_index, true)
    }

    async createChannelConsumer(
        channelAccountId: string,
        channelType: string,
        consumerId: string,
        consumerData: ConsumerDataOutputInterface
    ) {
        try {

            const channelConsumerData = {
                channelAccountId,
                channelType,
                consumerId,
                consumerData,
                createdAt: this.newDate,
                updatedAt: this.newDate
            }

            const queryResponse = await this.client.createAndGetDocument(
                this.es_index,
                channelConsumerData
            )

            const channelConsumerDoc: ChannelConsumerDocOutputInterface = this.client.getFormattedFirstResult(queryResponse)
            return Promise.resolve(channelConsumerDoc)

        } catch (err) {
            throw new Error("Failed to create channel consumer")
        }
    }

    async findChannelConsumerByIdOrNull(
        channelAccountId: string,
        channelType: string,
        consumerId: string
    ) {
        try {

            const query = EsQuery.findChannelConsumerQuery(channelAccountId, channelType, consumerId)
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const channelConsumerDoc: ChannelConsumerDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            const consumerData: ConsumerDataOutputInterface = channelConsumerDoc?.consumerData

            if(consumerData?.id && consumerData?.name){
                return Promise.resolve(consumerData)
            }else{
                return Promise.resolve(null)
            }

        }catch (e) {
            return Promise.resolve(null)
        }
    }

    async findOrSyncChannelConsumer(
        channelAccountId: string,
        channelType: string,
        consumerId: string,
        channelAccessToken: string,
        sourceId
    ) {
        try {
            let channelConsumer: ConsumerDataOutputInterface

            channelConsumer = await this.findChannelConsumerByIdOrNull(
                channelAccountId,
                channelType,
                consumerId
            )

            if(!channelConsumer){

                const fetchedConsumerData = await this.getFetchedConsumerData(
                    channelAccountId,
                    channelType,
                    channelAccessToken,
                    sourceId
                )

                if(fetchedConsumerData?.name){
                    const newChannelConsumerDoc = await this.createChannelConsumer(
                        channelAccountId,
                        channelType,
                        consumerId,
                        fetchedConsumerData
                    )

                    if(newChannelConsumerDoc?.channelAccountId === channelAccountId && newChannelConsumerDoc.consumerId === consumerId){
                        channelConsumer = newChannelConsumerDoc.consumerData
                    }
                }

            }

            return Promise.resolve(channelConsumer)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    private async getFetchedConsumerData(
        channelAccountId: string,
        channelType: string,
        channelAccessToken: string,
        sourceId: string
    ): Promise<ConsumerDataOutputInterface | null> {
        try {
            if(channelType === 'messenger'){
                const messengerService = new MessengerService(
                    channelAccountId,
                    channelAccessToken
                )

                const sourceMidInfo = await messengerService.fetchMidInfo(sourceId)
                const fromUserId = sourceMidInfo?.from?.id || null

                const consumer: ConsumerDataOutputInterface | null = fromUserId && fromUserId !== channelAccountId
                    ? sourceMidInfo.from
                    : null

                return Promise.resolve(consumer)
            }else{
                return Promise.resolve(null)
            }

        }catch (e) {
            console.log('Failed to fetch Consumer Data')
            return Promise.reject(e)
        }
    }
}

interface ConsumerInfoInterface {
    id: string,
    name: string,
    email?: string,
    phone?: string
}