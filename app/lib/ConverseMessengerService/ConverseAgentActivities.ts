import MessengerConversation from "@/lib/ConverseMessengerService/MessengerConversation";
import MessengerWorkspace from "@/lib/ConverseMessengerService/MessengerWorkspace";
import MessengerChannel from "@/lib/ConverseMessengerService/MessengerChannel";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import {debugLog} from "@/utils/helperFunctions";

class ConverseAgentActivities {
    protected db_elasticsearch: ElasticsearchDBAdapter
    protected ES_INDEX_AGENT_ACTIVITY = "__agent_activity"
    public _authId: number;
    public _workspaceId: number;
    public _channelId?: number;
    public threadId?: number | string | null;
    public _channelUId?: string;
    public activityType?: string;
    public activityTime?: string;
    public activityInfo?: string;
    public activityGroup?: string;
    public activityData?: object;
    public activityState?: string;
    public conversationId?: string;

    public workspace: MessengerWorkspace;
    public channel: MessengerChannel | undefined;
    public conversation: MessengerConversation;

    constructor(
        authId: number,
        workspaceId: number,
        channelId?: number,
        conversationId?: string | null,
        threadId?: number | string | null,
        activityGroup?: string,
        activityType?: string,
        activityTime?: string,
        activityInfo?: string,
        activityState?: string,
        activityData?: object
    ) {
        this._authId = authId;
        this.db_elasticsearch = new ElasticsearchDBAdapter('socian_converse')
        this._workspaceId = workspaceId;
        this._channelId = channelId || null;
        this.threadId = threadId || "";
        this.activityType = activityType || "Unknown";
        this.activityTime = activityTime || new Date().toISOString();
        this.activityInfo = activityInfo || "";
        this.activityGroup = activityGroup || "";
        this.activityData = activityData || {};
        this.conversationId = conversationId || "";
        this.activityState = activityState || "start";

        this.workspace = new MessengerWorkspace(this);
        this.conversation = new MessengerConversation(this);

        if (channelId) {
            this.channel = new MessengerChannel(channelId);
            this._channelUId = this.channel.getChannelUId()
        }
    }

    async getAgentsDocuments(workspaceId, dateFrom="1900-01-01",dateTo="2100-12-31",from=0,size=100): Promise<any> {
        const conversationDocs = await this.db_elasticsearch.getDocumentsByQueryV1(
            this.ES_INDEX_AGENT_ACTIVITY,
            {workspaceId: workspaceId},
            [],
            null,
            null,
            {dateFrom: dateFrom, dateTo: dateTo,fieldName:"activityTime"},
            from,
            size,
            null
        )
        return Promise.resolve(conversationDocs);

    }

    async createActivity(): Promise<any> {
        try {
            let duration: number = 0;
            let parentActivityId: string = "";

            if (this.activityState === "end") {
                const last_start_items = await this.db_elasticsearch.getDocumentsByQuery(
                    this.ES_INDEX_AGENT_ACTIVITY,
                    null,
                    {
                        // workspaceId: this._workspaceId,
                        agentId: this._authId,
                        activityType: this.activityType,
                        activityState: "start",
                    },
                    null,
                    null,
                    null,
                    1,
                    {
                        "_doc": {
                            "order": "desc",
                            "unmapped_type": "boolean"
                        }
                    }
                )

                if (last_start_items.length > 0) {
                    parentActivityId = last_start_items[0]["_id"]
                    try {
                        let startDateTime: Date = new Date(this.activityTime);
                        let endDateTime: Date = new Date(last_start_items[0]["_source"]["activityTime"]);
                        const durationMs: number = Math.abs(startDateTime.getTime() - endDateTime.getTime());
                        duration = Math.floor((durationMs % (1000 * 60)) / 1000);
                        // return Promise.resolve({"startDateTime":startDateTime,"endDateTime":endDateTime,"durationMs":durationMs,"duration":duration});

                    } catch (error) {
                        console.error(error);
                        throw new Error(error.message);
                    }
                }

            }


            const source_obj = {
                "parentActivityId": parentActivityId,
                "agentId": this._authId,
                "workspaceId": this._workspaceId,
                "channelId": this._channelId,
                "threadId": this.threadId,
                "conversationId": this.conversationId,
                "duration": duration,
                "activityGroup": this.activityGroup,
                "activityType": this.activityType,
                "activityTime": this.activityTime,
                "activityInfo": this.activityInfo,
                "activityState": this.activityState,
                "activityData": this.activityData
            }

            const queryResponse = await this.db_elasticsearch.createAndGetDocument(
                this.ES_INDEX_AGENT_ACTIVITY,
                source_obj
            );

            const promiseData = this.db_elasticsearch.getFormattedFirstResult(queryResponse)

            return Promise.resolve(promiseData);
        }catch (e) {
            debugLog('Activity Logo Error', e.message)
            return Promise.reject(e);
        }
    }

    async createConversation(): Promise<any> {
        let duration: number = 0;
        let parentActivityId: string = "";
        if (this.activityState === "end") {
            const last_start_items = await this.db_elasticsearch.getDocumentsByQuery(
                this.ES_INDEX_AGENT_ACTIVITY,
                null,
                {
                    workspaceId: this._workspaceId,
                    agentId: this._authId,
                    activityType: this.activityType,
                    activityState: "start",
                },
                null,
                null,
                null,
                1,
                {
                    "_doc": {
                        "order": "desc",
                        "unmapped_type": "boolean"
                    }
                }
            )
            if (last_start_items.length > 0) {
                console.log("test",last_start_items)
                parentActivityId = last_start_items[0]["_id"]
                try {
                    let startDateTime: Date = new Date(this.activityTime);
                    let endDateTime: Date = new Date(last_start_items[0]["_source"]["activityTime"]);
                    const durationMs: number = Math.abs(startDateTime.getTime() - endDateTime.getTime());
                    duration = Math.floor((durationMs % (1000 * 60)) / 1000);
                    // return Promise.resolve({"startDateTime":startDateTime,"endDateTime":endDateTime,"durationMs":durationMs,"duration":duration});

                } catch (error) {
                    console.error(error);
                    throw new Error('Error checking Messenger connection');
                }


            }

        }


        const source_obj = {
            "parentActivityId": parentActivityId,
            "agentId": this._authId,
            "workspaceId": this._workspaceId,
            "channelId": this._channelId,
            "threadId": this.threadId,
            "conversationId": this.conversationId,
            "duration": duration,
            "activityGroup": this.activityGroup,
            "activityType": this.activityType,
            "activityTime": this.activityTime,
            "activityInfo": this.activityInfo,
            "activityState": this.activityState,
            "activityData": this.activityData
        }

        try {
            debugLog('source_obj', source_obj)

            const conversationResponse = await this.db_elasticsearch.createAndGetDocument(
                this.ES_INDEX_AGENT_ACTIVITY,
                source_obj
            );
            debugLog('conversationResponse', conversationResponse)

            return Promise.resolve(conversationResponse);
        }catch (e) {

            return Promise.reject(e);
        }

    }

    setChannelId(channelId: number | undefined): ConverseAgentActivities {
        if (channelId) {
            this._channelId = channelId;
            this.channel = new MessengerChannel(channelId);
        } else {
            this._channelId = undefined
            this.channel = undefined;
        }
        return this;
    }
}

export default ConverseAgentActivities;
