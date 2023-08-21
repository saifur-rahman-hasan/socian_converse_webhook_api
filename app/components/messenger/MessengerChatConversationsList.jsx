"use client"

import MessengerChatConversationsListItem from "@/components/Converse/ConverseMessengerApp/MessengerChatConversationsListItem";
import {useGetConversationsQuery} from "@/store/features/messenger/MessengerAPISlice";
import InfiniteScroll from "react-infinite-scroller";
import {useState} from "react";
import {debugLog} from "@/utils/helperFunctions";
import ListSkeleton from "@/components/ui/Skeleton/ListSkeleton";
import AlertError from "@/components/ui/alerts/AlertError";
import EmptyStates from "@/components/ui/EmptyStates";

export default function MessengerChatConversationsList({ workspaceId, channelId }) {
	const [sizeLimit, setSizeLimit] = useState(1000)

	if(!workspaceId || !channelId){
		return null
	}

	const {
		data: conversationsData,
		isSuccess: conversationsDataFetchSuccess,
		isLoading: conversationsIsLoading,
		isFetching: conversationsIsFetching,
		error: conversationsFetchError,
		refetch: conversationsDataRefetch
	} = useGetConversationsQuery({
		workspaceId,
		channelId,
		from:0,
		size: sizeLimit
	}, {
		skip: workspaceId < 1 || channelId?.id < 1
	})


	const loadFunc = (page) => {
		debugLog(`page`, page)
	}

	return (
		<nav aria-label="Directory">

			{/* Directory list */}
			{ conversationsIsLoading || conversationsIsFetching && (<ListSkeleton count={2} />) }
			{ !conversationsIsLoading && conversationsFetchError && (<AlertError title={conversationsFetchError?.data?.message} message={conversationsFetchError?.data?.error} />) }
			{ !conversationsIsLoading && !conversationsFetchError && conversationsData?.data?.length < 1 && (<EmptyStates
				className={`my-10`}
				title={'Conversation'}
				action={false}
			/>) }

			{ !conversationsIsLoading && !conversationsIsFetching && conversationsDataFetchSuccess  && (
				<ul role="list" className="relative z-0 divide-y divide-gray-200">
					{conversationsData?.data?.length > 0 && conversationsData?.data?.map((conversation) => (
						<MessengerChatConversationsListItem
							key={`conversations_list_key_${conversation?._id}`}
							conversation={conversation} />
					))}
				</ul>
			) }

		</nav>
	);
}
