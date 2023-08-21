import axios from "axios";
import {throwIf} from "@/lib/ErrorHandler";
import {RobiMessengerMessageSendPayloadInterface} from "@/lib/integrations/other/Robi/RobiMessengerInterfaces";
import RobiMessengerIceFeedbackRatings, {RobiMessengerIceFeedbackText} from "@/lib/integrations/other/Robi/RobiMessengerIceFeedbackContent";
import {debugLog, getCurrentTimestamp} from "@/utils/helperFunctions";
import AirtelMessengerIceFeedbackRatings, {
    AirtelMessengerIceFeedbackText
} from "@/lib/integrations/other/Airtel/AirtelMessengerIceFeedbackContent";

export default class RobiMessageSenderService {
    private url: string;
    private username: string;
    private password: string;
    private timestamp: number;

    constructor() {
        this.url = `https://robi-agent.dostai.com/robi/api/v1/index.php`;
        this.username = 'robi.agent';
        this.password = '34rYkl_MOuRbc83';
        this.timestamp = Date.now()
    }

    async sendTextMessage(recipientId: string, channelAccountId: string, sourceMid: string, messageText: any): Promise<any> {
        try {

            let robiMessageObj : RobiMessengerMessageSendPayloadInterface = {
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

            const response = await axios.post(this.url, robiMessageObj, {
                headers: { 'Content-Type': 'application/json' },
                auth: {
                    username: this.username,
                    password: this.password,
                },
            });

            throwIf(
                response.status !== 200,
                new Error(`Request failed with status code: ${response.status}`)
            )

            console.log('robi message sent')

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
            const promiseData = {
                success: false,
                message: 'Message Sent Failed',
                data: error.message
            };

            return Promise.resolve(promiseData)
        }
    }

    async sendIceFeedbackMessage(recipientId: string, channelAccountId: string, sourceMid: string): Promise<any> {
        try {

            const iceMessageObj = {
                object: "page",
                entry: [
                    {
                        id: channelAccountId,
                        time: this.timestamp,
                        mode:"",
                        messaging: [
                            {
                                recipient: { id: recipientId },
                                sender: { id: channelAccountId },
                                timestamp: this.timestamp,
                                message:{
                                    mid: sourceMid,
                                    text: RobiMessengerIceFeedbackText,
                                    quick_replies: RobiMessengerIceFeedbackRatings
                                }
                            }
                        ]
                    }
                ]
            }


            console.log('Sending Ice Feedback Message From ROBI to Consumer')
            debugLog(`Robi Ice Message Data before calling API`, JSON.stringify(iceMessageObj, null, 4))

            const robiRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                },
                auth: {
                    username: this.username,
                    password: this.password,
                },
            }

            const response = await axios.post(
                this.url,
                iceMessageObj,
                robiRequestConfig
            );

            debugLog('robi ice message sent response back ---', response.data)

            throwIf(
                response.status !== 200,
                new Error(`Request failed with status code: ${response.status}`)
            )

            const apiResponseObject = response?.data && JSON.parse(response?.data.slice(0, -1));

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