import {withAuthUser} from "@/middlewares/withAuthUser";
import {ApiResponse} from "@/lib/ApiResponse";
import {NextApiRequest, NextApiResponse} from "next";
import Validator from "@/lib/Validator/Validator";
import {throwIf} from "@/lib/ErrorHandler";
import {debugLog, generateConsumerConversationUid} from "@/utils/helperFunctions";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import collect from "collect.js";

interface RequestData {
    consumerId: string;
}

async function handlePostRequest(
    req: NextApiRequest | any,
    res: NextApiResponse,
    authUser: any
) {
    try {
        const reqData: RequestData = req.body;
        const consumerId = reqData.consumerId.toString()

        throwIf(
            !consumerId,
            new Error('The consumerId are required.')
        )

        const messageQuery = new MessageQuery();

        // Get and Remove All Conversation Thread Messages
        const messageRemoveResponse = await messageQuery.getConsumerMessagesByConsumerId(consumerId, 10);
        const messageIds = collect(messageRemoveResponse).pluck("_id").unique().toArray();

        messageIds.map((messageId: string) => {
            messageQuery.removeMessageById(messageId);
        })

        return ApiResponse.success(res, {
            messageRemoveResponse,
        });
    } catch (e) {
        return ApiResponse.error(res, e)
    }
}

export default withAuthUser(
    async function ResetConsumerConversationThreadMessages(req, res) {
        const authUser = req.authUser

        switch (req.method) {
            case 'POST':
                return await handlePostRequest(req, res, authUser)
            default:
                return ApiResponse.methodNotAllowed(res, req)
        }
    }
)