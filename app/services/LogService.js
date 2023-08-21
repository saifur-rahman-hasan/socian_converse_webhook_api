import { Client } from '@elastic/elasticsearch';
import { v4 as uuidv4 } from 'uuid';

class LogService {
	constructor() {
		this.elasticsearchNode = process.env.ELASTICSEARCH_NODE || 'https://elastic:f$iI8T14AF6Vox2L^M2H4@mybuzz.socian.ai:5000';
		this.indexName = 'socian_converse_logs';
	}

	sendLog(logData) {
		const { message, logLevel, source, request, userContext, applicationContext } = logData;
		const timestamp = new Date().toISOString();
		const logId = uuidv4();

		return new Promise((resolve, reject) => {
			const client = new Client({ node: this.elasticsearchNode });

			client
				.index({
					index: this.indexName,
					id: logId,
					body: {
						message,
						timestamp,
						logLevel,
						source,
						request,
						userContext,
						applicationContext,
					},
				})
				.then(() => {
					resolve({ success: true, message: 'Log sent successfully!' });
				})
				.catch(error => {
					console.error('Failed to send log:', error);
					reject({ success: false, error: 'Failed to send log' });
				});
		});
	}
}

export default LogService;
