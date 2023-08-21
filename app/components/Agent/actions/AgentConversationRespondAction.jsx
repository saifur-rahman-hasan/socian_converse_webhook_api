import {PaperAirplaneIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {useRouter} from "next/router";
import useMessengerQueryParams from "@/hooks/useMessengerQueryParams";

export default function AgentConversationRespondAction(){
	const {
		workspaceId,
		channelId,
		conversationId,
		threadId
	} = useMessengerQueryParams()

	return (
		<Link
			href={{
				pathname: `/workspaces/[workspaceId]/converse/`,
				query: {
					workspaceId,
					channelId,
					conversationId,
					threadId,
					activityTab: 'chat'
				}
			}}
			className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
		>
			<span>Replay</span>

			<PaperAirplaneIcon
				className="ml-2 h-5 w-5 text-green-500"
				aria-hidden="true"
			/>
		</Link>
	)
}