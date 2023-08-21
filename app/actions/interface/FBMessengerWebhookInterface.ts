export interface FBMessengerWebhookInterface {
    object: string;
    entry: Array<{
        id: string;
        time: number;
        messaging: Array<MessengerMessagePayloadInterface>;
        mode?: string;
    }>;
}

export interface MessengerMessagePayloadInterface {
    messaging_type?: string;
    sender?: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp?: number;
    message: {
        mid: string;
        text?: string;
        quick_reply?: {
            payload: string;
        };
        reply_to?: {
            mid: string;
        };
        attachments?: Array<{
            type: string;
            payload: {
                url: string;
                title?: string;
                sticker_id?: number;
            };
        }>;
        referral?: {
            product: {
                id: string;
            };
        };
        is_echo?: boolean; // Add the is_echo property here
        app_id?: number;
        metadata?: string;
        quick_replies?: any
    };
    delivery?: {
        mids: string[];
        watermark: number;
    };
    postback?: {
        mid: string;
        title: string;
        payload: string;
        referral?: {
            ref: string;
            source: string;
            type: string;
        };
    };
    reaction?: {
        reaction: string;
        emoji: string;
        action: string;
        mid: string;
    };
    read?: {
        watermark: number;
    };

    lastmessages?: any | null
}