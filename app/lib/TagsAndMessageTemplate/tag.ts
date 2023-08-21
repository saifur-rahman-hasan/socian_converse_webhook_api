import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";
import prisma from "@/lib/prisma";
import {throwIf} from "@/lib/ErrorHandler";
import collect from "collect.js";
import {
    AssignableTaskCreateDocInputInterface,
    AssignableTaskDocOutputInterface,
    TaskCreateInputInterface,
} from "@/actions/interface/ConversationInterface";

export default class TagManageClass {
    client: ElasticsearchDBAdapter;
    es_index: string;
    cannel_id: string;
    searchQuery:string
    private page:number
    private pageSize:number

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `_tags`;
    }
    
    setData(page,pageSize,searchQuery) {
        this.page = page
        this.pageSize = pageSize
        this.searchQuery = searchQuery
    }
    
    getTagQuery(page,pageSize) {
        return bodybuilder()
            .sort('created_at', 'asc')
            .from((page - 1) * pageSize)
            .size(pageSize)
            .build();
    }

    getTagsOfChannelByNameQuery(name,channelId) {
        return bodybuilder()
            // .orFilter('fuzzy', 'data.tag_name', name)
            .orFilter('match', 'data.tag_name', name)
            .query('term', 'data.channel_id', channelId)
            .query('term', 'data.dataSource.keyword', "tag")
            .size(10)
            .build();
    }
    
    searchTagsByNameQuery(name) {
        return bodybuilder()
            .query('match', 'name', name)
            .size(20)
            .build();
    }
    
    getTagsOfChannelsByNameQuery(name,channelIdList) {
        return bodybuilder()
            // .orFilter('fuzzy', 'data.tag_name', name)
            .orFilter('match', 'data.tag_name', name)
            .query('terms', 'data.channel_id', channelIdList)
            .query('term', 'data.dataSource.keyword', "tag")
            .size(10)
            .build();
    }

    getTagChannels(tagId) {
        return bodybuilder()
            .query('term', 'data.tag_id.keyword', tagId)
            .query('term', 'data.dataSource.keyword', "tag")
            .build();
    }

    async isChannelExist(body) {
        const tag_channels:any = await this.client.execQuery(
            '_tags_and_messagetemplate_assigned_to_channel',
            bodybuilder()
                .query('term', 'data.tag_id.keyword', body?.tag_id)
                .query('term', 'data.tag_name.keyword', body?.channel_name)
                .query('term', 'data.channel_id', body?.channel_id)
                .query('term', 'data.dataSource.keyword', "tag")
                .build()
        )

        return tag_channels?.hits?.hits;
    }

    async removeFromChannel(body) {
        try{
            this.client.deleteDocumentById('_tags_and_messagetemplate_assigned_to_channel', body?.es_channel_id)
            return Promise.resolve(null)
        }catch(err){
            return Promise.reject(err)
        }
    }

    async addToChannel(body) {
        
        for (const data of body){

            const data_from_store = await this.isChannelExist(data)
           
            if(data_from_store.length > 0){
                console.log("Already Exist!");
            }else{
                await this.client.createAndGetDocument('_tags_and_messagetemplate_assigned_to_channel', {data: data})
            }
        }
        
        return Promise.resolve(null)
    }

    async getChannelList() {
        try{
            const channels = await prisma.channel.findMany()
            let channel_data = []
            for(const channel of channels){
                const obj = {
                    id: channel?.id,
                    name: channel?.channelName
                }
                channel_data.push(obj)
            }
            return Promise.resolve(channel_data)
        }catch(err){
            return Promise.reject(err)
        }
    }

    async getChannelsOfTags(tagId:string) {

        try{
            let tag_channels_list = []
    
            const tag_channels:any = await this.client.execQuery(
                '_tags_and_messagetemplate_assigned_to_channel',
                this.getTagChannels(tagId)
            )
    
            for (const channel of tag_channels?.hits?.hits){
                tag_channels_list.push({
                    id: channel?._id,
                    name: channel?._source?.data?.channel_name,
                })
            }

            return Promise.resolve(tag_channels_list)
        }catch(err){
            return Promise.reject(err)
        }
    }

    async getTags() {
        try{
            const tags:any = await this.client.execQuery(
                this.es_index,
                this.getTagQuery(this.page,this.pageSize)
            )
            const formated_data:any = await this.tagsFormatedData(tags)
            return Promise.resolve(formated_data)
        }catch(err){
            console.log("Error on get tags: ",err);
            return Promise.reject(err)
        }
    }
    
    async searchTags(queryString:string,channelId:number) {
        try{

            if (Array.isArray(channelId)) {
                
                let channel_ids = [];
                for(const cannel_id of channelId){
                    channel_ids.push(cannel_id?.id+"")
                }
                const tags:any = await this.client.execQuery(
                    '_tags_and_messagetemplate_assigned_to_channel',
                    this.getTagsOfChannelsByNameQuery(queryString,channelId)
                )
                
                const formated_data:any = await this.tagsSearchByChannelFormatedData(tags)
                
                return Promise.resolve(formated_data)
            }else if(channelId == 0){
                const tags:any = await this.client.execQuery(
                    '_tags',
                    this.searchTagsByNameQuery(queryString)
                )

                const formated_data:any = await this.tagsSearchFormatedData(tags)
                
                return Promise.resolve(formated_data)
                
            }else{
                const tags:any = await this.client.execQuery(
                    '_tags_and_messagetemplate_assigned_to_channel',
                    this.getTagsOfChannelByNameQuery(queryString,channelId)
                )
                
                const formated_data:any = await this.tagsSearchByChannelFormatedData(tags)
                
                return Promise.resolve(formated_data)
            }

        }catch(e){
            console.log("sjsk",e);
            
            return Promise.reject(e)
        }
    }

    async tagsSearchFormatedData(tags:any) {

        try {
            const totalPages = Math.ceil(tags.hits.total.value / this.pageSize);
            const currentPage = this.page;
            let final_data = []
            
            for (const tag of tags?.hits?.hits){
                final_data.push({
                    id: tag?._id,
                    name: tag?._source?.name,
                    channels: await this.getChannelsOfTags(tag?._id) || [],
                });
            }

            const dataObj = {
                data: final_data,
                totalPages: totalPages,
                currentPage: currentPage,
                totalItem: tags.hits.total.value
            }
            
            return Promise.resolve(dataObj)
        }catch (e) {
            console.log("Error on format",e);
            
            return Promise.reject(e)
        }
    }
    
    async tagsSearchByChannelFormatedData(tags:any) {

        try {
            const totalPages = Math.ceil(tags.hits.total.value / this.pageSize);
            const currentPage = this.page;
            let final_data = []
            
            for(const tag of tags?.hits?.hits){
                
                let obj = {
                    id: tag?._source?.data?.tag_id,
                    name: tag?._source?.data?.tag_name
                } 

                final_data.push(obj)            
            }

            const dataObj = {
                data: final_data,
                totalPages: totalPages,
                currentPage: currentPage,
                totalItem: tags.hits.total.value
            }
            
            return Promise.resolve(dataObj)
        }catch (e) {
            console.log("Error on format",e);
            
            return Promise.reject(e)
        }
    }

    async tagsFormatedData(tags:any) {

        try {
            const totalPages = Math.ceil(tags.hits.total.value / this.pageSize);
            const currentPage = this.page;
            let final_data = []
            
            for(const tag of tags?.hits?.hits){
                
                let obj = {
                    id: tag?._id,
                    name: tag?._source?.name,
                    color: tag?._source?.color,
                    channels: await this.getChannelsOfTags(tag?._id) || [],
                    created_at: tag?._source?.created_at,
                    updated_at: tag?._source?.updated_at,
                } 

                final_data.push(obj)            
            }

            const dataObj = {
                data: final_data,
                totalPages: totalPages,
                currentPage: currentPage,
                totalItem: tags.hits.total.value
            }
            
            return Promise.resolve(dataObj)
        }catch (e) {
            console.log("Error on format",e);
            
            return Promise.reject(e)
        }
    }

    
    async updateTag(data:any) {
        try{
            const docResult:any = await this.client.updateAndGetDocumentById(
                this.es_index,
                data?.id,
                data
            )
            return Promise.resolve(docResult)
        }catch(err){
            return Promise.reject(err)
        }
    }
}

