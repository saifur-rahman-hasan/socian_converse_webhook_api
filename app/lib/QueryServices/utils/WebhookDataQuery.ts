import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import {WebhookDocCreateInterface, WebhookDocOutputInterface} from "@/actions/interface/WebhookDocInterface";
import {debugLog} from "@/utils/helperFunctions";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";

export default class WebhookDataQuery {
    client: ElasticsearchDBAdapter;
    es_index: string;
    private newDate: Date;

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__channel_webhook_calls`;
        this.newDate = new Date()
    }

    /**
     * Keep a new of the incoming Webhook payload
     *
     * @param data
     */
    async createWebhookCall(data: WebhookDocCreateInterface): Promise<WebhookDocOutputInterface> {
        try {
            const newDocData = {
                ...data,
                createdAt: this.newDate.toISOString(),
                updatedAt: this.newDate.toISOString()
            }

            // Return the created conversation document
            const newDocResult = await this.client.createAndGetDocument(
                this.es_index,
                newDocData
            );

            const webhookDoc = this.client.getFormattedFirstResult(newDocResult)

            return Promise.resolve(webhookDoc)

        } catch (err) {
            return Promise.reject(err)
        }
    }

    async updateWebhookCall(id, objectData) {
        try {
            const updatableDocData = {
                ...objectData,
                updatedAt: this.newDate.toISOString()
            }

            // Return the created conversation document
            const webhookDoc: WebhookDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                id,
                updatableDocData
            );

            return Promise.resolve(webhookDoc)
        } catch (err) {
            return Promise.reject(err)
        }
    }

	async getWebhookCallsByChannelId(channelId: number) {
        try {
            const queryResponse = await this
                .client
                .execQuery(this.es_index, {})

            const webhookDocs: WebhookDocOutputInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(webhookDocs)
        }catch (e) {
            debugLog('asd', e.message)
            return Promise.reject(e)
        }
	}
}