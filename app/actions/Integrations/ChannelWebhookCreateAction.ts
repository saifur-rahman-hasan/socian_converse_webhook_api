import BaseAction from "@/actions/BaseAction";
import WebhookDataQuery from "@/lib/QueryServices/utils/WebhookDataQuery";
import {WebhookDocCreateInterface, WebhookDocOutputInterface} from "@/actions/interface/WebhookDocInterface";

export default class ChannelWebhookCreateAction extends BaseAction {
    private _webhookPayload: WebhookDocCreateInterface;
    private webhookDocQuery: WebhookDataQuery;

    constructor(webhookPayload: any) {
        super();
        this._webhookPayload = this.getPreparedPayloadData(webhookPayload)
        this.webhookDocQuery = new WebhookDataQuery()
    }

    async execute(): Promise<WebhookDocOutputInterface> {
        try {

            const webhookDoc: WebhookDocOutputInterface = await this
                .webhookDocQuery
                .createWebhookCall(this._webhookPayload)

            this.getActionResolvedData()

            return Promise.resolve(webhookDoc)
        }catch (e) {
            this.setActionErrorReject(e)
            return Promise.reject(e)
        }
    }

    private getPreparedPayloadData(webhookPayload: any): WebhookDocCreateInterface {
        const payloadType = this.detectPayloadType(webhookPayload);
        const channelType = this.detectChannelType(payloadType)

        return {
            workspaceId: null, // Replace with the appropriate value for your case
            channelType: channelType, // Replace with the appropriate value for your case
            channelId: null, // Replace with the appropriate value for your case
            payloadData: webhookPayload,
            payloadQueryParams: null, // Replace with the appropriate value for your case
            received: true, // Replace with the appropriate value for your case
            payloadType
        };
    }

    private detectPayloadType(webhookPayload: any): string {
        let payloadType: string | null = null;

        const entryObject = webhookPayload?.entry?.length > 0
            ? webhookPayload.entry[0]
            : null;

        if (!entryObject) {
            throw new Error("Entity object not found in webhook payload.");
        }

        if (entryObject.hasOwnProperty('changes')) {
            payloadType = 'PageFeedPayload';
        } else if (entryObject.hasOwnProperty('messaging')) {
            payloadType = 'MessengerPayload';
        }

        return payloadType as string;
    }

    private detectChannelType(payloadType: string) {
        let channelType = "other"

        switch (payloadType){
            case "PageFeedPayload":
                channelType = 'messenger'
                break

            case "MessengerPayload":
                channelType = 'messenger'
                break

            default:
                channelType = "other"
        }

        return channelType
    }
}