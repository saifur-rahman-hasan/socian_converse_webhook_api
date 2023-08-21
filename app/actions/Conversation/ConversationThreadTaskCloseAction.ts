import BaseAction from "@/actions/BaseAction";
import {debugLog} from "@/utils/helperFunctions";

export default class ConversationThreadTaskCloseAction extends BaseAction {
	async execute() {
		try {

			return Promise.resolve({})

		}catch (e) {
			debugLog('ConversationThreadTaskCloseAction Error: ', e.message)

			return Promise.reject(e)
		}
	}
}