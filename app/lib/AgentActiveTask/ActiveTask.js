import prisma from "@/lib/prisma";
import moment from "moment-timezone";
import collect from "collect.js";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";

class AgentActiveTask {
    constructor(workspaceId,agentId,taskDocId,taskStatus) {
        this.workspaceId = parseInt(workspaceId);
        this.agentId = parseInt(agentId);
        this.taskDocId = taskDocId ? taskDocId : '';
        this.taskStatus = taskStatus ? taskStatus : 'start';
        this.aggentTaskId = null
        this.messengerConversionConsumer = null
        this.timeZone = 'Asia/Dhaka';
        this.currentTime = moment().tz(this.timeZone).toISOString();
    }
  
    async getAgentActiveTask() {
        const activeTaskFindQuery = {
            agentId: this.agentId,
            workspaceId: this.workspaceId,
            status: 'start',
        }
        
        const agentActiveTask = await this.findAgentTask(activeTaskFindQuery)

        if(!agentActiveTask){
            return "Active Task Not Found!"
        }else{
            const activeTaskDuration = await this.calculateDuration(agentActiveTask?.startAt);
            
            if(agentActiveTask?.taskDocId){
                this.taskDocId = agentActiveTask?.taskDocId;
                await this.getAgentDataFromES();
                agentActiveTask['duration'] = activeTaskDuration;
                agentActiveTask['threadId'] = this.aggentTaskId;
                agentActiveTask['consumer'] = this.messengerConversionConsumer;
            }
            
            return agentActiveTask;
        }
    }

    async startAgentActiveTask() {

        if(this.taskDocId){
            // GET aggentTaskId,messengerConversionConsumer from Elastic Search.
            await this.getAgentDataFromES();
        }
        
        const shouldCheckStatus = this.taskDocId ? '' : 'start';
        
        const activeTaskFindQuery = collect({
            agentId: this.agentId,
            workspaceId: this.workspaceId,
            taskDocId: this.taskDocId,
            status: shouldCheckStatus
        }).filter().all()

        const agentActiveTask = await this.findAgentTask(activeTaskFindQuery)
        
        if(agentActiveTask){
            // Stop Active Task.
            this.hasAnyActiveTask(activeTaskFindQuery)	

            const updateAgentActiveTask = await this.agentUpdate({status: 'start',},agentActiveTask?.id)
            
            const activeTaskDuration = await this.calculateDuration(updateAgentActiveTask?.startAt);

            return {
                id:agentActiveTask?.id,
                workspaceId: this.workspaceId,
                agentId: this.agentId,
                taskDocId: this.taskDocId,
                threadId: this.aggentTaskId,
                consumer: this.messengerConversionConsumer,
                startAt: updateAgentActiveTask?.startAt,
                duration: activeTaskDuration,
                status: this.taskStatus,
            }
        }
        
        const createAgentActiveTask = await prisma.AgentActiveTask.create({
            data: {
                agent: { connect: { id: this.agentId } },
                taskDocId: this.taskDocId,
                workspace: { connect: { id: this.workspaceId } },
                startAt: this.currentTime,
                duration: 0,
                status: this.taskStatus,
            }
        })

        return {
            id:createAgentActiveTask?.id,
            workspaceId: this.workspaceId,
            agentId: this.agentId,
            taskDocId: this.taskDocId,
            threadId: this.aggentTaskId,
            consumer: this.messengerConversionConsumer,
            startAt: createAgentActiveTask?.startAt,
            duration: 0,
            status: this.taskStatus,
        }
    }

    async pauseAgentActiveTask() {
        
        const activeTaskFindQuery ={
            agentId: this.agentId,
            workspaceId: this.workspaceId,
            status: 'start',
        }
        const agentActiveTask = await this.findAgentTask(activeTaskFindQuery)

        if(!agentActiveTask){
            return "Active Task Not Found!"
        }else{
            const updateAgentActiveTask = await this.agentUpdate({status: 'pause',},agentActiveTask.id)
            return updateAgentActiveTask;
        }
    }

    async stopAgentActiveTask() {

        const activeTaskFindQuery ={
            agentId: this.agentId,
            workspaceId: this.workspaceId,
            OR: [
                { status: 'start' },
                { status: 'pause' },
            ],
        }

        const agentActiveTask = await this.findAgentTask(activeTaskFindQuery)

        if(!agentActiveTask){
            return "Active Task Not Found!"
        }else{
            const durationSeconds = await this.calculateDuration(agentActiveTask?.startAt) 
            const updateAgentActiveTask = await this.agentUpdate({status: 'stop',duration: durationSeconds,endAt: this.currentTime,},agentActiveTask.id)
            
            return updateAgentActiveTask;
        }
    }
    
    async getAgentDataFromES() {

        const elasticsearchDBAdapter = new ElasticsearchDBAdapter('socian_converse')
        const AGENT_TASKS_INDEX = '__agent_tasks'
        const MESSENGER_CONVERSION_INDEX = '__messenger_conversations'
        try {
            const assignedTasks = await elasticsearchDBAdapter.findDocumentById(
                AGENT_TASKS_INDEX,
                this.taskDocId
            )

            const assignedTasksConversionId = assignedTasks?._source?.sourceData?.conversationId || ""
            this.aggentTaskId = assignedTasks?._source?.taskId || ""
            
            const messengerConversion = await elasticsearchDBAdapter.findDocumentById(
                MESSENGER_CONVERSION_INDEX,
                assignedTasksConversionId
            )
                
            
            const messengerConversionParticipants = messengerConversion?._source?.participants;
            this.messengerConversionConsumer = messengerConversionParticipants.find(item => item.role === 'consumer');
            return this.messengerConversionConsumer
        }catch(e){
            console.log(e);
        }
    }
  
    async agentUpdate(data,agentId){
        return await prisma.AgentActiveTask.update({
            where:{
                id:agentId
            },
            data: data
        })
    }
    
    async findAgentTask(activeTaskFindQuery) {
        const agentActiveTask = await prisma.AgentActiveTask.findFirst({
            where: activeTaskFindQuery
        })
        return agentActiveTask;
    }

    async hasAnyActiveTask(activeTaskFindQuery){

        activeTaskFindQuery['status'] = 'start'
        
        const activeTask = await this.findAgentTask(activeTaskFindQuery);
    
        if(activeTask){
            const activeTaskDuration = await this.calculateDuration(activeTask?.startAt);
            this.agentUpdate({ status: 'stop', duration: activeTaskDuration, endAt: this.currentTime },activeTask?.id)
        }
    }

    async calculateDuration(startAt) {
        const taskStartAt = new Date(startAt);
        const convertCurrentTime = new Date(this.currentTime);

        // Calculate the duration in milliseconds
        const durationMs = convertCurrentTime.getTime() - taskStartAt.getTime();

        // Convert the duration to seconds
        const durationSeconds = durationMs > 0 ? Math.floor(durationMs / 1000) : 0;
        
        return durationSeconds;
    }
}

export default AgentActiveTask;