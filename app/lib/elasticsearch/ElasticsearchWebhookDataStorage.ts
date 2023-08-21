import ElasticsearchClientAdapter from "@/lib/elasticsearch/adapter/ElasticsearchClientAdapter";
import { WebhookData } from "@/lib/elasticsearch/ElasticsearchWebhookDataFactory";

const channelWebhookIndex = "__channel_webhook_calls";

interface WebhookDocumentData {
    _id: string;
    workspaceId: number;
    channelType: string;
    channelId: number;
    channelUid: string;
    channelAccountId: number | string;
    payloadData: any;
    payloadQueryParams: any;
    received: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export default class ElasticsearchWebhookDataStorage {
    private elasticsearchClientAdapter: ElasticsearchClientAdapter;
        
    constructor() {
        this.elasticsearchClientAdapter = new ElasticsearchClientAdapter('socian_converse');
    }

    async storeWebhookData(webhookData: WebhookData): Promise<WebhookDocumentData> {
        const webhookDoc = await this.elasticsearchClientAdapter
            .createAndGetDocument(
                channelWebhookIndex,
                webhookData
            );

        if(!webhookDoc?._id){
            throw new Error("Invalid webhookDoc while creating...")
        }
            
            
        const webhookDocument: WebhookDocumentData = {
            _id: webhookDoc._id,
            workspaceId: webhookData.workspaceId,
            channelType: webhookData.channelType,
            channelId: webhookData.channelId,
            channelUid: webhookData.channelUid,
            channelAccountId: webhookData.channelAccountId,
            payloadData: webhookData.payloadData,
            payloadQueryParams: webhookData.payloadQueryParams,
            received: webhookData.received,
            created_at: webhookData.created_at,
            updated_at: webhookData.updated_at,
            deleted_at: webhookData.deleted_at,
        };

        return webhookDocument;
    }


}
