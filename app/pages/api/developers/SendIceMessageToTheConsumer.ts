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
    workspaceId: number,
    channelId: number,
    conversationId: string,
    threadId: number
}

async function handlePostRequest(
    req: NextApiRequest | any,
    res: NextApiResponse,
) {
    try {
        const reqData: RequestData = req.body;
        const workspaceId = reqData.workspaceId
        const channelId = reqData.channelId
        const conversationId = reqData.conversationId
        const threadId = reqData.threadId

        throwIf(
            !workspaceId ||
            !channelId ||
            !conversationId ||
            !threadId,
            new Error("Invalid Request to send ice message to the consumer")
        )

        const threadQuery = new ThreadQuery()



        return ApiResponse.success(res, {});
    } catch (e) {
        return ApiResponse.error(res, e)
    }
}

export default withAuthUser(
    async function SendIceMessageToTheConsumer(req, res) {
        switch (req.method) {
            case 'POST':
                return await handlePostRequest(req, res)
            default:
                return ApiResponse.methodNotAllowed(res, req)
        }
    }
)