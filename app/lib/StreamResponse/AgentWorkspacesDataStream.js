// Custom Readable stream that emits the agent info
import {Readable} from "stream";

export default class AgentWorkspacesDataStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
	}


	_read() {
		console.log(`streaming on: ${this.constructor.name}`);
		const agentWorkspaces = {
			loading: false,
			error: null,
			loaded: true,
			data: [
				{
					id: 1, name: 'Workspace One'
				}
			]
		}

		this.push(JSON.stringify({ agentWorkspaces }));
		this.push(null); // End the stream

		console.log(`streaming finished: ${this.constructor.name}`);
	}
}