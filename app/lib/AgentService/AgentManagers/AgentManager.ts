import AgentTaskManager from "@/lib/AgentService/AgentManagers/AgentTaskManager";
import AgentObject from "@/lib/AgentService/AgentObjects/AgentObject";

export default class AgentManager {
    private agentId: number;
    private status: string;
    private taskManager: AgentTaskManager;

    constructor(agentId: number) {
        this.agentId = agentId;
        this.status = 'unavailable';
        this.taskManager = new AgentTaskManager(agentId);
    }

    setStatus(status: string): void {
        this.status = status;
    }

    isAvailableToDoWork(): boolean {
        return this.status === 'working';
    }

    getTaskManager(): AgentTaskManager {
        return this.taskManager;
    }
}