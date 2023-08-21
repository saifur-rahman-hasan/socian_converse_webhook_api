// Custom Readable stream that emits the agent online status
import {Readable} from "stream";

export default class AgentOnlineStatusStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
	}

	_read() {
		const agentOnlineStatus = {
			loading: false,
			error: null,
			loaded: true,
			data: {
				online: true
			}
		};

		this.push(JSON.stringify({ agentOnlineStatus }));
		this.push(null); // End the stream
	}
}