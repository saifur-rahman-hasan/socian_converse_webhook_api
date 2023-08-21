// Custom Readable stream that emits the agent info
import {Readable} from "stream";

export default class AgentChannelsDataStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
	}

	_read() {
		const agentChannelsData = {
			loading: false,
			error: null,
			loaded: true,
			data: []
		}

		this.push(JSON.stringify({ agentChannels: agentChannelsData }));
		this.push(null); // End the stream
	}
}