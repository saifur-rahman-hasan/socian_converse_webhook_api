import axios from "axios";
import FBMessengerIceFeedbackRatings, {
    FBMessengerIceFeedbackMessageText
} from "@/lib/ConverseMessengerService/FbMessengerIceFeedbackQuickReplies";
import {debugLog} from "@/utils/helperFunctions";

export default class MessengerService {
    private readonly pageId: string;
    private readonly pageAccessToken: string;
    private readonly apiUrl: string;
    private readonly appId: string;
    private readonly appSecret: string;
    private readonly encryptionKey: string;
    private readonly apiVersion: string;

    constructor(pageId: string, pageAccessToken: string) {
        this.pageId = pageId;
        this.pageAccessToken = pageAccessToken;
        this.apiUrl = process.env.NEXT_PUBLIC_APP_API_URL || '';
        this.appId = process.env.FB_APP_ID || '';
        this.appSecret = process.env.FB_APP_SECRET || '';
        this.encryptionKey = process.env.MESSENGER_ENCRYPTION_KEY || '';
        this.apiVersion = `v17.0`
    }

    async getConversationsWithMessages(): Promise<any[]> {
        const fieldsArray = [
            'is_subscribed',
            'id',
            'link',
            'can_reply',
            'message_count',
            'participants',
            'scoped_thread_key',
            'snippet',
            'unread_count',
            'updated_time',
            'messages.limit(5){created_time,from,id,is_unsupported,message,to,thread_id,sticker,story,tags,attachments}'
        ];

        const fieldsString = fieldsArray.join(',');

        const conversationsUrl = `https://graph.facebook.com/v16.0/${this.pageId}/conversations?fields=${fieldsString}&access_token=${this.pageAccessToken}`;

        try {
            const response = await fetch(conversationsUrl);
            const data = await response.json();

            return data.data || []; // Return an empty array if no conversations are found
        } catch (error) {
            throw new Error('Failed to retrieve messenger conversations');
        }
    }

    /**
     * Send Message
     *
     * @param recipientId
     * @param messageData
     */
    async sendMessage(recipientId: string, messageData: any): Promise<any> {
        const sendMessageUrl = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/messages`;

        try {
            const response = await axios.post(
                sendMessageUrl,
                {
                    recipient: { id: recipientId },
                    messaging_type: 'RESPONSE',
                    message: { text: messageData }
                },
                {
                    params: { access_token: this.pageAccessToken }
                }
            );

            const data = await response.data;

            if (response.status === 200) {
                return Promise.resolve(data);
            } else {
                return Promise.reject(data)
            }
        } catch (error) {
            console.log(`error`)
            console.log(error.message)
            return Promise.reject(':Failed to send message to the messenger')
        }
    }

    async sendIceFeedbackMessage(recipientId: string, iceContent: any = null): Promise<any> {
        const sendMessageUrl = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}/messages`;

        try {
            const response = await axios.post(
                sendMessageUrl,
                {
                    recipient: { id: recipientId },
                    messaging_type: 'RESPONSE',
                    message: {
                        text: FBMessengerIceFeedbackMessageText,
                        quick_replies: iceContent || FBMessengerIceFeedbackRatings
                    }
                },
                {
                    params: { access_token: this.pageAccessToken }
                }
            );

            const data = await response.data;

            if (response.status === 200) {
                return Promise.resolve(data);
            } else {
                return Promise.reject(data)
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async getAccountInfo() {
        try{
            const fieldsArray = [
                'id',
                'name',
                'about',
                'can_post',
                'access_token',
                'instagram_business_account'
            ];

            const fieldsString = fieldsArray.join(',');

            const accountInfoUrl = `https://graph.facebook.com/${this.apiVersion}/${this.pageId}?fields=${fieldsString}&access_token=${this.pageAccessToken}`;

            const response = await axios.get(accountInfoUrl);

            const data = await response.data;

            if (response.status === 200) {
                return Promise.resolve(data);
            } else {
                return Promise.reject(data)
            }

        }catch (e) {
            return Promise.reject(e)
        }
    }

    async fetchMidInfo(mid: string) {
        debugLog('fetching fb mid', mid)

        try{
            const fieldsArray = [
                "id",
                "from",
                "to",
                "message",
                "tags",
                "shares",
                "sticker",
                "reactions"
            ];

            const fieldsString = fieldsArray.join(',');

            const accountInfoUrl = `https://graph.facebook.com/${this.apiVersion}/${mid}?fields=from,to&access_token=${this.pageAccessToken}`;

            const response = await axios.get(accountInfoUrl);
            const data = await response.data;

            if (response.status === 200) {
                return Promise.resolve(data);
            } else {
                return Promise.reject(data)
            }

        }catch (e) {
            debugLog('Failed to fetch Messenger Mid info', e.message)
            return Promise.reject(e.message)
        }
    }

    getCustomerInfo(data: any, accountId): ConsumerInfoInterface | null {
        if(data.from.id === accountId){
            return null
        }

        const customerInfo: ConsumerInfoInterface = {
            name: data.from.name,
            email: data.from.email,
            id: data.from.id,
        };

        return customerInfo;
    }
}


interface ConsumerInfoInterface {
    name: string;
    email: string;
    id: string;
}