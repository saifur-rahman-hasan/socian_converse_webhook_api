import DefaultGravatar from "@/components/DefaultGravatar";
import {CheckCircleIcon} from "@heroicons/react/24/outline";
import {ChatBubbleLeftIcon, ClockIcon} from "@heroicons/react/24/solid";
import Badge from "@/components/ui/Badge";
import ChannelIcon from "@/components/Converse/ConverseMessengerApp/ChannelIcon";

function ThreadIdBadge({ threadId, color = 'green' }) {
    return (
        <Badge
            color={color}
            text={`Thread ID: #${threadId}`}
        />
    );
}

function ThreadChannelNameWithIcon({ channelType, channelName }) {
    return (
        <div className={`flex items-center gap-x-2`}>
            <ChannelIcon channelType={channelType}  />
            <span>{channelName}</span>
        </div>
    );
}


export default function ConversationSingleThreadCardItem({ thread }){
    const { channel, conversation } = thread

    return (
        <div className="flex justify-between gap-x-6 gap-y-4 py-5">
            <div className={`w-10`}>
                <DefaultGravatar className={`h-10 w-10`} />
            </div>

            <div className={`flex-grow`}>
                <div className="text-md font-bold leading-6 text-gray-900">
                    <h1 className="hover:underline" >
                        {thread.author?.name}
                    </h1>
                </div>

                <div className={`mt-2`}>
                    <ul className={`flex items-center gap-x-4 text-xs leading-5 text-gray-500`}>

                        <li>
                            <ThreadChannelNameWithIcon
                                channelName={channel?.channelName}
                                channelType={channel?.channelType}
                            />
                        </li>

                        <li className={`inline-flex items-center gap-x-2`}>
                            <ClockIcon className={`w-5 h-5`} />
                        </li>

                    </ul>
                </div>
            </div>

            <div className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
                <div className="flex -space-x-0.5">
                    <dt className="sr-only">Participants</dt>

                    { conversation?.participants?.length > 0 && conversation?.participants.map(participant => (
                        <dd key={`conversation_participant_key_${participant?.id}`}>
                            <DefaultGravatar className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white" />
                        </dd>
                    ))}


                </div>
                <div className="flex w-16 gap-x-2.5">
                    <dt>
                        <span className="sr-only">Total comments</span>
                        {thread?.status === 'resolved' ? (
                            <CheckCircleIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        ) : (
                            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        )}
                    </dt>

                    <dd className="text-sm leading-6 text-gray-900">{thread?.messageCount || 0}</dd>
                </div>
            </div>
        </div>
    )
}