import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import prisma from "@/lib/prisma";
import bodybuilder from "bodybuilder";
import {Conversation} from "@/lib/QueryServices/models/Conversation";
import {WebhookDocCreateInterface, WebhookDocOutputInterface} from "@/actions/interface/WebhookDocInterface";
import ConversationQuery from "../elasticsearch/ConversationQuery";
import collect from "collect.js";
import {ChannelDataRequiredInterface} from "@/actions/interface/ChannelInterface";
import {throwIf} from "@/lib/ErrorHandler";
import ChannelQuery from "@/lib/QueryServices/backend/ChannelQuery";
const axios = require('axios');

export default class ConsumerMidQuery {
    mid: string;
    conversationId: string;
    client: ElasticsearchDBAdapter;
    es_index: string;
    accessToken: string;
    private channel: any;

    constructor() {
        this.mid = '';
        this.conversationId = '';
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.accessToken = ''
    }

    setData(data: {mid: string, conversationId: string}) {
        this.mid = data?.mid;
        this.conversationId = data?.conversationId;

        throwIf(!this.mid || !this.conversationId, new Error("ConversationId and SourceMid is required."))
    }

    async execute() {

        try{


            // Find the conversation
            const conversation = await (new ConversationQuery()).findConversationById(this.conversationId)
            throwIf(!conversation?._id, new Error("Invalid ConversationId Detected."))
            throwIf(!conversation?.channelId, new Error("Invalid Conversation ChannelId Detected."))

            const conversationChannelId: number = conversation.channelId
            const channel: any = await (new ChannelQuery()).findChannelById(conversationChannelId)
            throwIf(!channel?.channelData, new Error("ChannelId is invalid"))

            const channelData: ChannelDataRequiredInterface | any = channel.channelData
            this.accessToken = channelData?.accessToken || channelData?.access_token;
            throwIf(!(this.accessToken) || this.accessToken === "NOT_FOUND", new Error("Access Token Not Found"))


            // Find consumer data from es.
            const consumerData: any = await this.getConsumerDataFromEs()

            // If Not Find Then Fetch consumer Data.
            const fbFetchDataData = await this.fetchData()

            // ConsumerObj
            const consumerObj = collect(conversation.participants).firstWhere('role', 'consumer')
            let updatedParticipants = conversation.participants
            updatedParticipants[0]['name'] = fbFetchDataData?.from?.name

            if(consumerObj?.id){
                conversation.participants = updatedParticipants
                // Update Conversation.
                const updateResponse = await (new ConversationQuery()).updateAndGetConversationDoc(
                    conversation._id,
                    {
                        participants: updatedParticipants
                    }
                )
                return Promise.resolve(updateResponse);
            }

        }catch(err){
            console.log("Error in execute fn:", err.message||err);
            return Promise.reject(err);
        }
    }

    async getConversationData() {

        try{

            const conversation_query = new ConversationQuery();
            const conversation = await conversation_query.findConversationById(this.conversationId)
            const conversationChannelId = conversation?.channelId;
            console.log("conversation: ", conversation)
            const channel: any = await prisma.channel.findFirstOrThrow({
                where: { id: conversationChannelId },
            });
            
            this.channel = channel
            
            this.accessToken = channel?.channelData?.accessToken || channel?.channelData?.access_token;
            
            if(!(this.accessToken) || this.accessToken === "NOT_FOUND"){
                return Promise.reject("Access Token Not Found")
            }
    
            return Promise.resolve(conversation);
        }catch(err){
            console.log("Error in getConversationData fn:");
            return Promise.reject(err);
        }
    }

    async getConsumerDataFromEs() {
        try {
            
            const consumer = await this.client.findDocumentById('_consumer_data', 'conversationId_'+ this.conversationId)
            
            return Promise.resolve(consumer)
        
        } catch (err) {
            console.log("Consumer Data Not Found In ES We are creating now. :");
            return Promise.resolve(null)
        }
    }

    async fetchData() {
        try{
            console.log("this.accessToken:", this.accessToken);
            
            const conversationsUrl = `https://graph.facebook.com/v16.0/${this.mid}?fields=from&access_token=${this.accessToken}`;
            const getData = await axios.get(conversationsUrl);
            
            return Promise.resolve(getData?.data);
        }catch(err){

            // TO PROD DEVELOPMENT SCRIPT --START
            console.log("Error in fetchData fn:");
            return Promise.reject(err)
            // TO PROD DEVELOPMENT SCRIPT --END
        }
    }

    async consumerDataStoreToEs(data: any, channelData: ChannelDataRequiredInterface) {
        try{

            if(data.from.id !== channelData.accountId){
                const dataObj = {
                    indexName:'_consumer_data',
                    id: 'conversationId_'+ this.conversationId,
                    document: data
                }
                const consumer = await this.client.createDocumentById(dataObj)
                return Promise.resolve(consumer)
            }else{
                return Promise.reject("Ignoring fetching self channel data")
            }

        }catch(err){
            console.log("Error in consumerDataStoreToEs fn:");
            return Promise.reject(err)
        }
    }

    async updateConversation(data:any) {
        console.log("final_data_id: ", data?._id);
        console.log("final_data_participants: ", data?.participants);
        
        try{
            const consumer = this.client.updateAndGetDocumentById('__messenger_conversations', data?._id, {
                participants: data?.participants
            })
    
            return Promise.resolve(consumer)
        }catch(err){
            console.log("Error in updateConversation fn:");
            return Promise.reject(err)
        }
    }
}