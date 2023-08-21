// Custom Readable stream that emits the agent info
import {Readable} from "stream";
import prisma from "@/lib/prisma";

export default class AgentInfoStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
	}

	async _read() {

		if(!this.data?.agentId){
			this.push(JSON.stringify({ agent: {} }));
			this.push(null);
			return;
		}

		const agentId = parseInt(this.data.agentId)
		const user = await prisma.user.findFirst({
			where: { id: agentId }
		})

		if(!user){
			this.push(JSON.stringify({ agent: {} }));
			this.push(null);
			return;
		}

		const agentInfo = {
			loading: false,
			error: null,
			loaded: true,
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				image: null
			}
		}

		this.push(JSON.stringify({ agent: agentInfo }));
		this.push(null); // End the stream
	}
}