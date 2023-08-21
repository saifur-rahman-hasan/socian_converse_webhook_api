import axios from "axios";
import {throwIf} from "@/lib/ErrorHandler";
import {ActionResponseInterface} from "@/actions/interface/ActionResponseInterface";
import {ChannelDataRequiredInterface} from "@/actions/interface/ChannelInterface";

const CONVERSE_FACEBOOK_PAGE_COMMENT_REPLAY_URL = process.env.CONVERSE_FACEBOOK_PAGE_COMMENT_REPLAY_URL
const CONVERSE_FACEBOOK_PAGE_COMMENT_REPLAY_TOKEN = process.env.CONVERSE_FACEBOOK_PAGE_COMMENT_REPLAY_TOKEN

export interface FacebookPagePostCommentReplayInterface {
    "comment_id": string,
    "message": any
}


export default class FacebookPostCommentService {
    private url: string;
    private accessToken: string;
    private channelData: ChannelDataRequiredInterface | any;

    constructor(channelData: ChannelDataRequiredInterface | any) {
        this.url = CONVERSE_FACEBOOK_PAGE_COMMENT_REPLAY_URL;
        this.accessToken = channelData?.accessToken || channelData?.access_token;
        this.channelData = channelData
    }

    async sendMessage(data: FacebookPagePostCommentReplayInterface | any): Promise<ActionResponseInterface> {
        try {
            const reqData = {...data, access_token: this.accessToken}

            const response = await axios.post(this.url, reqData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'access_token': this.accessToken,
                    // 'Authorization': `Bearer ${this.accessToken}`
                }
            });

            throwIf(
                response.status !== 200,
                new Error(`Request failed with status code: ${response.status}`)
            )

            const resData = await response?.data?.data

            const promiseData: ActionResponseInterface = {
                success: true,
                message: 'fb-comment message sent',
                data: resData
            }

            return Promise.resolve(promiseData);

        } catch (error) {
            return Promise.reject(error)
        }
    }
}