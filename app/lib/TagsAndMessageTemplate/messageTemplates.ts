import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";
import {throwIf} from "@/lib/ErrorHandler";
import collect from "collect.js";
import {
    AssignableTaskCreateDocInputInterface,
    AssignableTaskDocOutputInterface,
    TaskCreateInputInterface,
} from "@/actions/interface/ConversationInterface";

export default class MessageTemplateClass {
    client: ElasticsearchDBAdapter;
    es_index: string;
    es_channel_assign_index: string;
    private page:number
    private pageSize:number

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `_message_template`;
        this.es_channel_assign_index = `_tags_and_messagetemplate_assigned_to_channel`;
    }
    
    setData(page,pageSize) {
        this.page = page
        this.pageSize = pageSize
    }
    
    getMessageTemplatesQuery(page,pageSize) {
        return bodybuilder()
            .sort('created_at', 'asc')
            .from((page - 1) * pageSize)
            .size(pageSize)
            .build();
    }

    async addToChannel(body) {
        
        for (const data of body){

            const data_from_store = await this.isChannelExist(data)
           
            if(data_from_store.length > 0){
                console.log("Already Exist!");
            }else{
                await this.client.createAndGetDocument(this.es_channel_assign_index, {data: data})
            }
        }
        
        return Promise.resolve(null)
    }
    getMessageTemplateChannels(templateId) {
        return bodybuilder()
            .query('term', 'data.template_id.keyword', templateId)
            .query('term', 'data.dataSource.keyword', "messageTemplate")
            .build();
    }
    getMessageTemplateOfChannelByNameQuery(name,channelId) {
        return bodybuilder()
            .query('fuzzy', 'data.tag_name', name)
            .query('term', 'data.channel_id', channelId)
            .query('term', 'data.dataSource.keyword', "messageTemplate")
            .size(10)
            .build();
    }
    searchMessageTemplateQuery(name) {
        return bodybuilder()
            .query('bool', 'should', [
                { match: { 'message.keyword': name } },
                { match: { 'name': name } }
            ])
            .size(10)
            .build();
    }

    async isChannelExist(body) {
        const tag_channels:any = await this.client.execQuery(
            this.es_channel_assign_index,
            bodybuilder()
                .query('term', 'data.template_id.keyword', body?.template_id)
                .query('term', 'data.channel_name.keyword', body?.channel_name)
                .query('term', 'data.channel_id', body?.channel_id)
                .query('term', 'data.dataSource.keyword', "messageTemplate")
                .build()
        )

        return tag_channels?.hits?.hits;
    }

    async removeFromChannel(body) {
        try{
            this.client.deleteDocumentById(this.es_channel_assign_index, body?.es_channel_id)
            return Promise.resolve(null)
        }catch(err){
            return Promise.reject(err)
        }
    }

    async getChannelsOfMessageTemplates(templateId:string) {

        try{
            let tag_channels_list = []
    
            const tag_channels:any = await this.client.execQuery(
                this.es_channel_assign_index,
                this.getMessageTemplateChannels(templateId)
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

    async  getMessageTemplates() {
        try {
            const templates:any = await this.client.execQuery(
                this.es_index,
                this.getMessageTemplatesQuery(this.page,this.pageSize)
            )
            const totalPages = Math.ceil(templates.hits.total.value / this.pageSize);
            const currentPage = this.page;
            let final_data = []
            
            for(const template of templates?.hits?.hits){
                let obj = {
                    id: template?._id,
                    name: template?._source?.name,
                    message: template?._source?.message,
                    channels: await this.getChannelsOfMessageTemplates(template?._id) || [],
                    imageUri: template?._source?.imageUri,
                    created_at: template?._source?.created_at,
                    updated_at: template?._source?.updated_at,
                } 

                final_data.push(obj)            
            }
            const dataObj = {
                data: final_data,
                totalPages: totalPages,
                currentPage: currentPage,
                totalItem: templates.hits.total.value
            }
            
            
            return Promise.resolve(dataObj)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async searchMessageTemplate(queryString:string,channelId:number) {
        try{

            if(channelId == 0){
                const templates:any = await this.client.execQuery(
                    '_message_template',
                    this.searchMessageTemplateQuery(queryString)
                )
                // return Promise.resolve(null)
                
                const formated_data:any = await this.templatesSearchFormateData(templates)
                console.log("formated_data###########$$$$$$$$$$$$");
                console.log(formated_data);
                console.log("formated_data###########$$$$$$$$$$$$");
                
                return Promise.resolve(formated_data)
            }else{

                const templates:any = await this.client.execQuery(
                    '_tags_and_messagetemplate_assigned_to_channel',
                    this.getMessageTemplateOfChannelByNameQuery(queryString,channelId)
                )
                
                const formated_data:any = await this.tagsSearchByChannelFormatedData(templates)
                
                return Promise.resolve(formated_data)
            }
        }catch(e){
            console.log("sjsk",e);
            
            return Promise.reject(e)
        }
    }

    async templatesSearchFormateData(templates:any) {
        try {
            const totalPages = Math.ceil(templates.hits.total.value / this.pageSize);
            const currentPage = 0;
            let final_data = []
            console.log(templates?.hits?.hits);
            
            for(const template of templates?.hits?.hits){
                
                let obj = {
                    id: template?._id,
                    name: template?._source?.name,
                    message: template?._source?.message,
                }

                final_data.push(obj)            
            }

            const dataObj = {
                data: final_data,
                totalPages: totalPages || 0,
                currentPage: currentPage,
                totalItem: templates.hits.total.value
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

    async updateMessageTemplates(data:any) {
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

