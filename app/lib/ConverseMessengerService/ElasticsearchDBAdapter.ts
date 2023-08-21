import { Client } from "@elastic/elasticsearch";
import collect from "collect.js";

class ElasticsearchDBAdapter {
    private readonly indexPrefix: string;
    public client: Client;
    private queryRawResults: null;
    private indexName: null;
    private __searchedResults: null;

    /**
     * Construct the ElasticService class
     *
     * @param indexPrefix
     */
    constructor(indexPrefix = 'socian_converse') {
        this.indexPrefix = indexPrefix

        this.client = new Client({
            node: "https://elastic:f$iI8T14AF6Vox2L^M2H4@mybuzz.socian.ai:5000",
        })

        this.queryRawResults = null

        this.indexName = null
        this.__searchedResults = null
    }

    setIndexName(indexName) {
        const indexExist = this.indexExists(indexName)

        if(indexExist){
            this.indexName = indexName
        }else{
            this.indexName = null
        }

        return this
    }

    /**
     * Check the Given indexName is exists on connected ES
     *
     * @param indexName
     * @param forceCreate
     */
    async indexExists(indexName, forceCreate = false) {
        try {
            const index = await this.client.indices.exists({
                index: `${this.indexPrefix}${indexName}`,
            })

            return Promise.resolve(true)
        }catch (e) {
            if(forceCreate){
                await this.createIndex(indexName)
                return Promise.reject(true)
            }
            return Promise.reject(false)
        }
    }

    /**
     * Create new Index
     *
     * @param indexName
     */
    async createIndex(indexName) {
        return await this.client.indices.create({
            index: `${this.indexPrefix}${indexName}`
        });
    }

