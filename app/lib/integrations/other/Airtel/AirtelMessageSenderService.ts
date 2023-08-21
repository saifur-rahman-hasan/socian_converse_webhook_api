import axios from "axios";
import {throwIf} from "@/lib/ErrorHandler";
import {AirtelMessengerMessageSendPayloadInterface} from "@/lib/integrations/other/Airtel/AirtelMessengerInterfaces";
import AirtelMessengerIceFeedbackRatings, {
    AirtelMessengerIceFeedbackText
} from "@/lib/integrations/other/Airtel/AirtelMessengerIceFeedbackContent";
import {debugLog, getCurrentTimestamp} from "@/utils/helperFunctions";
import RobiMessengerIceFeedbackRatings, {
    RobiMessengerIceFeedbackText
} from "@/lib/integrations/other/Robi/RobiMessengerIceFeedbackContent";

export default class AirtelMessageSenderService {
    private url: string;
    private username: string;
    private password: string;
    private timestamp: number;

    constructor() {
        this.url = `https://airtel-agent.dostai.com/chatbot/api/v1/index.php`;
        this.username = 'airtel.agent';
        this.password = '8iR43v_MOuRbc83';
        this.timestamp = Date.now()
    }

    async sendTextMessage(recipientId: string, channelAccountId: string, sourceMid: string, messageText: any): Promise<any> {
        try {
            const airtelMessageData : AirtelMessengerMessageSendPayloadInterface = {
                object: "page",
                entry: [
                    {
                        id: channelAccountId,
                        time: this.timestamp,
                        mode: "",
                        messaging: [
                            {
                                recipient: { id: recipientId },
                                sender: { id: channelAccountId },
                                timestamp: this.timestamp,
                                message: {
                                    mid: sourceMid,
                                    text: messageText
                                }
                            }
                        ]
                    }
                ]
            }


            const response = await axios.post(this.url, airtelMessageData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                auth: {
                    username: this.username,
                    password: this.password,
                },
            });

            const apiResponseObject = response?.data && JSON.parse(response?.data.slice(0, -1));

            const promiseData = {
                success: true,
                message: 'Message Sent',
                data: apiResponseObject
            };

            return Promise.resolve(promiseData)


        } catch (error) {
            const promiseData = {
                success: false,
                message: 'Message Sent Failed',
                data: error.message
            };

            return Promise.resolve(promiseData)
        }
    }

    async sendIceFeedbackMessage(recipientId: string, channelAccountId: string, sourceMid: string) {
        try {

            const iceMessageObj = {
                object: "page",
                entry: [
                    {
                        id: channelAccountId,
                        time: getCurrentTimestamp(),
                        mode:"",
                        messaging: [
                            {
                                recipient: { id: recipientId },
                                sender: { id: channelAccountId },
                                message:{
                                    mid: sourceMid,
                                    text: AirtelMessengerIceFeedbackText,
                                    quick_replies: AirtelMessengerIceFeedbackRatings
                                }
                            }
                        ]
                    }
                ]
            }


            console.log('Sending Ice Feedback Message From AIRTEL to Consumer')
            debugLog(`AIRTEL Ice Message Data before calling API`, JSON.stringify(iceMessageObj, null, 4))


            const response = await axios.post(
                this.url,
                iceMessageObj,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    auth: {
                        username: this.username,
                        password: this.password,
                    },
                }
            );

            throwIf(
                response.status !== 200,
                new Error(`Request failed with status code: ${response.status}`)
            )

            console.log('robi ice message sent')

            let apiResponseObject = null

            try {
                apiResponseObject = response?.data && JSON.parse(response?.data.slice(0, -1));
            }catch (e) {
                apiResponseObject = response?.data && JSON.parse(response?.data);
            }

            const promiseData = {
                success: true,
                message: 'Message Sent',
                data: apiResponseObject
            };

            return Promise.resolve(promiseData)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}