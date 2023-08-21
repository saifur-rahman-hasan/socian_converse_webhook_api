import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import ConverseAgentActivities from "@/lib/ConverseMessengerService/ConverseAgentActivities";
import {AgentActivityLogDataInterface} from "@/lib/Interfaces/AgentWorkspaceCommonProperties";
import bodybuilder from "bodybuilder";
import {throwIf} from "@/lib/ErrorHandler";

interface AgentActivityLogInputObject {
    workspaceId: number | null
    channelId: number | null
    conversationId: string | null
    threadId: number | null
    agentId: number
    parentActivityId: string | null
    activityGroup: string | null,
    activityType: string
    activityInfo: string,
    activityState: "start" | "end",
    activityData: object | null,
    activityTime: string
    duration: number
}

class CommonProperties {
    workspaceId: number;
    agentId: number;

    constructor(workspaceId: number, agentId: number) {
        this.workspaceId = workspaceId;
        this.agentId = agentId;
    }
}

export class AgentActivityLogQuery extends CommonProperties {
    client: ElasticsearchDBAdapter;
    es_index: string;

    constructor(workspaceId: number, agentId: number) {
        super(workspaceId, agentId); // Call the constructor of the base class

        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__agent_activity`;
    }


    async startLoginActivity() {
        const activityDataDocObj: AgentActivityLogInputObject = {
            workspaceId: null,
            channelId: null,
            conversationId: null,
            threadId: null,
            agentId: this.agentId,
            parentActivityId: null,
            activityGroup: 'systemLogin',
            activityType: 'loggedIn',
            activityInfo: `Agent (${this.agentId}) has been logged in to the system.`,
            activityData: {time: new Date()},
            activityState: 'start',
            activityTime: new Date().toISOString(),
            duration: 0
        }

        try {
            const activityDoc = await this.client.createAndGetDocument(
                this.es_index,
                activityDataDocObj
            )

            const promiseData = activityDoc?._id
                ? {_id: activityDoc?._id, ...(<object>activityDoc?._source)}
                : null

            return Promise.resolve(promiseData)

        } catch (e) {
            return Promise.reject(e)
        }
    }

    async stopLoginActivity() {
        const today = new Date().toISOString().slice(0, 10);

        const loginActivityQuery = bodybuilder();
        loginActivityQuery.query('match', 'agentId', this.agentId);
        // loginActivityQuery.query('match', 'parentActivityId', null);
        loginActivityQuery.query('match', 'activityGroup', 'systemLogin');
        loginActivityQuery.query('match', 'activityType', 'loggedIn');
        loginActivityQuery.query('term', 'activityState', 'start');
        loginActivityQuery.filter('range', 'activityTime', {gte: today, lte: today});
        loginActivityQuery.sort('activityTime', 'desc');
        loginActivityQuery.size(1);

        try {
            const findActivityDoc = await this.client.execQuery(
                this.es_index,
                loginActivityQuery.build()
            ).then(res => {
                const data = res?.hits?.hits[0] || null
                return data ?
                    {_id: data?._id, ...(<object>data?._source)}
                    : null
            })

            throwIf(!findActivityDoc?._id, new Error("Login Activity not found to stop"))


            let currentDateTime: Date = new Date();
            let endDateTime: Date = new Date(findActivityDoc["activityTime"]);
            const durationMs: number = Math.abs(currentDateTime.getTime() - endDateTime.getTime());
            const duration = Math.floor((durationMs % (1000 * 60)) / 1000);


            const activityDataDocObj: AgentActivityLogInputObject = {
                workspaceId: null,
                channelId: null,
                conversationId: null,
                threadId: null,
                agentId: this.agentId,
                parentActivityId: null,
                activityGroup: 'systemLogin',
                activityType: 'loggedIn',
                activityInfo: `Agent (${this.agentId}) has been logged out from the system.`,
                activityData: {time: new Date()},
                activityState: 'end',
                activityTime: new Date().toISOString(),
                duration: duration
            }

            const loggedOutActivity = await this.client.createAndGetDocument(
                this.es_index,
                activityDataDocObj
            )

            const promiseData = loggedOutActivity?._id
                ? {_id: loggedOutActivity?._id, ...(<object>loggedOutActivity?._source)}
                : null

            return Promise.resolve(promiseData)

        } catch (e) {
            return Promise.reject(e)
        }
    }


    async startActivity(data: AgentActivityLogDataInterface): Promise<any> {
        try {
            const workspaceId = this.workspaceId
            const agentId = this.agentId
            const channelId = data?.channelId || null
            const conversationId = data?.conversationId || null
            const threadId = data?.threadId || null
            const activityGroup = data?.activityGroup || null
            const activityType = data?.activityType || null
            const activityTime = data?.activityTime || null
            const activityInfo = data?.activityInfo || null
            const activityState = data?.activityState || null
            const activityData = data?.activityData || null

            // Configure Messenger Instance
            const activitiesInstance = new ConverseAgentActivities(
                agentId,
                workspaceId,
                channelId,
                conversationId,
                threadId,
                activityGroup,
                activityType,
                activityTime,
                activityInfo,
                activityState,
                activityData
            )

            const response = await activitiesInstance.createActivity()

            return Promise.resolve(response)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    // async startWorkspacePreviewActivity() {}
    // async stopWorkspacePreviewActivity() {}
    // async startAgentInboxAccessActivity() {}
    // async stopAgentInboxAccessActivity() {}
    // async startAgentInboxTaskOpenActivity() {}
    // async startAgentInboxTaskCloseActivity() {}
    // async startAgentInboxTaskAcceptActivity() {}
    // async stopAgentInboxTaskAcceptActivity() {}


    getAgentCurrentAvailabilityStatusQuery(workspaceId, agentId, activityType = ['available', 'unavailable', 'break']) {
        // Set the range of the activityTime field to today
        const dateToday = new Date().toISOString().slice(0, 10);
        const query = bodybuilder();
        const size = 1

        // Add the query conditions
        query.query('match', 'workspaceId', workspaceId);
        query.query('match', 'agentId', agentId);
        query.query('match', 'activityGroup', 'availability_status');
        query.query('terms', 'activityType', activityType);
        query.query('match', 'activityState', 'start');

        // Set the range of the activityTime field to today
        query.filter('range', 'activityTime', {gte: dateToday, lte: dateToday});

        // Add sorting to get the latest result first
        query.sort('activityTime', 'desc');

        // Set the size to get the desired number of results (default is 1)
        query.size(size);

        return query.build();
    }

    async getAvailityStatus(workspaceId, agentId, activityType) {
        try {
            const task:any = await this.client.execQuery(
                this.es_index,
                this.getAgentCurrentAvailabilityStatusQuery(workspaceId, agentId, activityType)
            )
            if(task?.hits?.hits[0]?._source?.activityGroup === "availability_status" && task?.hits?.hits[0]?._source?.activityType === "available"){
                return task?.hits?.hits[0]
            }else {
                return null
            }
        } catch (e) {
            return null
        }
    }

    async getAgentCurrentAvailabilityStatus(workspaceId, agentId, activityType) {
        try {
            const queryResponse = await this.client.execQuery(
                this.es_index,
                this.getAgentCurrentAvailabilityStatusQuery(workspaceId, agentId, activityType)
            )

            const activityStatus : any = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(activityStatus)
        }catch (e) {
            return Promise.resolve(null)
        }
    }
}


