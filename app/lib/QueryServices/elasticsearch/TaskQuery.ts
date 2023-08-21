import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";
import AgentTaskObject from "@/lib/ConverseMessengerService/AgentTasks/AgentTaskObject";
import {throwIf} from "@/lib/ErrorHandler";
import collect from "collect.js";
import {
    AssignableTaskCreateDocInputInterface,
    AssignableTaskDocOutputInterface,
    TaskCreateInputInterface,
} from "@/actions/interface/ConversationInterface";
import {
    AgentAssignedActiveTaskDocReadInterface,
    AgentAssignedTaskDocReadInterface, AgentAssignTaskOutputInterface
} from "@/actions/interface/AgentInterface";
import MessageQuery from "@/lib/QueryServices/elasticsearch/MessageQuery";
import EsQuery from "@/lib/elasticsearch/adapter/EsQuery";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {calculateTaskDurationInSeconds, debugLog} from "@/utils/helperFunctions";
import {TaskFilterDataInterface} from "@/lib/Interfaces/TaskFilterDataInterface";

export default class TaskQuery {
    client: ElasticsearchDBAdapter;
    es_index: string;
    private newDate: Date;
    private maxLimit = 10000

    constructor() {
        this.client = new ElasticsearchDBAdapter('socian_converse');
        this.es_index = `__agent_tasks`;
        this.newDate = new Date
    }

