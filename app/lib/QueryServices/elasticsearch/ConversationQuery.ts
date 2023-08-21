import {
    ConversationCreateInputInterface, ConversationDocOutputInterface, ConversationUpdateInputInterface,
} from "@/actions/interface/ConversationInterface";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";
import bodybuilder from "bodybuilder";


export default class ConversationQuery {

    client: ElasticsearchDBAdapter;
    es_index: string;

    private newDate: Date;

    private messageQuery: MessageQuery;

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__messenger_conversations`;
        this.newDate = new Date

        this.messageQuery = new MessageQuery()

    }

    async removeConversationByUid(conversationUid: string) {
        try {
            const query = bodybuilder()
                .query('term', 'conversationUid', conversationUid)
                .size(1)
                .build()

            const queryResponse = await this.client.execQuery(this.es_index, query)
            const conversation = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            const deleteResponse = this.client.deleteDocumentById(this.es_index, conversation._id)

            return Promise.resolve(deleteResponse)
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findConversationByConsumerId(
        channelId: number,
        consumerId: string
    ): Promise<ConversationDocOutputInterface> {
        try {

            // Execute the query and get conversation documents
            const conversationDocResponse = await this.client.execQuery(
                this.es_index,
                EsQuery.findConversationByConsumerIdQuery(channelId, consumerId)
            );

            // Convert the Elasticsearch response to ConversationDocOutputInterface[]
            const conversationDoc: ConversationDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(conversationDocResponse));

            return Promise.resolve(conversationDoc);
        }catch (e) {
            return Promise.reject(e)
        }
    }


    async getConversationsByIdList(conversationIdList: any) {
        try {

            const conversationListQuery = conversationIdList.map(_id => {
                return {
                    "match_phrase": {
                        "_id": _id
                    }
                }
            });

            const query = {
                "query": {
                    "bool": {
                        "should": conversationListQuery,
                        "minimum_should_match": 1
                    }
                }
            }

            // return query
            const conversationDocResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const conversationDocs: ConversationDocOutputInterface[] = this.client.getFormattedDocResults(conversationDocResponse)


            return Promise.resolve(conversationDocs)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async findConversationById(conversationDocId: string): Promise<ConversationDocOutputInterface> {
        try {
            const queryResponse = await this.client.findDocumentById(
                this.es_index,
                conversationDocId
            )

            const conversationDoc: ConversationDocOutputInterface = this.client.getFormattedFirstResult(queryResponse)

            return Promise.resolve(conversationDoc)
        }catch (e) {
            return Promise.reject("Conversation Doc Not found in (findConversationById)")
        }
    }

    async findUniqueConversationByUid(conversationUid: string) {
        try {
            const query = EsQuery.getFindUniqueConversationByUidQuery(conversationUid)

            const queryResponse = await this.client.execQuery(this.es_index, query )
            const docData : ConversationDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(docData)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    async createAndGetConversationDoc(data: ConversationCreateInputInterface): Promise<ConversationDocOutputInterface> {
        try {
            data['conversationClosed'] = false
            data['createdAt'] = this.newDate
            data['updatedAt'] = this.newDate

            const document = await this.client.createAndGetDocument(this.es_index, data )
            const docData: ConversationDocOutputInterface = this.client.getFormattedFirstResult(document)

            return Promise.resolve(docData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async updateAndGetConversationDoc (conversationId: string, data: ConversationUpdateInputInterface): Promise<ConversationDocOutputInterface> {
        try {
            data['updatedAt'] = this.newDate

            const docResult: ConversationDocOutputInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                conversationId,
                data
            )

            return Promise.resolve(docResult)
        }catch (e) {
            return Promise.reject(e)
        }
    }
}