import ConverseMessenger from "@/lib/ConverseMessengerService/ConverseMessenger";
import ConverseMessengerSocketEmitter from "@/lib/ConverseMessengerService/ConverseMessengerSocketEmitter";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import PrismaToElasticQueryBuilder from "@/lib/ConverseMessengerService/PrismaToElasticQueryBuilder";
import createMessageData from "@/lib/ConverseMessengerService/converseHelpers/CreateMessageData";
import TelegramBotService from "@/lib/integrations/telegram/TelegramBotService";
import MessengerService from "@/lib/messenger/MessengerService";
import prisma from "@/lib/prisma";
import {generateConsumerConversationUid, getAutoGeneratedSourceMid} from "@/utils/helperFunctions";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import {throwIf} from "@/lib/ErrorHandler";
import RobiMessageSenderService from "@/lib/integrations/other/Robi/RobiMessageSenderService";
import {RobiMessengerMessageSendPayloadInterface} from "@/lib/integrations/other/Robi/RobiMessengerInterfaces";
import {AirtelMessengerMessageSendPayloadInterface} from "@/lib/integrations/other/Airtel/AirtelMessengerInterfaces";
import AirtelMessageSenderService from "@/lib/integrations/other/Airtel/AirtelMessageSenderService";
import collect from "collect.js";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";

const elasticsearchDBAdapter = new ElasticsearchDBAdapter('socian_converse')
const conversationMessageIndex = "__messenger_conversation_messages"
const limit = 10000

async function sendMessageToTheFBMessenger(channel, recipientId, chatMessageContent, lastMessageDocId, iceFeedback: boolean = false) {
    try {
        const pageId = channel?.channelData?.accountId
        const pageAccessToken = channel?.channelData?.access_token

        const messengerService = new MessengerService(
            pageId,
            pageAccessToken
        )

        let messageSendResponse = null
        if(iceFeedback === true){
            messageSendResponse = await messengerService
                .sendIceFeedbackMessage(
                    recipientId
                )
        }else{
            messageSendResponse = await messengerService
                .sendMessage(
                    recipientId,
                    chatMessageContent
                )
        }

        let messageSentData = {}
        if(messageSendResponse?.message_id){
            console.log('fb-messenger:message-sent-success')
            messageSentData = { messageSentStatus: 'sent-success', messageSentResponse: messageSendResponse}
        }else{
            console.log('fb-messenger:message-sent-failed')
            messageSentData = { messageSentStatus: 'sent-fail', messageSentResponse: {}}
        }

        const updatedMessageDoc = await elasticsearchDBAdapter.updateAndGetDocumentById(
            conversationMessageIndex,
            lastMessageDocId,
            messageSentData
        )

        const MessengerEvent = new ConverseMessengerSocketEmitter(
            channel.workspaceId,
            channel.channelId
        )

        MessengerEvent.messageAdded(updatedMessageDoc)
    }catch (e) {
        console.log(`failed to send sendMessageToTheFBMessenger: `)
        console.log(e.message)
        return Promise.reject(e)
    }
}

async function sendMessageToTheTelegramBot(channel, recipientId, chatMessageContent, lastMessageDocId) {
    const botToken = channel?.channelData?.botToken;
    const chatId = recipientId

    // Create an instance of the TelegramBotService
    const telegramBotService = new TelegramBotService(botToken);

    // Send the message using the TelegramBotService instance
    const success = await telegramBotService.sendMessage(
        chatId,
        chatMessageContent
    );

    let messageSentData = {}

    if (success) {
        messageSentData = { messageSentStatus: 'sent-success', messageSentResponse: {}}
        console.log('Telegram Message Sent')
    } else {
        console.log('Failed to send message to Telegram bot')
        messageSentData = { messageSentStatus: 'sent-fail', messageSentResponse: {}}
    }

    const updatedMessageDoc = await elasticsearchDBAdapter
        .updateAndGetDocumentById(
            conversationMessageIndex,
            lastMessageDocId,
            messageSentData
        )

    const MessengerEvent = new ConverseMessengerSocketEmitter(
        channel.workspaceId,
        channel.channelId
    )

    MessengerEvent.messageAdded(updatedMessageDoc)
}

