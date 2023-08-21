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
    threadId?: number;
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
        const threadId = reqData?.threadId
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
        let currentThreadId = conversation?.currentThreadId

        throwIf(!conversationId, new Error('Invalid Conversation'))
        throwIf(!threadId && !currentThreadId, new Error("Invalid Thread Id"))

        // Find the thread of the conversation
        if(threadId){
            const conversationThread = await (new ThreadQuery()).findThreadByQuery({ id: threadId, conversationId: conversationId })
            throwIf(conversationThread.conversationId !== conversationId, new Error('Invalid Conversation Thread'))
            currentThreadId = conversationThread.id
        }

        // Remove All Conversation Thread Messages
        const messageRemoveResponse = await (new MessageQuery()).removeMessagesByConversationIdAndThreadId(conversationId, currentThreadId)
        debugLog('messageRemoveResponse', messageRemoveResponse)

        // Remove the consumer conversation
        const conversationUpdateResponse = await (new ConversationQuery()).updateAndGetConversationDoc(conversationId, {
            messagesCount: 0,
            canReply: true,
            conversationClosed: false,
            lastMessage: null
        })

        debugLog('conversationUpdateResponse', conversationUpdateResponse)

        return ApiResponse.success(res, {
            consumerConversationUid,
            conversationId,
            resetData: {
                messageRemoveResponse,
                conversationUpdateResponse
            }
        })
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