// Custom Readable stream that emits the agent queue tasks data
import {Readable} from "stream";

export default class AgentQueueTasksDataStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
		this.agentId = data.agentId
	}

	async _read() {

		const agentQueueTasksData = {
			loading: false,
			error: null,
			loaded: true,
			data: [
				{
					id: 1,
					subject: 'Internet Connection Problem',
					sender: 'Gloria Roberston',
					href: '/agent/dashboard/myTasks/previewTask',
					date: '1d ago',
					datetime: '2021-01-27T16:35',
					preview:
						'Hello I am facing internet connection problem.',
				}
			]
		};

		this.push(JSON.stringify({ agentQueueTasks: agentQueueTasksData }));
		this.push(null); // End the stream
	}
}