import {MessengerMessagePayloadInterface} from "@/actions/interface/FBMessengerWebhookInterface";

export interface RobiMessengerMessageSendPayloadInterface {
    object: string;
    entry: Array<{
        id: string;
        time: number;
        messaging: Array<MessengerMessagePayloadInterface>;
        mode?: string | 'agent_close';
    }>;
}