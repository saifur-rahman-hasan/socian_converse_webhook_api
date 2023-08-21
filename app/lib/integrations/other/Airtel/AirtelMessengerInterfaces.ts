import {MessengerMessagePayloadInterface} from "@/actions/interface/FBMessengerWebhookInterface";

export interface AirtelMessengerMessageSendPayloadInterface {
    object: string;
    entry: Array<{
        id: string;
        time: number;
        messaging: Array<MessengerMessagePayloadInterface>;
        mode?: string;
    }>;
}