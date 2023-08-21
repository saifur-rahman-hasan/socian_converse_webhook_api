// Custom Readable stream that emits the agent roles and permissions
import {Readable} from "stream";
import UserACLManager from "../UserACLManager/UserACLManager";

export default class AgentAuthorizationDataStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
		this.agentId = parseInt(data?.agentId || 0)
		this.workspaceId = parseInt(data?.workspaceId || 0)
	}

	async _read() {
		if(!this.agentId){
			this.push(JSON.stringify({ agentAuthorization: {} }));
			this.push(null); // End the stream
			return
		}

		const aclManager = new UserACLManager(this.agentId)
		const {roles, permissions} = await aclManager.getUserAllRolesAndPermissions()
		const getAgentPermissions = await aclManager.getPermissionsForModel("User",2)
		let agentRolesAndPermissionsData = {roles, permissions};

		const agentRolesPermissions = {
			loading: false,
			error: null,
			loaded: true,
			data: agentRolesAndPermissionsData
		};

		this.push(JSON.stringify({ agentAuthorization: agentRolesPermissions }));
		this.push(null); // End the stream
	}
}