import {throwIf} from "@/lib/ErrorHandler";
import BaseAction from "@/actions/BaseAction";
import UserQuery from "@/lib/QueryServices/backend/UserQuery";
import ThreadQuery from "@/lib/QueryServices/backend/ThreadQuery";
import TaskQuery from "@/lib/QueryServices/elasticsearch/TaskQuery";
import ConversationQuery from "@/lib/QueryServices/elasticsearch/ConversationQuery";
import {AgentAssignTaskActionParamInterface} from "@/actions/interface/AgentInterface";
import {ConversationThreadOutputInterface} from "@/actions/interface/ConversationInterface";
import ConverseMessengerSocketEmitter from "@/lib/ConverseMessengerService/ConverseMessengerSocketEmitter";
import {debugLog} from "@/utils/helperFunctions";

export default class AssignAgentTaskAction extends BaseAction {
    private _inputData: any;
    private _agentId: number;
    private _threadId: number;
    private userQuery: UserQuery;
    private threadQuery: ThreadQuery;
    private taskQuery: TaskQuery;
    private conversationQuery: ConversationQuery;

    constructor(params: AgentAssignTaskActionParamInterface) {
        super();
        
        this._inputData = null
        this._agentId = params.agentId
        this._threadId = params.threadId
        
        this.userQuery = new UserQuery
        this.threadQuery = new ThreadQuery
        this.taskQuery = new TaskQuery
        this.conversationQuery = new ConversationQuery
    }

    async execute() {
        try {
            /**
             * TODO: Main Task: AssignAgentTask
             *  A supervisor or ConverseAutoTaskDistributorService can assign only assignable new task to an Agent.
             *  In this action we have to do some business logic operations
             */

            /**
             * TODO: Find the Agent
             */
            const agent = await this.userQuery.findUserById(this._agentId)
            throwIf(!agent?.id, new Error("Invalid Agent Object"))

            /**
             * TODO: Find the Task & Thread & Conversation
             */
            const thread: ConversationThreadOutputInterface = await this.threadQuery.findThreadById(this._threadId)
            throwIf(!thread.id, new Error("Invalid Thread Object"))

            debugLog(`thread`, thread)
            const task = await this.taskQuery.findAssignableTaskByThreadId(this._threadId)
            debugLog(`task`, task)
            throwIf(!task?._id, new Error("Sorry! This task is not assignable"))

            const conversation = await this.conversationQuery.findConversationById(thread.conversationId)
            throwIf(!conversation?._id, new Error("Invalid Conversation Doc Object"))

            const {workspaceId, channelId} = conversation

            const assignedTask = await this
                .taskQuery
                .assignTaskToAnAgent(this._agentId, task._id)

            throwIf(!assignedTask, new Error("Invalid Assigned task object"))

            /**
             * TODO: 6: Dispatch Socket Event about
             *      - AgentTaskAssigned
             *      - UpdateConversation
             */
            this.dispatchEvents(workspaceId, channelId, assignedTask)

            /**
             * TODO: 7: Set the necessary information to your virtual data store.
             *      This will be the action resolved data
             */

            // Your action Resolved Data
            this.setVirtualData('assignedTask', assignedTask)

            const promiseData = this.getActionResolvedData()
            return Promise.resolve(promiseData)
        }catch (e) {
            console.log('Assign Agent Task Action Error')
            console.log(e)
            this.setActionErrorReject(e)
            return Promise.reject(e)
        }
    }

    private dispatchEvents(workspaceId: number, channelId: number, assignedTask) {
        const socketEmitter = new ConverseMessengerSocketEmitter(
            workspaceId,
            channelId
        )

        socketEmitter.agentTaskAssigned(assignedTask)

    }
}