    async removedTasksByConversationId(conversationId: string) {
        try {
            const query = bodybuilder()
                .query('term', 'sourceData.conversationId.keyword', conversationId)
                .build()

            const queryResponse = await this.client.execQuery(this.es_index, query)
            const tasks = this.client.getFormattedDocResults(queryResponse)
            const taskIds = collect(tasks).pluck('_id').toArray()
            taskIds.forEach((taskId: string) => {
                this.client.deleteDocumentById(this.es_index, taskId)
            })

            return Promise.resolve(tasks)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async getAgentActiveTasksList(
        workspaceId: number,
        channelId: number,
        agentId: number,
        size: number = 20
    ): Promise<AgentAssignedActiveTaskDocReadInterface[]> {
        try {
            const query = bodybuilder()
                .query('term', 'sourceData.workspaceId', workspaceId)
                .query('term', 'sourceData.channelId', channelId)
                .query('term', 'status', 'new')
                .query('term', 'assignable', false)
                .query('term', 'assigned', true)
                .query('term', 'assignedAgentId', agentId)
                .query('term', 'assignedTaskIsClosed', false)
                .query('term', 'assignedTaskIsFullFilled', false)
                .query('term', 'assignedTaskIsVerifiedAndClosed', false)
                // .query('term', 'consumerForceClosed', false) // active the after push
                .size(size)
                .build()

            const queryResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )

            const agentActiveTasks: AgentAssignedActiveTaskDocReadInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(agentActiveTasks)
        }catch (e) {
            debugLog('Failed to fetch agent active taks list', e)
            return Promise.reject(e)
        }
    }

    async getAgentQueueTasksList(
        workspaceId: number,
        channelId: number,
        agentId: number,
        size: number = 20
    ): Promise<AgentAssignedActiveTaskDocReadInterface[]> {
        try {
            const query = bodybuilder()
                .query('term', 'sourceData.workspaceId', workspaceId)
                .query('term', 'sourceData.channelId', channelId)
                .query('term', 'status', 'assigned')
                .query('term', 'assignable', false)
                .query('term', 'assigned', true)
                .query('term', 'assignedAgentId', agentId)
                .query('term', 'assignedTaskIsClosed', false)
                .query('term', 'assignedTaskIsFullFilled', false)
                .query('term', 'assignedTaskIsVerifiedAndClosed', false)
                // .query('term', 'consumerForceClosed', false) // active the after push
                .size(size)
                .build()

            const queryResponse: any = await this.client.execQuery(
                this.es_index,
                query
            )

            const agentActiveTasks: AgentAssignedActiveTaskDocReadInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(agentActiveTasks)
        }catch (e) {
            debugLog('Failed to fetch agent active taks list', e)
            return Promise.reject(e)
        }
    }

    async createTask(workspaceId, channelId, newConversationDocId, fbMessageId, threadId, threadContent) {
        try {
            const agentTaskSourceData = {
                workspaceId,
                channelId,
                conversationId: newConversationDocId,
                messageId: fbMessageId,
                threadId
            }
            const AgentTaskDocObject = new AgentTaskObject(
                threadId,
                threadContent,
                'new',
                agentTaskSourceData,
                null,
                true,
                false,
                null,
                false,
                false,
                false,
                ""
            )

            const agentTaskDoc = await this.client.createAndGetDocument(
                this.es_index,
                AgentTaskDocObject
            )

            throwIf(!agentTaskDoc?._id, new Error('Unable to create task.'))

        } catch (err) {
            console.log("Error", err.toString())
            throw new Error("Invalid Task object")
        }
    }


    async getTasksByThreadIdList(threadIdList: any) {

        const fallbackData = []
        try {
            const threadIdListQuery = threadIdList.map(number => {
                return {
                    "match_phrase": {
                        "sourceData.threadId": number
                    }
                }
            });

            const query = {
                "query": {
                    "bool": {
                        "should": threadIdListQuery,
                        "minimum_should_match": 1
                    }
                }
            }
            // return query
            const assignedTasks = await this.client.execQuery(
                this.es_index,
                query
            )
            const assignedTasksDocs = assignedTasks?.hits?.hits || []
            if (assignedTasksDocs.length > 0) {
                return collect(assignedTasksDocs)
                    .map(task => ({_id: task._id, ...(<object>task._source)}))
                    .toArray()
            }
            return fallbackData
        } catch (e) {
            return fallbackData
        }
    }

    getAgentAssignedTasksQuery(agentId: number, taskId: number | null = null, assignedTaskIsClosed: boolean = false) {
        const queryBuilder = bodybuilder()
            .query('term', 'assigned', true)
            .query('term', 'assignedAgentId', agentId)
            .query('term', 'assignedTaskIsClosed', assignedTaskIsClosed);

        if (taskId !== null) {
            queryBuilder.query('term', 'taskId', taskId);
            queryBuilder.size(1);
        }else{
            queryBuilder.size(this.maxLimit || 10000);
        }

        return queryBuilder.build();
    }

    getTaskByThreadIdQuery(taskId: number, assignedTaskIsClosed: boolean = false) {
        return bodybuilder()
            .query('term', 'assigned', true)
            .query('term', 'taskId', taskId)
            .query('term', 'assignedTaskIsClosed', assignedTaskIsClosed)
            .size(1)
            .build();
    }

    async getConnectedThreadTaskByThreadId(threadId: number) {
        try {
            const query = bodybuilder()
                .query('term', 'taskId', threadId)
                .size(1)
                .build();

            const queryResponse = await this.client.execQuery(this.es_index, query)
            const task : AgentAssignTaskOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(task)
        }catch (e) {
            return Promise.reject(null)
        }
    }

    async createAndGetTaskDoc(data: TaskCreateInputInterface) {
        try {
            const newTaskDocData: AssignableTaskCreateDocInputInterface = {
                taskId: data.taskId,
                taskDescription: data.taskDescription,
                taskStatus: 'new',
                taskStartTimestamp: this.newDate,
                taskEndTimestamp: null,
                taskDurationSeconds: 0,
                sourceData: data.sourceData,
                taskActivityGroupId: null,
                assignable: true,
                assigned: false,
                assignedAgentId: null,
                assignedTaskIsClosed: false,
                assignedTaskIsFullFilled: false,
                assignedTaskIsVerifiedAndClosed: false
            }

            newTaskDocData['createdAt'] = this.newDate
            newTaskDocData['updatedAt'] = this.newDate

            const document: any = await this.client.createAndGetDocument(this.es_index, newTaskDocData)
            const docData: AssignableTaskDocOutputInterface = this.client.getFormattedFirstResult(document)

            return Promise.resolve(docData)

        } catch (e) {
            throw new Error('Failed to create new task')
        }
    }

    async getAgentAssignedNotClosedTask(agentId: number, taskId: number): Promise<AgentAssignedTaskDocReadInterface> {
        try {
            const queryResponse = await this.client.execQuery(
                this.es_index,
                this.getAgentAssignedTasksQuery(agentId, taskId, false)
            )

            const assignedTaskDoc: AgentAssignedTaskDocReadInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(assignedTaskDoc)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getAgentAssignedNotClosedTasksList(agentId: number): Promise<AgentAssignedTaskDocReadInterface[]> {
        try {
            const queryResponse = await this.client.execQuery(
                this.es_index,
                EsQuery.getAgentAssignedNotClosedTasksQuery(agentId)
            )

            const assignedTaskDoc: AgentAssignedTaskDocReadInterface[] = this.client.getFormattedDocResults(queryResponse)
            const conversationIdList = collect(assignedTaskDoc).pluck('sourceData.conversationId').unique().toArray()

            const conversationsList = await (new ConversationQuery()).getConversationsByIdList(conversationIdList)

            const promiseData: AgentAssignedTaskDocReadInterface[] = collect(assignedTaskDoc)
                .map(task => {
                    const conversation = collect(conversationsList).firstWhere('_id', task.sourceData.conversationId)
                    const participants = conversation?.participants
                    if(participants){
                        const consumerData = collect(participants).firstWhere('role', 'consumer')

                        return consumerData?.name
                            ? {...task, author: consumerData}
                            : {...task, author: null }
                    }
                    return {...task, author: null }
                }).all()

            return Promise.resolve(promiseData)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async getTaskByThreadId(threadId: number, assignedTaskIsClosed: boolean = false): Promise<AgentAssignedTaskDocReadInterface> {
        try {
            const queryResponse = await this.client.execQuery(
                this.es_index,
                this.getTaskByThreadIdQuery(threadId, assignedTaskIsClosed)
            )

            const assignedTaskDoc: AgentAssignedTaskDocReadInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(assignedTaskDoc)
        } catch (e) {
            return Promise.reject(e)
        }
    }


    async findConsumerAssignedAgentTaskByThreadId(threadId: number): Promise<AgentAssignedTaskDocReadInterface> {
        try {
            const queryResponse = await this.client.execQuery(
                this.es_index,
                EsQuery.findConsumerAssignedAgentTaskByThreadIdQuery(threadId)
            )

            const assignedTaskDoc: AgentAssignedTaskDocReadInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(assignedTaskDoc)
        } catch (e) {
            return Promise.reject(e)
        }
    }



    async getAssignableTaskListList(workspace_id): Promise<any> {
        try {
            const query = await bodybuilder()
                .query('term', 'assignable', true)
                .query('term', 'assigned', false)
                .query('term', 'sourceData.workspaceId', workspace_id)
                .query('exists', 'sourceData.workspaceId')
                .query('exists', 'sourceData.channelId')
                .query('exists', 'sourceData.conversationId')
                .query('exists', 'sourceData.threadId')
                .query('exists', 'sourceData.messageId')
                .sort('createdAt', 'desc')
                .size(this.maxLimit)
                .build();
            const task = await this.client.execQuery(
                this.es_index,
                query
            )
            const assignedTasksDocs = task?.hits?.hits || []
            if (assignedTasksDocs.length > 0) {
                return Promise.resolve(collect(assignedTasksDocs)
                    .map(task => ({_id: task._id, ...(<object>task._source)}))
                    .toArray())
            }else {
                return []
            }
        } catch
            (e) {
            return Promise.reject(e)
        }
    }
    async getQCManagerTaskList(workspaceId:number,filterData :TaskFilterDataInterface): Promise<any> {
        try {
            // initiate state
            if(!filterData?.from){
                filterData.from = 0
            }
            if(!filterData?.size){
                filterData.size = 10
            }
            let shouldQueryList= []
            let mustQueryList= []

            // filtering date range
            if (filterData?.dateRange?.from && filterData?.dateRange?.to){
                shouldQueryList.push({
                    range: { createdAt: { gte: filterData?.dateRange?.from, lte: filterData?.dateRange?.to } },
                })
            }

            // filtering channels
            if (filterData?.channels.length>0){
                shouldQueryList.push({
                    terms: { 'sourceData.channelId': filterData?.channels },
                })

            }

            // filtering threads
            if (filterData?.threadId.length>0){
                mustQueryList.push({
                    terms: { 'sourceData.threadId': filterData?.threadId},
                })
            }

            // filtering agents
            if (filterData?.agents.length>0){
                shouldQueryList.push({
                    terms: { 'assignedAgentId': filterData?.agents },
                })
            }
            // filtering taskStatus
            if (filterData?.taskStatus.length>0){
                shouldQueryList.push({
                    terms: { 'taskStatus.keyword': filterData?.taskStatus },
                })
            }

            // filtering tags
            if (filterData?.tags.length>0){
                shouldQueryList.push({
                    terms: { 'closingTags.id': filterData?.tags },
                })
            }


            const query = bodybuilder()
                .query('term', 'sourceData.workspaceId', workspaceId)
                .query('term', 'taskStatus.keyword', 'AgentTaskClosed')
                .query('bool', {
                    should: shouldQueryList,
                    minimum_should_match: 1,
                })
                .filter('bool', {
                    must: mustQueryList,
                })
                .from(filterData.from)
                .size(filterData.size).build()
            const totalTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            // debugLog("Query",JSON.stringify(query,null,4))
            filterData.total = totalTaskResponse?.hits?.total?.value
            const task_list = this.client.getFormattedDocResults(totalTaskResponse)
            let finalTaskList = []
            if(task_list?.length>0){
                const messageQuery = new MessageQuery()
                for(const item of task_list){
                    if (item.taskStatus==="AgentTaskClosed"){
                        const agentFirstMessage = await messageQuery.getAgentFirstMessages(item?.taskId)
                        debugLog("agentFirstMessage ",agentFirstMessage)

                        if (Object.keys(agentFirstMessage).length>0 && agentFirstMessage?.createdAt){
                            const time = agentFirstMessage.createdAt
                            const consumer = agentFirstMessage.to
                            const agent = agentFirstMessage.from
                            const durationInSeconds = this.calculateDurationInSeconds(time, item.taskEndTimestamp);
                            const responseTimeInSeconds = this.calculateDurationInSeconds(item.createdAt,time);

                            const taskObject = {
                                ...item,
                                durationInSeconds:this.secondsToHHMMSS(durationInSeconds),
                                responseTime:this.secondsToHHMMSS(responseTimeInSeconds),
                                agent_start_time: time,
                                consumer:consumer,
                                agent:agent
                            }
                            finalTaskList.push(taskObject)

                        }else{
                            const taskObject ={
                                ...item,
                                durationInSeconds:"",
                                responseTime:"",
                                agent_start_time: item.createdAt,
                                consumer:{},
                                agent:{}
                            }
                            finalTaskList.push(taskObject)
                        }
                    }else {
                        const taskObject ={
                            ...item,
                            durationInSeconds:"",
                            responseTime:"",
                            agent_start_time: item.createdAt,
                            consumer:{},
                            agent:{}
                        }
                        finalTaskList.push(taskObject)
                    }

                }
            }

            return {
                "filter":filterData,
                "data":finalTaskList
            }
        } catch
            (e) {
            console.log(e)
            return {}
        }

    }
    async getTaskOverviewReports(dateFrom="1900-01-01",dateTo="2100-12-31",channelIds:[],agentId:null): Promise<any> {
        const messageQuery = new MessageQuery()

        let filterAgent= []
        if (agentId){
            filterAgent = [{
                match: { assignedAgentId: agentId },
            }]
        }
        let agentAllTaskList = []
        let closeTaskList = []

        let total_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size( this.maxLimit).build()
            const totalTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            // debugLog('result',totalTaskResponse)
            total_task = totalTaskResponse?.hits?.total?.value
            agentAllTaskList =  totalTaskResponse?.hits?.hits


        } catch
            (e) {
            console.log(e)
        }

        let total_closed_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .query('term', 'assignedTaskIsClosed', true)
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size(this.maxLimit)
                .build();
            const totalClosedTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_closed_task = totalClosedTaskResponse?.hits?.total?.value
            if(totalClosedTaskResponse?.hits?.hits?.length>0){
                for(const item of totalClosedTaskResponse?.hits?.hits){
                    const agentFirstMessage = await messageQuery.getAgentFirstMessages(item?._source?.taskId)
                    if (Object.keys(agentFirstMessage).length>0){
                        const time = agentFirstMessage.createdAt
                        const taskObject = {
                            _id:item._id,
                            ...item._source,
                            agent_start_time: time
                        }
                        closeTaskList.push(taskObject)

                    }else{
                        const taskObject ={
                            _id:item._id,
                            ...item._source,
                            agent_start_time: item._source.createdAt
                        }
                        closeTaskList.push(taskObject)
                    }
                }
            }

        } catch
            (e) {
            console.log(e)
        }
        let total_partially_closed_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .query('term', 'assignedTaskIsClosed', false)
                .query('match', 'taskStatus', 'AgentTaskClosed')
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const totalPartiallyClosedTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_partially_closed_task = totalPartiallyClosedTaskResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }

        let active_assigned_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .query('term', 'assigned', true)
                .query('term', 'assignedTaskIsClosed', false)
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const active_assigned_taskTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            active_assigned_task = active_assigned_taskTaskResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }
        let total_assigned_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .query('term', 'assigned', true)
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const totalAssignedTask:any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_assigned_task = totalAssignedTask?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }

        let total_pending_task = 0
        try {
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: dateFrom, lte: dateTo })
                .query('terms', 'sourceData.channelId', channelIds)
                .query('term', 'assigned', false)
                .query('term', 'assignable', true)
                .filter('bool', {
                    should: filterAgent,
                    minimum_should_match: 1,
                })
                .size(0)
                .build();
            const totalPendingTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )
            total_pending_task = totalPendingTaskResponse?.hits?.total?.value
        } catch
            (e) {
            console.log(e)
        }


        const total_ice_message = await messageQuery.getTotalIceMessage(dateFrom,dateTo,channelIds,agentAllTaskList)

        const {totalIceFeedbackMessageY,totalIceFeedbackMessageN} = await messageQuery.getTotalIceFeedBack(dateFrom,dateTo,channelIds,agentAllTaskList)
        // return {totalIceFeedbackMessageY,totalIceFeedbackMessageN}
        // total response
        const total_response_rate = (total_closed_task/total_task)*100


        let total_response_time = 0
        for(const task of closeTaskList){
            const durationInSeconds = this.calculateDurationInSeconds(task.createdAt, task.agent_start_time);
            if(durationInSeconds>0) {
                total_response_time += durationInSeconds
            }
        }

        const {total_agent_message,total_consumer_message} = await messageQuery.getAgentAndConsumerMessages(dateFrom,dateTo,channelIds,agentAllTaskList)

        let total_handling_time = 0
        for(const task of closeTaskList){
            // debugLog('task.agent_start_time:::',task)
            // debugLog(' task.taskEndTimestamp:::', task.taskEndTimestamp)
            const durationInSeconds = this.calculateDurationInSeconds(task.agent_start_time, task.taskEndTimestamp);
            if(durationInSeconds>0){
                total_handling_time += durationInSeconds
            }

        }

        let total_waiting_time = 0
        for(const task of closeTaskList){
            const durationInSeconds = this.calculateDurationInSeconds(task.createdAt, task.taskEndTimestamp);
            if(durationInSeconds>0) {
                total_waiting_time += durationInSeconds
            }
        }


        // new User & Returning user
        // Extract unique conversationIds using Set
        let returningUser = 0
        let newUser  = 0
        const uniqueConversationIdList = collect(agentAllTaskList).pluck("_source.sourceData.conversationId").unique().toArray()
        const allExistingTaskIdList = collect(agentAllTaskList).pluck("_id").unique().toArray()
        try {
            let filterConversationListQuery= []
            if (uniqueConversationIdList.length>0){
                for(const item of uniqueConversationIdList){
                    filterConversationListQuery.push(
                        {
                            match_phrase: { 'sourceData.conversationId.keyword': item },
                        }
                    )
                }
            }
            const query = bodybuilder()
                .query('range', 'createdAt', { gte: "2020-01-01", lte: dateFrom })
                .query('terms', 'sourceData.channelId', channelIds)
                .filter('bool', {
                    should: filterConversationListQuery,
                    minimum_should_match: 1,
                })

                .size( this.maxLimit).build()
            const totalTaskResponse:any = await this.client.execQuery(
                this.es_index,
                query
            )

            const oldConversationIdList = collect(totalTaskResponse?.hits?.hits).pluck("_source.sourceData.conversationId").unique().toArray()
            returningUser = oldConversationIdList.length
            const newUserIdList = uniqueConversationIdList.filter(id => !oldConversationIdList.includes(id));
            if(uniqueConversationIdList.length> oldConversationIdList.length){
                newUser = uniqueConversationIdList.length - oldConversationIdList.length
            }else{
                newUser = newUserIdList.length
            }
        } catch
            (e) {
            console.log(e)
        }
        return {
            "total_task":total_task,
            "total_closed_task":total_closed_task,
            "total_partially_closed_task":total_partially_closed_task,
            "total_assigned_task":total_assigned_task,
            "active_assigned_task":(active_assigned_task).toFixed(0),
            "total_pending_task":total_pending_task,
            "total_ice_message":total_ice_message,
            "total_agent_message":total_agent_message,
            "total_consumer_message":total_consumer_message,
            "total_response_rate":total_response_rate.toFixed(2),
            "total_response_time":this.secondsToHHMMSS(total_response_time),
            "total_response_time_avg":this.secondsToHHMMSS((total_response_time/total_closed_task).toFixed(0)),
            "total_handling_time_avg":this.secondsToHHMMSS((total_handling_time/total_closed_task).toFixed(0)),
            "total_handling_time":this.secondsToHHMMSS(total_handling_time),
            "total_waiting_time":this.secondsToHHMMSS(total_waiting_time),
            "totalIceFeedbackMessageY":totalIceFeedbackMessageY,
            "totalIceFeedbackMessageN":totalIceFeedbackMessageN,
            "returningUser":returningUser,
            "newUser":newUser,
        }
    }
    calculateDurationInSeconds(startTime, endTime) {
        const startTimestamp = new Date(startTime).getTime();
        const endTimestamp = new Date(endTime).getTime();
        // console.log(startTimestamp,endTimestamp)
        return Math.floor((endTimestamp - startTimestamp) / 1000);
    }
    secondsToHHMMSS(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }


    async getAssignedAgentTaskList(agentListResult): Promise<any> {

        try {
            const agent_id_list =  collect(agentListResult).pluck("userId").unique().values().toArray()

            const stringArray = agent_id_list.map(item => item.toString());

            const query = bodybuilder()
                .query('terms', 'assignedAgentId', stringArray)
                .notQuery('match', 'taskStatus', 'AgentTaskClosed')
                .query('term', 'assigned', true)
                .query('term', 'assignedTaskIsClosed', false)
                .query('exists', 'sourceData.workspaceId')
                .query('exists', 'sourceData.channelId')
                .query('exists', 'sourceData.conversationId')
                .query('exists', 'sourceData.threadId')
                .query('exists', 'sourceData.messageId')
                .sort('createdAt', 'asc')
                .size(this.maxLimit)
                .build();
            const tasks = await this.client.execQuery(
                this.es_index,
                query
            )
            const assignedTasksDocs = tasks?.hits?.hits || []
            if (assignedTasksDocs.length > 0 ) {
                const finalResult = collect(assignedTasksDocs)
                    .map(task => ({_id: task._id, ...(<object>task._source)}))
                    .toArray()
                const taskCountByAgentId = {};

                finalResult.forEach((task:any) => {
                    const assignedAgentId = task.assignedAgentId;
                    if (taskCountByAgentId[assignedAgentId]) {
                        taskCountByAgentId[assignedAgentId]++;
                    } else {
                        taskCountByAgentId[assignedAgentId] = 1;
                    }
                });

                return agentListResult.map(user => ({
                    ...user,
                    active_task_count: taskCountByAgentId[user.userId] || 0
                }))
            }else{
                return agentListResult.map(user => ({
                    ...user,
                    active_task_count: 0
                }))
            }

        } catch
            (e) {
            return Promise.reject(e)
        }
    }
    // Function to add tasks to conversation_list
    async addTasksToConversations(conversationList, taskList): Promise<any> {
        return conversationList.map((conversation) => {
            const conversationId = conversation._id;
            const matchingTasks = taskList.filter(
                (task) => task.sourceData && task.sourceData.conversationId === conversationId
            );
            return {
                ...conversation,
                tasks: matchingTasks,
            };
        });
    }
    // Function to get the latest task object from a given tasks list
    async getLatestTask(tasksList) {
        if (!Array.isArray(tasksList) || tasksList.length === 0) {
            return null;
        }

        // Sort the tasks based on the "createdAt" field in descending order
        const sortedTasks = tasksList.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

        // Get the latest task (the first task after sorting)
        const latestTask = sortedTasks[0];
        if(latestTask?.assigned){
            return true
        }else{
            return false
        }
    }
    async getLatestTaskState(tasksList) {
        if (!Array.isArray(tasksList) || tasksList.length === 0) {
            return null;
        }

        // Sort the tasks based on the "createdAt" field in descending order
        const sortedTasks = tasksList.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

        // Get the latest task (the first task after sorting)
        const latestTask = sortedTasks[0];
        let taskState = null
        if(latestTask?.assignable){
            taskState = "Assignable"
        }else if (latestTask?.assigned && latestTask?.assignedTaskIsClosed){
            taskState = "Closed"
        }else if (latestTask?.assigned){
            taskState = "Assigned"
        }else if (latestTask?.taskStatus === 'AgentTaskClosed'){
            taskState = "Closed"
        }else{
            taskState = "Other"
        }
        return taskState
    }

    async processConversations(conversationList) {
        const processedConversations = [];

        // Loop through each conversation in the conversation_list
        for (const conversation of conversationList) {
            // Get the latest task object from the tasks list of the current conversation
            const latestTask = await  this.getLatestTask(conversation.tasks);
            const latestTaskState = await  this.getLatestTaskState(conversation.tasks);
            const total_task = conversation?.tasks?.length
            // Create a new conversation object with only the latest task
            const processedConversation = {
                ...conversation,
                total_task:total_task,
                isAssigned: latestTask,
                taskState:latestTaskState
            };
            processedConversations.push(processedConversation);
        }

        return processedConversations;
    }
    async getTaskListByConversationDocIdList(conversationsData): Promise<any> {

        try {
            // getting all conversion tasks
            const conversationDocIdList =  collect(conversationsData).pluck("_id").unique().values().toArray()
            const query = bodybuilder()
                .query('terms', 'sourceData.conversationId.keyword', conversationDocIdList)
                .size(this.maxLimit)
                .build();
            const tasks = await this.client.execQuery(
                this.es_index,
                query
            );
            const allConversationTasks = tasks?.hits?.hits || []
            if (allConversationTasks.length > 0 ) {
                const finalResult = collect(allConversationTasks)
                    .map(task => ({_id: task._id, ...(<object>task._source)}))
                    .toArray()
                // converting task list to state
                const conversationsWithTaskList = await this.addTasksToConversations(conversationsData, finalResult)
                return  await this.processConversations(conversationsWithTaskList);
            }else{
               return conversationsData
            }

        } catch
            (e) {
            return conversationsData
        }
    }


    getAssignableTaskQuery(taskId) {
        return bodybuilder()
            .query('term', 'taskId', taskId)
            .query('term', 'assignable', true)
            .query('term', 'assigned', false)
            .query('term', 'assignedTaskIsClosed', false)
            .query('term', 'taskStatus', 'new')
            .query('exists', 'sourceData.workspaceId')
            .query('exists', 'sourceData.channelId')
            .query('exists', 'sourceData.conversationId')
            .query('exists', 'sourceData.threadId')
            .query('exists', 'sourceData.messageId')
            .sort('createdAt', 'asc')
            .size(1)
            .build();
    }
    async  findAssignableTask(taskId) {
        try {
            const task = await this.client.execQuery(
                this.es_index,
                this.getAssignableTaskQuery(taskId)
            )

            return task?.hits?.hits[0] || null
        }catch (e) {
            return null
        }
    }

    async assignTaskToAnAgent(agentId: number, taskDocId: string): Promise<AgentAssignedTaskDocReadInterface> {
        try {
            const promiseData: AgentAssignedTaskDocReadInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                taskDocId,
                {
                    taskStatus: "assigned",
                    assignable: false,
                    assigned: true,
                    assignedAgentId: agentId,
                    assignedTaskIsClosed: false,
                    assignedTaskIsFullFilled: false,
                    assignedTaskIsVerifiedAndClosed: false,
                    agentNotes: `TaskAssigned`
                }
            )

            return Promise.resolve(promiseData)

        }catch (e) {
            return Promise.reject(e)
        }
    }

    async findAssignableTaskByThreadId(threadId: number) {
        try {
            const query = EsQuery.findAssignableTaskByThreadIdQuery(threadId).build()
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )


            const promiseData = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async findTaskByThreadId(threadId: number) {
        try {
            const query = EsQuery.findTaskByThreadIdQuery(threadId)
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const promiseData = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async closeTheTaskByThreadId(
        threadId: number,
        assignedTaskIsFullFilled: boolean,
        consumerIceFeedbackReceived: boolean,
        consumerForceClosed: boolean = false
    ) {
        try {
            const query = EsQuery.findTaskByThreadIdQuery(threadId)
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const taskDoc : AssignableTaskDocOutputInterface = this.client.getFormattedFirstResult(this.client.getFirstResult(queryResponse))

            const updatableData = {
                taskStatus: 'AgentTaskClosed',
                assignable: false,
                assignedTaskIsClosed: true,
                assignedTaskIsFullFilled: assignedTaskIsFullFilled,
                consumerIceFeedbackReceived: consumerIceFeedbackReceived,
                consumerForceClosed: consumerForceClosed,
                taskEndTimestamp: this.newDate.toISOString(),
                taskDurationSeconds: calculateTaskDurationInSeconds(taskDoc.taskStartTimestamp),
            }

            const promiseData: AgentAssignedTaskDocReadInterface = await this.client.updateAndGetDocumentById(
                this.es_index,
                taskDoc._id,
                updatableData
            )

            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }

	async getTasksByChannelIdList(workspaceId: number, channelIdList: number[]) {
		try {
            const query = bodybuilder()
                .query('term', 'sourceData.workspaceId', workspaceId)
                .query('terms', 'sourceData.channelId', channelIdList)
                .size(100)
                .build();


            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )

            const tasksData: AgentAssignedTaskDocReadInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(tasksData)
        }catch (e) {
            return Promise.reject(e)
        }
	}
    
    async searchTasksByChannelIdList(workspaceId: number, channelIdList: String[], taskId: number|string) {
		try {
            const query = bodybuilder()
                .filter('match', 'sourceData.threadId', taskId+"")
                .query('term', 'sourceData.workspaceId', workspaceId+"")
                .query('terms', 'sourceData.channelId', channelIdList)
                // .filter('term', 'sourceData.threadId', "275")
                // .query('term', 'sourceData.workspaceId', "2")
                // .query('terms', 'sourceData.channelId', ["4"])
                .size(10)
                .build();

            debugLog('&#^', JSON.stringify(query,null,4))
            const queryResponse = await this.client.execQuery(
                this.es_index,
                query
            )
            
            const tasksData: AgentAssignedTaskDocReadInterface[] = this.client.getFormattedDocResults(queryResponse)

            return Promise.resolve(tasksData)
        }catch (e) {
            return Promise.reject(e)
        }
	}
}

