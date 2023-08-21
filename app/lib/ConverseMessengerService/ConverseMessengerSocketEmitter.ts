import {socket} from "@/socket/socket";
import {AgentAssignedTaskDocReadInterface} from "@/actions/interface/AgentInterface";
import {debugLog} from "@/utils/helperFunctions";

class ConverseMessengerSocketEmitter {
    private workspaceId: number;
    private channelId: number;
    private socket: typeof socket;
    private socketEventPrefix = ''

    constructor(workspaceId: number, channelId: number) {
        this.workspaceId = workspaceId;
        this.channelId = channelId;
        this.socket = socket

        const messengerInstanceId = `${workspaceId}_${channelId}`
        this.socketEventPrefix = `__converseMessenger__${messengerInstanceId}__`
    }

    userJoined(user) {
        const eventType = this.socketEventPrefix + `user:joined`
        this.socket.emit(eventType, user);
    }

    userLeave() {
        const eventType = this.socketEventPrefix + `user:leave`
        this.socket.emit(eventType);
    }

    conversationAdded(conversation) {
        this.conversationUpdated(conversation)
    }

    conversationUpdated(conversation) {
        const eventPrivateKey = this.socketEventPrefix + `conversation:updated`

        socket
            .connect()
            .emit('conversation:updated', {
                socket: { eventPrivateKey },
                data: conversation
            })
    }

    conversationRemoved(conversationId) {
        const eventType = this.socketEventPrefix + `conversation:removed`
        this.socket.emit(eventType, conversationId);
    }

    messageAdded(message) {
        this.messageUpdated(message)
    }

    messageUpdated(message) {
        const { conversationId } = message
        const eventPrivateKey = this.socketEventPrefix + `${conversationId}__` + `message:updated`

        socket
            .connect()
            .emit('message:updated', {
                socket: { eventPrivateKey },
                data: message
            })
    }

    messageRemoved(messageId) {
        const eventType = this.socketEventPrefix + `message:removed`
        this.socket.emit(eventType, messageId);
    }

    messageSent(message) {
        const eventType = this.socketEventPrefix + `message:sent`
        this.socket.emit(eventType, message);
    }

    messageReceived(message) {
        const eventType = this.socketEventPrefix + `message:received`
        this.socket.emit(eventType, message);
    }

    messageTyping() {
        const eventType = this.socketEventPrefix + `message:typing`
        this.socket.emit('typing');
    }

    messageRead(messageId) {
        const eventType = this.socketEventPrefix + `message:read`
        this.socket.emit(eventType, messageId);
    }

    threadAdded(thread) {
        const eventType = this.socketEventPrefix + `thread:added`
        this.socket.emit(eventType, thread);
    }

    threadUpdated(thread) {
        const eventType = this.socketEventPrefix + `thread:updated`
        this.socket.emit(eventType, thread);
    }

    threadRemoved(threadId) {
        const eventType = this.socketEventPrefix + `thread:removed`
        this.socket.emit(eventType, threadId);
    }

    participantAdded(participant) {
        const eventType = this.socketEventPrefix + `participant:added`
        this.socket.emit(eventType, participant);
    }

    participantUpdated(participant) {
        const eventType = this.socketEventPrefix + `participant:updated`
        this.socket.emit(eventType, participant);
    }

    participantRemoved(participantId) {
        const eventType = this.socketEventPrefix + `participant:removed`
        this.socket.emit(eventType, participantId);
    }

    channelAdded(channel) {
        const eventType = this.socketEventPrefix + `channel:added`
        this.socket.emit(eventType, channel);
    }

    channelUpdated(channel) {
        const eventType = this.socketEventPrefix + `channel:updated`
        this.socket.emit(eventType, channel);
    }

    channelRemoved(channelId) {
        const eventType = this.socketEventPrefix + `channel:removed`
        this.socket.emit(eventType, channelId);
    }

    agentTaskAssigned(agentTask) {
        const messengerInstanceId = `${this.workspaceId}_${agentTask.assignedAgentId}`
        this.socketEventPrefix = `__converseMessenger__${messengerInstanceId}__`

        // __converseMessenger__{workspaceId}_{agentId}__agent:task:assinged
        const eventPrivateKey = this.socketEventPrefix + `agent:task:assigned`
        debugLog('eventPrivateKey', eventPrivateKey)
        socket
            .connect()
            .emit('agent:task:assigned', {
                socket: { eventPrivateKey },
                data: agentTask
            })
    }

    agentTaskClosed(agentTask: AgentAssignedTaskDocReadInterface) {

        // __converseMessenger__{workspaceId}_{agentId}_{threadId}__
        const messengerInstanceId = `${this.workspaceId}_${agentTask?.assignedAgentId}_${agentTask?.taskId}`
        this.socketEventPrefix = `__converseMessenger__${messengerInstanceId}__`

        const eventPrivateKey = this.socketEventPrefix + `agent:task:closed`

        socket
            .connect()
            .emit('agent:task:closed', {
                socket: { eventPrivateKey },
                data: agentTask
            })
    }
}


export default ConverseMessengerSocketEmitter