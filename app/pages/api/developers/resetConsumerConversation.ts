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

interface RequestData {
    workspaceId: number;
    channelId: number;
    consumerId: string;
}

interface ResponseData {
}

async function handlePostRequest(
    req: NextApiRequest | any,
    res: NextApiResponse,
    authUser: any
) {
    try {
        const reqData: RequestData = req.body;
        const workspaceId = reqData.workspaceId
        const channelId = reqData.channelId
        const consumerId = reqData.consumerId.toString()

        throwIf(
            !workspaceId ||
            !channelId ||
            !consumerId,
            new Error('The workspaceId, channelId, and consumerId are required.')
        )

        const channel = await (new ChannelQuery()).findChannelById(channelId)
        const channelType = channel.channelType

        // TODO: Generate Consumer Conversation UID
        const consumerConversationUid = generateConsumerConversationUid(
            workspaceId,
            channelType,
            channelId,
            consumerId
        )

        // Find the Conversation and confirm validation
        const conversation = await (new ConversationQuery()).findUniqueConversationByUid(consumerConversationUid)
        const conversationId = conversation?._id
        const currentThreadId = conversation?.currentThreadId
        throwIf(!conversationId, new Error('Invalid Conversation'))


        // Remove All Conversation Threads
        const threadRemoveResponse = await (new ThreadQuery()).removeThreadsByConversationId(conversationId)
        debugLog('threadRemoveResponse', threadRemoveResponse)

        // Remove All Conversation Thread Tasks
        const threadTaskRemoveResponse = await (new TaskQuery()).removedTasksByConversationId(conversationId)
        debugLog('threadTaskRemoveResponse', threadTaskRemoveResponse)

        // Remove All Conversation Messages
        const messageRemoveResponse = await (new MessageQuery()).removeMessagesByConversationId(conversationId)
        debugLog('messageRemoveResponse', messageRemoveResponse)

        // Remove the consumer conversation
        const conversationRemoveResponse = await (new ConversationQuery()).removeConversationByUid(consumerConversationUid)
        debugLog('conversationRemoveResponse', conversationRemoveResponse)

        return ApiResponse.success(res, {
            consumerConversationUid,
            conversationId,
            resetData: {
                threadRemoveResponse,
                threadTaskRemoveResponse,
                messageRemoveResponse,
                conversationRemoveResponse
            }
        })
    } catch (e) {
        return ApiResponse.error(res, e)
    }
}

export default withAuthUser(
    async function handler(req, res) {
        const authUser = req.authUser

        switch (req.method) {
            case 'POST':
                return await handlePostRequest(req, res, authUser)
            default:
                return ApiResponse.methodNotAllowed(res, req)
        }
    }
)