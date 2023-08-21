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

export default class MessengerChannelMidQuery {
    client: ElasticsearchDBAdapter;
    es_index: string;
    private newDate: Date;
    private maxLimit = 10000

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__channel_source_mid_info`;
        this.newDate = new Date

        this.client.indexExists(this.es_index, true)
    }

    async createChannelMidSource(
        accountId: string,
        channelType: string,
        sourceMid: string,
        sourceData: any,
    ) {
        try {

            const midSourceData = {
                accountId,
                channelType,
                sourceMid,
                sourceData,
                createdAt: this.newDate,
                updatedAt: this.newDate
            }

            const queryResponse = await this.client.createAndGetDocument(
                this.es_index,
                midSourceData
            )

            const channelConsumerDoc = this.client.getFormattedFirstResult(queryResponse)
            return Promise.resolve(channelConsumerDoc)

        } catch (err) {
            throw new Error("Failed to insert channel source mid information")
        }
    }

    async findChannelConsumerById(
        channelId: number,
        consumerId: string
    ) {
        try {

            const consumer = await this.client.getDocumentsByQuery(
                this.es_index,
                null,
                { channelId }
            )

            return Promise.resolve()
        }catch (e) {
            return Promise.reject("Consumer not exists")
        }
    }
}

interface ConsumerInfoInterface {
    id: string,
    name: string,
    email?: string,
    phone?: string
}