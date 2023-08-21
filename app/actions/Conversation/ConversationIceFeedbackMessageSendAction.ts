import BaseAction from "@/actions/BaseAction";

interface ActionOptionInterface {
    conversationId: string,
    vendor?: string
}

export default class ConversationIceFeedbackMessageSendAction extends BaseAction {
    constructor(options: ActionOptionInterface) {
        super();
    }

    async execute(data: any) {
        try {
            // Create a new M



            // Your action Resolved Data
            this.setVirtualData('conversations', [])
            this.setVirtualData('messages', [])
            this.setVirtualData('participants', [])

            const promiseData = this.getActionResolvedData()
            return Promise.resolve(promiseData)
        }catch (e) {
            this.setActionErrorReject(e)
            return Promise.reject(e)
        }
    }
}