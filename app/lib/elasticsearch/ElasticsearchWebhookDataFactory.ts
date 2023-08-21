import { NextApiRequest } from 'next';

export interface TelegramWebhookIdentifier {
    workspaceId: number;
    channelType: string;
    channelUid: string;
    channelAccountId: number | string
}

export interface WebhookData {
    workspaceId: number;
    channelType: string;
    channelId: number;
    channelUid: string;
    channelAccountId: string | number;
    payloadData: any;
    payloadQueryParams: any;
    received: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

interface WebhookDataFactory {
    createWebhookData(req: NextApiRequest): Promise<WebhookData>;
}

export default class ElasticsearchWebhookDataFactory implements WebhookDataFactory {
    
    async createWebhookData(req: NextApiRequest): Promise<WebhookData> {
        const queryParams = req.query;
        const reqBody = req.body;

        const payloadData = { ...reqBody };
        const { identifier } = queryParams;

        if(!identifier){
            throw new Error("Identifier must required to execute telegram to socian webhook data sync.")
        }

        const identifierObj = await this.extractIdentifierFromString(identifier);
        const { workspaceId, channelType, channelUid, channelAccountId } = identifierObj;

        const webhookDocumentData: WebhookData = {
            workspaceId: Number(workspaceId),
            channelType: channelType,
            channelId: Number(0),
            channelUid: channelUid,
            channelAccountId: channelAccountId,
            payloadData: payloadData,
            payloadQueryParams: queryParams,
            received: true,
            created_at: new Date(),
            updated_at: new Date(),
        };
        
        return webhookDocumentData;
    }

    async extractIdentifierFromString(inputString): Promise<TelegramWebhookIdentifier> {
        const parts = inputString.split(':');
        const workspaceId = Number(parts[0]);
        const channelType = parts[1];
        const channelAccountId = parts[2];
        const channelUid = `${channelType}_${channelAccountId}`

        return {
            workspaceId,
            channelType,
            channelUid,
            channelAccountId,
        };
    }
}
