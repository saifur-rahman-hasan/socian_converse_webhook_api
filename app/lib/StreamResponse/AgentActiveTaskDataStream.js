// Custom Readable stream that emits the agent queue tasks data
import {Readable} from "stream";
import AgentActiveTask from "../AgentActiveTask/ActiveTask";

export default class AgentActiveTaskDataStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
		this.workspaceId = parseInt(data.workspaceId)
		this.agentId = parseInt(data.agentId)
	}

	async _read() {
		
		const getActiveTask = new AgentActiveTask(this.workspaceId,this.agentId)
		const activeTask = await getActiveTask.getAgentActiveTask();

		const agentActiveTaskData = {
			loading: false,
			error: null,
			loaded: true,
			enabled: true,
			data: activeTask
		};

		this.push(JSON.stringify({ agentActiveTask: agentActiveTaskData }));
		this.push(null); // End the stream
	}
}