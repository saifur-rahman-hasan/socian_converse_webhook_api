import BaseAction from "@/actions/BaseAction";
import ConverseAgentActivities from "@/lib/ConverseMessengerService/ConverseAgentActivities";
import {generateTimestamp} from "@/utils/helperFunctions";

export default class AgentAvailabilityStatusUpdatedAction extends BaseAction {
    private workspaceId: number;
    private agentId: number;

    constructor(workspaceId: number, agentId: number) {
        super()

        this.workspaceId = workspaceId || null
        this.agentId = agentId || null
    }

    async execute(data: any) {
        try {
            const reqData = data

            let resData = this.setStatus(data.status)


        }catch (e) {
            
        }
    }

    async createActivity(): Promise<any> {
        try {

            const activitiesInstance = new ConverseAgentActivities(
                this.agentId,
                this.workspaceId,
                null,
                null,
                null,
                "availability_status",
                'available',
                null,
                null,
                'start',
                {
                    availabilityStatus: 'available',
                    time: generateTimestamp()
                }
            )

            const response = await activitiesInstance.createConversation()

        }catch (e) {

        }
    }

    private async setStatus(status) {
        try {
            switch (status) {
                case 'available':
                    return await (new ConverseAgentActivities(this.agentId, this.workspaceId, null, null, null, "availability_status", 'available', null, null, 'start', { availabilityStatus: 'available', time: generateTimestamp() })).createActivity()

                case 'unavailable':
                    return await (new ConverseAgentActivities(this.agentId, this.workspaceId, null, null, null, "availability_status", 'available', null, null, 'start', { availabilityStatus: 'available', time: generateTimestamp() })).createActivity()

                case 'break':
                    return await (new ConverseAgentActivities(this.agentId, this.workspaceId, null, null, null, "availability_status", 'available', null, null, 'start', { availabilityStatus: 'available', time: generateTimestamp() })).createActivity()

                default:
                    return null
            }

        }catch (e) {

        }
    }
}