async function sendMessageViaThirdPartyService(
    thirdPartyServiceName: any,
    channelAccountId : string,
    recipientId: string,
    message: any
) {
    const timestamp = Date.now()

    let serviceResponse = {
        success: false,
        error: 'undefined_service_response',
        data: null
    }

    switch (thirdPartyServiceName) {

        case "robi_messenger":
            const robiMessageMid : string = getAutoGeneratedSourceMid('ROBI_TEXT_MESSAGE__')
            const robiMessageText: string = message.content
            const robiMessageSenderService: RobiMessageSenderService = new RobiMessageSenderService()

            serviceResponse = await robiMessageSenderService.sendTextMessage(
                recipientId,
                channelAccountId,
                robiMessageMid,
                robiMessageText
            )

            break


        case "airtel_messenger":
            const airtelMessageMid : string = getAutoGeneratedSourceMid('AIRTEL_TEXT_MESSAGE__')
            const airtelMessageText: string = message.content

            const airtelMessageSenderService: AirtelMessageSenderService = new AirtelMessageSenderService()
            serviceResponse = await airtelMessageSenderService.sendTextMessage(recipientId, channelAccountId, airtelMessageMid, airtelMessageText)

            break

    }

    return serviceResponse
}

async function handleSendMessageToTheAssociateChannel(
    channel: any,
    recipientId: string,
    message: any,
    lastMessageDocId: string
) {

    let chatMessageContent = message.content
    const iceFeedback = message.type === 'iceFeedback'
    const channelAccountId: string = channel.channelData.accountId

    const isThirdPartyChannel = channel?.channelData?.isThirdParty || false
    const thirdPartyServiceName = channel?.channelData?.thirdPartyServiceName || null

    switch (channel.channelType) {
        case "messenger":
            if(isThirdPartyChannel && thirdPartyServiceName){
                await sendMessageViaThirdPartyService(
                    thirdPartyServiceName,
                    channelAccountId,
                    recipientId,
                    message
                )
            }else{
                await sendMessageToTheFBMessenger(
                    channel,
                    recipientId,
                    chatMessageContent,
                    lastMessageDocId,
                    iceFeedback
                )
            }
            break

        case "fb_page":
        case "facebook_page":
            if(isThirdPartyChannel && thirdPartyServiceName){

            }else{

            }
            break

        case "telegram":
            await sendMessageToTheTelegramBot(channel, recipientId, chatMessageContent, lastMessageDocId)
            break

        default:
            console.log('Failed to send message to the associate channel (Undefined)')
    }
}

function getQuickRepliesContentObject() {
    return [ { 'content_type': 'text', 'title': '👍', 'payload': 'RATING_1'}, { 'content_type': 'text', 'title': '💝', 'payload': 'RATING_2'}, { 'content_type': 'text', 'title': '😐', 'payload': 'RATING_3'}, { 'content_type': 'text', 'title': '😢', 'payload': 'RATING_4'}, { 'content_type': 'text', 'title': '😭', 'payload': 'RATING_5'}]
}

class MessengerConversation {
    protected messenger: ConverseMessenger;
    protected db_elasticsearch: ElasticsearchDBAdapter
    protected db_prisma

    protected ES_INDEX_CONVERSATION = "__messenger_conversations"
    protected ES_INDEX_CONVERSATION_MESSAGE = "__messenger_conversation_messages"

    constructor(messenger: ConverseMessenger) {
        this.messenger = messenger;
        this.db_elasticsearch = new ElasticsearchDBAdapter('socian_converse')
        this.db_prisma = prisma
    }