    /**
     * Truncate all data from the given indexName on ES
     *
     * @param indexName
     * @returns {Promise<DeleteByQueryResponse>}
     */
    async truncateIndex(indexName) {
        return await this.client.deleteByQuery({
            index: `${this.indexPrefix}${indexName}`,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
    }

    /**
     * Create a new Document in to the given indexName on connected ES
     *
     * @param indexName
     * @param document
     * @returns {Promise<WriteResponseBase>}
     */
    async createDocument(indexName, document) {
        return await this.client.index({
            index: `${this.indexPrefix}${indexName}`,
            body: document,
        });
    }
    async createDocumentById(data) {
        return await this.client.index({
            id: data?.id,
            index: `${this.indexPrefix}${data?.indexName}`,
            body: data?.document,
        });
    }

    /**
     *
     * @param indexName
     * @param document
     * @returns {Promise<unknown>}
     */
    async createAndGetDocument(indexName, document) {
        try {
            const indexKey = `${this.indexPrefix}${indexName}`

            const createResult = await this.client.index({
                index: indexKey,
                body: document,
            });

            // Fetch the inserted document from Elasticsearch and return it in the response
            const promiseData = await this.getDocumentById(indexName, createResult._id)
            return Promise.resolve(promiseData)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    /**
     *
     * @param indexName
     * @param id
     * @returns {Promise<GetGetResult<unknown>>}
     */
    async getDocumentById(indexName, id) {
        return this.findDocumentById(indexName, id)
    }

    /**
     * Searches for a document in an Elasticsearch index by its ID and returns the first matching record.
     * @param {string} indexName - The name of the Elasticsearch index.
     * @param {string} id - The ID of the document to find.
     * @returns {Promise<SearchResponse<unknown>>} - A promise that resolves to the search response containing the first matching record.
     */
    async findDocumentById(indexName, id) {
        return await this.client.get({
            index: `${this.indexPrefix}${indexName}`,
            id,
        });
    }

    /**
     *
     * @param indexName
     * @param query
     * @returns {Promise<GetGetResult<unknown>>}
     */
    async execQuery(indexName, query) {
        return await this.client.search({
            index: `${this.indexPrefix}${indexName}`,
            body: query
        });
    }

    /**
     *
     * @param indexName
     * @param filter
     * @param must
     * @param mustNot
     * @param should
     * @param timeRange
     * @param size
     * @param sortBy
     * @returns {Promise<*>}
     */
    async getDocumentsByQuery(indexName, filter = null, must = null, mustNot = null, should = null, timeRange = null, size = 20, sortBy = null, orderBy = null) {
        try {
            const buildQueryObject = this.elasticBuildQuery(
                filter,
                must,
                mustNot,
                should,
                sortBy,
                orderBy,
                null,
                size,
                timeRange
            )

            const response = await this.client.search({
                index: `${this.indexPrefix}${indexName}`,
                body: buildQueryObject,
            });

            return Promise.resolve(response?.hits?.hits || []);

        }catch (e) {
            return Promise.resolve([])
        }
    }

    async getDocumentsByQueryV1(indexName, filter = null, must = null, mustNot = null, should = null, timeRange = null,from=0, size = 20, sortBy = null,orderBy=null) {
        const buildQueryObject = this.elasticBuildQuery(
            filter,
            must,
            mustNot,
            should,
            sortBy,
            orderBy,
            from,
            size,
            timeRange
        )

        const response = await this.client.search({
            index: `${this.indexPrefix}${indexName}`,
            body: buildQueryObject,
        });
        const total = response?.hits?.total || undefined
        return {data:response.hits.hits,total:total};
    }

    async query(indexName, query) {
        try {
            const response = await this.client.search({
                index: `${this.indexPrefix}${indexName}`,
                body: {
                    query: query,
                },
            });

            const hits = response.hits.hits.map((hit) => {
                return {
                    _id: hit?._id,
                    ...(typeof hit._source === 'object' ? hit._source : {}),
                }
            });

            return Promise.resolve(hits);
        } catch (error) {
            console.error('getDocumentsByQuery error:', error);
            return Promise.reject(error);
        }
    }


    /**
     *
     * @param indexName
     * @param id
     * @param document
     * @returns {Promise<*&{_id}>}
     */
    async updateAndGetDocumentById(indexName, id, document) {
        try {
            // Update the document in Elasticsearch
            const updatedDocumentResult = await this.updateDocumentById(indexName, id, document);

            // Fetch the updated document from Elasticsearch and return it in the response
            const updatedDocument = await this.getDocumentById(indexName, updatedDocumentResult._id);

            const promiseData = this.getFormattedFirstResult(updatedDocument)

            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    /**
     *
     * @param indexName
     * @param id
     * @param document
     * @returns {Promise<UpdateUpdateWriteResponseBase<unknown>>}
     */
    async updateDocumentById(indexName, id, document) {
        return await this.client.update({
            index: `${this.indexPrefix}${indexName}`,
            id,
            body: {
                doc: document,
            },
        });
    }

    getIndex(indexName) {
        return `${this.indexPrefix}${indexName}`
    }

    /**
     *
     * @param indexName
     * @param id
     * @returns {Promise<WriteResponseBase>}
     */
    async deleteDocumentById(indexName, id) {
        return await this.client.delete({
            index: `${this.indexPrefix}${indexName}`,
            id,
        });
    }


    // ElasticSearch Query Helper Methods
    /**
     * elasticBuildQuery
     *
     * @param filter
     * @param must
     * @param mustNot
     * @param should
     * @param sortBy
     * @param orderBy
     * @param from
     * @param size
     * @param timeRange
     * @returns {{size: number, query: {bool: {filter: *[], should: *[], must_not: *[], must: *[]}}, from: number, sort: *[]}}
     */
    elasticBuildQuery(
        filter,
        must,
        mustNot,
        should,
        sortBy,
        orderBy,
        from,
        size,
        timeRange
    ) {
        const query = {
            "query": {
                "bool": {
                    "must": [],
                    "filter": [],
                    "should": [],
                    "must_not": []
                }
            },
            "sort": [],
            "from": from || 0,
            "size": size || 10
        };

        // Add date range query
        if (timeRange) {
            const {dateFrom, dateTo,fieldName} = timeRange
            const dateTimeField =fieldName ? fieldName: "date";
            query.query.bool.must.push({
                "range": {
                    [dateTimeField]: {
                        "gte": dateFrom || "1900-01-01",
                        "lte": dateTo || "2100-12-31"
                    }
                }
            });
        }

        // Add filter queries
        if (filter) {
            for (const [fieldName, fieldValue] of Object.entries(filter)) {
                query.query.bool.filter.push({
                    "match": {
                        [fieldName]: fieldValue
                    }
                });
            }
        }

        // Add must query
        if (must) {
            for (const [fieldName, fieldValue] of Object.entries(must)) {
                query.query.bool.must.push({
                    "match": {
                        [fieldName]: fieldValue
                    }
                });
            }
        }

        // Add must_not queries
        if (mustNot) {
            for (const [fieldName, fieldValue] of Object.entries(mustNot)) {
                query.query.bool.must_not.push({
                    "match": {
                        [fieldName]: fieldValue
                    }
                });
            }
        }

        // Add should query
        if (should) {
            for (const [fieldName, fieldValue] of Object.entries(should)) {
                query.query.bool.should.push({
                    "match": {
                        [fieldName]: fieldValue
                    }
                });
            }
        }

        // Add sorting rule
        if (sortBy && orderBy) {
            const sortRule = {};
            sortRule[sortBy] = {
                "order": orderBy
            };
            query.sort.push(sortRule);
        }

        return query;
    }

    async findAndUpdateOrCreateDocument(indexName, options) {
        const {findQuery, updatedData, createData} = options
        let documentData = null

        try {
            // Find the document
            const documents = await this.getDocumentsByQuery(
                indexName,
                findQuery
            );

            if (documents.length > 0) {
                // Document exists, update and get it
                const document = documents[0];
                documentData = await this.updateAndGetDocumentById(indexName, document._id, updatedData);

                return {
                    data: documentData,
                    action: 'updated'
                }

            } else {
                throw new Error('Conversation Not Found')
            }

        }catch (error) {
            // Document doesn't exist, create a new one and get it
            documentData = await this.createAndGetDocument(indexName, createData);
            return {
                data: documentData,
                action: 'created'
            }
        }
    }

    async deleteDocumentsByQuery(indexName, query) {
        try {
            return await this.client.deleteByQuery({
                index: this.getIndex(indexName),
                body: {
                    query
                }
            });
        } catch (error) {
            console.error('Error deleting documents:', error);
        }
    }

    /**
     * Helping Functions
     *
     * @param document
     */

    getFirstResult(document){
        return document?.hits?.hits[0] || null
    }

    getFormattedDocResults(data: any) {
        return collect(data?.hits?.hits || []).map((doc: any) => {
            return {
                _id: doc?._id,
                ...doc?._source
            };
        }).all();
    }
    
    getFormattedUniqueConsumerResults(data: any) {
        return collect(data?.hits?.hits || []).map((doc: any) => {

            const consumerObj = collect(doc?._source?.participants).firstWhere('role', 'consumer');
            
            consumerObj['id'] = doc?._id
            consumerObj['currentThreadId'] = doc?._source?.currentThreadId
            
            return consumerObj;
        }).all();
    }

    getFormattedJoinedDocId(document: any) {
        return {
            _id:document._id,
            ...document._source
        }
    }

    getFormattedFirstResult(document): any {
        if(!document){ return null }

        return {
            _id: document._id,
            ...document._source
        }
    }

    getCountFromResponse(queryResponse: any): number {
        try {
            if (
                queryResponse &&
                queryResponse.hits &&
                queryResponse.hits.total &&
                typeof queryResponse.hits.total.value === 'number'
            ) {
                return queryResponse.hits.total.value;
            } else {
                return 0;
            }
        } catch (error) {
            console.error('Error parsing Elasticsearch response:', error);
            return 0;
        }
    }
}

export default ElasticsearchDBAdapter