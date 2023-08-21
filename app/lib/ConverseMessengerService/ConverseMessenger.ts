import MessengerConversation from "@/lib/ConverseMessengerService/MessengerConversation";
import MessengerWorkspace from "@/lib/ConverseMessengerService/MessengerWorkspace";
import MessengerChannel from "@/lib/ConverseMessengerService/MessengerChannel";

class ConverseMessenger {
    public _authId: number;
    public _workspaceId: number;
    public _channelId?: number;
    public _channelUId?: string;

    public workspace: MessengerWorkspace;
    public channel: MessengerChannel | undefined;
    public conversation: MessengerConversation;

    constructor(authId: number, workspaceId: number, channelId?: number) {
        this._authId = authId;
        this._workspaceId = workspaceId;
        this._channelId = channelId || undefined;

        this.workspace = new MessengerWorkspace(this);
        this.conversation = new MessengerConversation(this);

        if (channelId) {
            this.channel = new MessengerChannel(channelId);
            this._channelUId = this.channel.getChannelUId()
        }
    }

    setChannelId(channelId: number | undefined): ConverseMessenger {
        if (channelId) {
            this._channelId = channelId;
            this.channel = new MessengerChannel(channelId);
        } else {
            this._channelId = undefined
            this.channel = undefined;
        }
        return this;
    }
}

export default ConverseMessenger;