    async createConversation(data: any): Promise<any> {
        try {

            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            // 3. Create a new conversation on Elasticsearch.
            const {
                from: fromParticipant,
                to: toParticipant,
                message
            } = data.message;

            // 3. Make a unique channelUId.
            const __CONSUMER_UID = data.message.from.id;
            const __CONSUMER_CONVERSATION_UID = generateConsumerConversationUid(
                workspace.id,
                channel.channelType,
                channel.id,
                __CONSUMER_UID
            )

            const now = new Date();

            const webhookPayloadData = data?.webhookPayloadData || null

            const newConversationData = {
                conversationUid: __CONSUMER_CONVERSATION_UID,
                workspaceId: workspace.id,
                channelId: channel.id,
                channelUId: channel.channelUId,
                participants: [
                    { ...fromParticipant },
                    { ...toParticipant },
                ],
                sourceData: webhookPayloadData,
                created_at: now,
                updated_at: now
            };

            const conversationResponse = await this.db_elasticsearch.findAndUpdateOrCreateDocument(
                this.ES_INDEX_CONVERSATION,
                {
                    findQuery: {conversationUid: __CONSUMER_CONVERSATION_UID},
                    updatedData: { sourceData: webhookPayloadData },
                    createData: newConversationData
                }
            );

            const {data: conversation, action} = conversationResponse

            throwIf(!conversation?._id, new Error('Unable to handle invalid conversation'))

            if(action === 'created'){
                const newConversationId = conversation._id
                const newThread = await this.db_prisma.thread.create({
                    data: {
                        workspaceId: parseInt(workspace.id),
                        channelId: parseInt(channel.id),
                        conversationId: newConversationId.toString(),
                        title: 'Default Thread',
                        content: message?.content,
                        author: {...fromParticipant}
                    }
                })

                const { id: threadId } = newThread

                throwIf(!threadId, new Error('Unable to create thread'))

                const sourceData = null
                const initialMessageData = createMessageData(
                    newConversationId,
                    threadId,
                    fromParticipant,
                    toParticipant,
                    message,
                    sourceData,
                    false,
                    data.message?.type || 'text',
                    data.message?.content
                )

                initialMessageData['thread'] = newThread

                const messageCreateResult = await this
                    .db_elasticsearch
                    .createAndGetDocument(
                        this.ES_INDEX_CONVERSATION_MESSAGE,
                        initialMessageData
                    )

                const updatedConversationData = {
                    lastMessage: {
                        _id: messageCreateResult?._id,
                        ...(<object>messageCreateResult?._source)
                    },
                    currentThreadId: threadId
                }

                const updatedConversation = await this
                    .db_elasticsearch
                    .updateAndGetDocumentById(
                        this.ES_INDEX_CONVERSATION,
                        newConversationId,
                        updatedConversationData
                    )

                const MessengerEvent = new ConverseMessengerSocketEmitter(
                    workspace?.id,
                    channel.id
                )

                MessengerEvent.conversationAdded(updatedConversation)

                return Promise.resolve(updatedConversation);
            }else {
                return Promise.resolve(conversation);
            }

        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findConversationById(conversationId): Promise<any> {
        try {

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: this.messenger._workspaceId
                },
            });

            const conversation = await this.db_elasticsearch.getDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId
            )

