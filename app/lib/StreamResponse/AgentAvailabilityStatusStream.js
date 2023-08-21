// Custom Readable stream that emits the agent availability status
import {Readable} from "stream";
import ElasticsearchDBAdapter from "@/lib/ConverseMessengerService/ElasticsearchDBAdapter";
import bodybuilder from "bodybuilder";

const AGENT_ACTIVITY_LOG_INDEX = "__agent_activity"
const elasticDbAdapter= new ElasticsearchDBAdapter()
export default class AgentAvailabilityStatusStream extends Readable {
	constructor(data) {
		super({ objectMode: true });
		this.data = data;
		this.agentId = parseInt(data?.agentId || 0)
		this.workspaceId = parseInt(data?.workspaceId || 0)
		this.activityType = 'availability_status'
	}

	async _read() {

		const activityDocResponse = await elasticDbAdapter.execQuery(
			AGENT_ACTIVITY_LOG_INDEX,
			this.getAgentCurrentAvailabilityStatusQuery(
				this.workspaceId,
				this.agentId
			)
		)


		const latestActivityDoc = activityDocResponse?.hits?.hits[0] || {}
		const agentAvailabilityStatusDocData = {
			_id: latestActivityDoc?._id,
			...latestActivityDoc?._source
		} || {}

		const openCommandModal = agentAvailabilityStatusDocData?.activityData?.status !== 'available'

		const agentAvailabilityStatusData = {
			loading: false,
			error: null,
			loaded: true,
			open_command_modal: openCommandModal,
			data: agentAvailabilityStatusDocData?.activityData
		}

		this.push(JSON.stringify({ agentAvailabilityStatus: agentAvailabilityStatusData }));
		this.push(null); // End the stream
	}


	// Function to build the Elasticsearch query
	getAgentCurrentAvailabilityStatusQuery(workspaceId, agentId, activityType = ['available', 'unavailable', 'break']) {
		// Set the range of the activityTime field to today
		const dateToday = new Date().toISOString().slice(0, 10);
		const query = bodybuilder();
		const size = 1

		// Add the query conditions
		query.query('match', 'workspaceId', workspaceId);
		query.query('match', 'agentId', agentId);
		query.query('match', 'activityGroup', 'availability_status');
		query.query('terms', 'activityType', activityType);
		query.query('match', 'activityState', 'start');

		// Set the range of the activityTime field to today
		query.filter('range', 'activityTime', { gte: dateToday, lte: dateToday });

		// Add sorting to get the latest result first
		query.sort('activityTime', 'desc');

		// Set the size to get the desired number of results (default is 1)
		query.size(size);

		return query.build();
	}


}