import AgentManager from "@/lib/AgentService/AgentManagers/AgentManager";

export default class AgentService {
    private agentId: number;
    private loggedIn: boolean;
    private agent: AgentManager | null;

    constructor(authId: number) {
        this.agentId = authId;
        this.agent = null;
        this.loggedIn = false;
    }

    async login(): Promise<boolean> {
        this.loggedIn = true
        return this.loggedIn
    }

    async getAgentManager(): Promise<AgentManager | null> {
        if (this.loggedIn) {
            if (!this.agent) {
                this.agent = new AgentManager(this.agentId);
            }
            return this.agent;
        }
        return null;
    }
}