            return Promise.resolve(conversation)
        }catch (error) {
            return Promise.reject(error)
        }
    }

    /**
     * Update the conversation
     *
     * @param conversationId
     * @param updateFields
     */
    async updateConversation(conversationId: string, updateFields): Promise<any> {
        try {

            // 2. Find the channel from prisma or fail.
            const channel = await this.db_prisma.channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: this.messenger._workspaceId,
                },
            });

            const updatedConversation = await this
                .db_elasticsearch
                .updateAndGetDocumentById(
                    this.ES_INDEX_CONVERSATION,
                    conversationId,
                    updateFields
                );

            return Promise.resolve(updatedConversation);
        } catch (error) {
            console.log(`error`)
            console.log(error)

            return Promise.reject(error);
        }
    }

    /**
     * Delete Conversation
     *
     * @param conversationId
     */
    async deleteConversation(conversationId: string): Promise<any> {
        try {
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            const channel = await this.db_prisma.channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id,
                },
            });

            // 3. Find the conversation by the given id, workspace, and channel.
            const builder = new PrismaToElasticQueryBuilder();

            const elasticQuery = builder
                .setIndex(this.ES_INDEX_CONVERSATION)
                .where({
                    _id: conversationId,
                    workspaceId: workspace.id,
                    channelId: channel.id,
                })
                .build();

            const conversation = await this.db_elasticsearch.execQuery(
                this.ES_INDEX_CONVERSATION,
                elasticQuery.body
            );

            const conversationResult = conversation.hits.hits[0];

            if (!conversationResult) {
                throw new Error('Conversation not found');
            }

            const deleteResult = await this.db_elasticsearch.deleteDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId
            );

            return Promise.resolve(deleteResult);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get All Conversations
     */
    async getAllConversations(from=0,size=50): Promise<any> {
        try {
            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.Channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            const conversationsQueryObject = {
                workspaceId: workspace.id,
                channelId: channel?.id
            }

            const conversationsData = await this.db_elasticsearch.getDocumentsByQueryV1(
                this.ES_INDEX_CONVERSATION,
                conversationsQueryObject,
                null,
                null,
                null,
                null,
                from,
                size,
                'updatedAt',
                'desc',
            );
            throwIf(conversationsData.data.length==0,"No Conversations found for this channel")

            const conversations = collect(conversationsData.data).map(doc => {
                return {_id: doc?._id, ...(<object>doc?._source)}
            }).toArray()

            return Promise.resolve({data:conversations,total:conversationsData.total})

        } catch (e) {
            return Promise.reject(e)
        }
    }


    async getConversationMessages(conversationId, threadId = null): Promise<any[]> {
        try {
            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.Channel.findFirst({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            const conversation = await this
                .db_elasticsearch
                .getDocumentById(
                    this.ES_INDEX_CONVERSATION,
                    conversationId
                )

            if(!conversation.found){
                throw new Error("Sorry! The Conversation Not found");
            }

            const conversationMessagesQuery = bodybuilder()
                .size(10) // Set the number of messages to retrieve (e.g., 10 in this example)
                .query('bool', (q) => {
                    q.filter('term', 'conversationId.keyword', conversationId);
                    if (threadId !== undefined) {
                        q.filter('term', 'threadId', threadId);
                    }
                })
                .sort('createdAt', 'desc') // Sort messages by createdAt field in descending order
                .build();

            const conversationMessages = await this
                .db_elasticsearch
                .execQuery(
                    this.ES_INDEX_CONVERSATION_MESSAGE,
                    conversationMessagesQuery
                );

            const docs = conversationMessages?.hits?.hits
            const messagesDocs = collect(docs).map(doc => {
                return {_id: doc?._id, ...(<object>doc?._source)}
            }).toArray()

            return Promise.resolve(messagesDocs)

        } catch (e) {
            console.log('Error on Collecting Workspace messages');
            console.log(e);

            return Promise.reject(e)
        }
    }

    async getConversationMessageById(conversationId: string, messageId: string): Promise<any> {
        try {
            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.Channel.findFirst({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            const conversation = await this
                .db_elasticsearch
                .getDocumentById(
                    this.ES_INDEX_CONVERSATION,
                    conversationId
                )

            if(!conversation.found){
                throw new Error("Sorry! The Conversation Not found");
            }

            const conversationMessage = await this
                .db_elasticsearch
                .getDocumentById(
                    this.ES_INDEX_CONVERSATION_MESSAGE,
                    messageId
                );

            return Promise.resolve(conversationMessage)

        } catch (e) {
            console.log('Error on Collecting Workspace messages');
            console.log(e);

            return Promise.reject(e)
        }
    }

    async getChannelConversations(): Promise<any[]> {
        const conversations = [
            {
                id: 1,
                name: 'conversation-01',
                conversationUId: '${workspaceId}_{channelType}_{channelId}_{consumerId:1}',
                workspaceId: this.messenger._workspaceId,
                channelId: this.messenger._channelId,
                channelUId: this.messenger._channelUId,
            },
        ];
        return conversations;
    }

    // Add more conversation-related actions and operations here

    async createMessage(conversationId, data, iceFeedback: boolean = false): Promise<any> {
        try {

            throwIf(
                !conversationId,
                new Error("Invalid Conversation Id.")
            )

            const channel: any = await prisma.channel.findFirst({
                where: {
                    id: this.messenger._channelId,
                    workspace: { id: this.messenger._workspaceId }
                },
                include: { workspace: true }
            });

            throwIf (
                !channel,
                new Error(`Channel with id ${this.messenger._channelId} not found in the workspace.`)
            )

            const conversation = await this.db_elasticsearch.getDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId
            )

            throwIf(
                !conversation?._id,
                new Error("Conversation not found.")
            )

            let thread = data?.threadId

            if(data?.threadId === null || data?.threadId === 0 || data?.threadId === '' || data?.threadId === 'new'){

                thread = await this.db_prisma.thread.create({
                    data: {
                        workspaceId: channel.workspaceId,
                        channelId: channel.id,
                        conversationId: conversation?._id,
                        title: 'Default Thread',
                        content: data?.message?.content,
                        author: data?.from
                    }
                })

            }else if((conversation as any)?._source?.currentThreadId){
                const threadId = (conversation as any)?._source?.currentThreadId

                thread = await this.db_prisma.thread.findFirstOrThrow({
                    where: { id: parseInt(threadId) }
                })
            }

            const threadId = thread?.id

            throwIf(!threadId, new Error('Thread not found'))

            const fromAgentUser = {
                ...data.from,
                id: channel?.channelData?.accountId
            }

            const newMessageData = createMessageData(
                conversationId,
                threadId,
                fromAgentUser,
                data.to,
                data.message,
                data.sourceData,
                iceFeedback,
                data.message?.type || 'text',
                data.message?.content
            )

            newMessageData['thread'] = thread

            const newMessage = await this.db_elasticsearch.createAndGetDocument(
                this.ES_INDEX_CONVERSATION_MESSAGE,
                newMessageData
            )
            
        
            const lastMessageDoc = {
                _id: newMessage?._id,
                ...(<object>newMessage?._source)
            }

            throwIf(!newMessage?._id, new Error("Failed to create conversation message"))

            const updatableConversationData = {
                lastMessage: lastMessageDoc,
                currentThreadId: threadId,
                updatedAt: new Date()
            }

            const updatedConversation = await this.db_elasticsearch.updateAndGetDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId,
                updatableConversationData
            )

            const MessengerEvent = new ConverseMessengerSocketEmitter(
                channel?.workspaceId,
                channel.id
            )

            MessengerEvent.conversationUpdated(updatedConversation)
            MessengerEvent.messageAdded(lastMessageDoc)

            // Send Message to the associate channel
            const recipientId = data.to.id

            let messageType = 'text'
            let messageContent = data.message.content

            if(iceFeedback === true && recipientId !== channel.chanelData.accountId){
                messageType = 'iceFeedback'
                messageContent = 'Thank you Sir for taking our service. This is an Emoji ICE Test. Please rate'
            }

            const message = {
                type: messageType || `text`,
                content: messageContent,
                iceContent: getQuickRepliesContentObject()
            }

            handleSendMessageToTheAssociateChannel(
                channel,
                recipientId,
                message,
                lastMessageDoc._id
            )

            return Promise.resolve(newMessage)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    /**
     * Update a conversation message
     *
     * @param conversationId
     * @param messageId
     * @param updatableData
     */
    async updateMessage(conversationId: string, messageId: string, updatableData: object): Promise<any> {
        try {

            if(!conversationId || !messageId){
                throw new Error("Invalid Conversation or Message Id.")
            }

            if(!(updatableData as any)?.message){
                throw new Error("updatable message not found.")
            }

            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.Channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            // 3. Find Conversation from elastic search
            const conversationIndexExists = await this
                .db_elasticsearch
                .indexExists(this.ES_INDEX_CONVERSATION)

            if(!conversationIndexExists){
                throw new Error("Conversation Index not found.")
            }

            const conversation = await this.db_elasticsearch.getDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId
            )

            if(!conversation?._id){
                throw new Error("Conversation not found.")
            }

            const updatedMessage = await this.db_elasticsearch.updateAndGetDocumentById(
                this.ES_INDEX_CONVERSATION_MESSAGE,
                messageId,
                {
                    message: (updatableData as any).message,
                }
            )

            return Promise.resolve(updatedMessage)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    /**
     * Delete a conversation message
     *
     * @param conversationId
     * @param messageId
     */
    async deleteMessage(conversationId: string, messageId: string): Promise<any> {
        try {

            if(!conversationId || !messageId){
                throw new Error("Invalid Conversation or Message Id.")
            }

            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this.db_prisma.Channel.findFirstOrThrow({
                where: {
                    id: this.messenger._channelId,
                    workspaceId: workspace.id
                },
            });

            // 3. Find Conversation from elastic search
            const conversationIndexExists = await this
                .db_elasticsearch
                .indexExists(this.ES_INDEX_CONVERSATION)

            if(!conversationIndexExists){
                throw new Error("Conversation Index not found.")
            }

            const conversation = await this.db_elasticsearch.getDocumentById(
                this.ES_INDEX_CONVERSATION,
                conversationId
            )

            if(!conversation?._id){
                throw new Error("Conversation not found.")
            }

            const deleteMessage = await this.db_elasticsearch.deleteDocumentById(
                this.ES_INDEX_CONVERSATION_MESSAGE,
                messageId,
            )

            return Promise.resolve(deleteMessage)
        }catch (e) {
            return Promise.reject(e)
        }
    }
    async joinTaskListToThreadList(task_list, thread_list) {
        let finalThreads = []
        const messageQuery = new MessageQuery()
        for(const thread of thread_list ){
            const matchingTask = task_list.find(task => task.sourceData.threadId === thread.id);
            let taskInfo = {}
            let messageCount = 0
            if(matchingTask){
                taskInfo = {
                    "taskId": matchingTask?.taskId,
                    "taskStatus": matchingTask?.taskStatus,
                    "assignable": matchingTask?.assignable,
                    "assigned": matchingTask?.assigned,
                    "assignedAgentId": matchingTask?.assignedAgentId,
                    "assignedTaskIsClosed": matchingTask?.assignedTaskIsClosed,
                }
            }
            // getting messageCount
            messageCount = await messageQuery.getTotalMessageCountByThread(thread.id)
            const data =  {
                ...thread,
                messageCount:messageCount,
                task:taskInfo
            };
            finalThreads.push(data)
        }
        return finalThreads
        // return thread_list.map(thread => {
        //     const matchingTask = task_list.find(task => task.sourceData.threadId === thread.id);
        //     let taskInfo = {}
        //     if(matchingTask){
        //         taskInfo = {
        //             "taskId": matchingTask?.taskId,
        //             "taskStatus": matchingTask?.taskStatus,
        //             "assignable": matchingTask?.assignable,
        //             "assigned": matchingTask?.assigned,
        //             "assignedAgentId": matchingTask?.assignedAgentId,
        //             "assignedTaskIsClosed": matchingTask?.assignedTaskIsClosed,
        //         }
        //     }
        //     return {
        //         ...thread,
        //         task:taskInfo
        //     };
        // });
    }

    async getConversationThreads(conversationId): Promise<any[]> {
        try {
            // 1. Find the workspace from prisma or fail.
            const workspace = await this.db_prisma.workspace.findFirstOrThrow({
                where: {
                    id: this.messenger._workspaceId,
                },
            });

            // 2. Find the channel from prisma or fail. (You'll need to replace 'ChannelModel' with the actual model name)
            const channel = await this
                .db_prisma
                .Channel
                .findFirstOrThrow({
                    where: {
                        id: this.messenger._channelId,
                        workspaceId: workspace.id
                    },
                });

            const conversation = await this
                .db_elasticsearch
                .findDocumentById(
                    this.ES_INDEX_CONVERSATION,
                    conversationId
                )

            if(!conversation.found){
                throw new Error("Sorry! The Conversation Not found");
            }

            let threadsFindQuery = {
                where: {
                    workspaceId: workspace?.id,
                    channelId: channel?.id,
                    conversationId: conversation?._id,
                }
            };

            const conversationThreads = await this
                .db_prisma
                .Thread
                .findMany(threadsFindQuery);

            // convert thread id list
            const idList = conversationThreads.map(item => item.id.toString()); // Convert the ids to strings if needed
            // getting task list
            const taskQuery = new TaskQuery();
            const task_list = await taskQuery.getTasksByThreadIdList(idList)
            // joining tasks into thread
            const result = this.joinTaskListToThreadList(task_list,conversationThreads)

            return Promise.resolve(result)

        } catch (e) {
            console.log(e);

            return Promise.reject(e)
        }
    }
}

export default MessengerConversation