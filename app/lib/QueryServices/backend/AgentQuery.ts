import prisma from "@/lib/prisma";
import collect from "collect.js";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import {AgentActivityLogQuery} from "@/lib/QueryServices/elasticsearch/AgentActivityLogQuery";
import UserQuery from "@/lib/QueryServices/backend/UserQuery";

export default class AgentQuery {
    private userQuery: UserQuery;
    constructor() {
        this.userQuery = new UserQuery()
    }
    async getWorkspaceId(workspaceId){
        try {
            const result = await prisma.workspace.findMany({
                where: {
                    id:workspaceId
                },
                include: {
                    teams: {
                        select: {
                            members: {
                                where:{
                                    role:'Agent',
                                },
                                include:{
                                    user:true,
                                }
                            },
                        }
                    },
                },
            })

            const finalResult:any = collect(result).pluck("teams").collapse().pluck("members").collapse().all()
            return Promise.resolve(finalResult)
        }catch (e) {
            return Promise.reject(e)
        }
    }

    async getAvailableAgents(workspaceId) {
        try {
            const finalResult:any = await this.getWorkspaceId(workspaceId)
            // return finalResult
            let available_users = [];
            for (const item of finalResult) {
                const activityState = new AgentActivityLogQuery(workspaceId, item?.userId);
                const data = await activityState.getAvailityStatus(workspaceId, item?.userId, ['available', 'unavailable', 'break']);
                if (data) {
                    available_users.push(data);
                }
            }
            const availableAgentIds = available_users.map(activity => activity._source.agentId);
            const filteredUserList = finalResult.filter(user => availableAgentIds.includes(user.userId));

            // Join data from available_users into filteredUserList
            const finalList = filteredUserList.map(user => {
                const availableUserData = available_users.find(activity => activity._source.agentId === user.userId);
                if (availableUserData) {
                    user.availability = availableUserData._source.availability;
                    user.activityType = availableUserData._source.activityType;
                    user.activityType = availableUserData._source.activityData;
                }
                return user;
            });
            const taskQuery = new TaskQuery();
            return  await taskQuery.getAssignedAgentTaskList(finalList)
        } catch (err) {
            console.log("Error", err.toString())
            throw new Error("Invalid Thread object")
        }
    }

    async findAgentById(agentId: number) {
        try {
            const promiseData = await this.userQuery.findUserById(agentId)
            return Promise.resolve(promiseData)
        }catch (e) {
            return Promise.reject(e)
        }
    }
}

// , active_task_count: activeTaskCount
