import MessengerChatMessageItem from "@/components/messenger/MessengerChatMessageItem";
import EmptyStates from "@/components/ui/EmptyStates";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import {
	useGetMessagesByConversationIdQuery
} from "@/store/features/messenger/MessengerAPISlice";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import Dump from "@/components/Dump";

export default function MessengerChatMessages({ chatWindowData }){

	const {
		workspaceId,
		channelId,
		conversationId,
		currentThreadId,
		activeThreadId,
		userActivityType
	} = chatWindowData

	const {
		data: conversationMessagesData,
		isLoading: conversationMessagesIsLoading,
		isFetching: conversationMessagesIsFetching,
		error: conversationMessagesFetchError,
		refetch: conversationMessagesRefetch
	} = useGetMessagesByConversationIdQuery({
		workspaceId,
		channelId,
		conversationId,
		threadId: activeThreadId
	}, {
		skip: !workspaceId || !channelId || !conversationId || !activeThreadId
	})

	return (
		<div className="overflow-hidden border-y border-gray-300 bg-white">
			{conversationMessagesIsLoading && <DefaultSkeleton className={`py-4 px-10`} />}
			{!conversationMessagesIsLoading && conversationMessagesIsFetching && <DefaultSkeleton className={`py-4 px-10`} />}

			{
				!conversationMessagesIsLoading &&
				!conversationMessagesIsFetching &&
				!conversationMessagesFetchError &&
				conversationMessagesData?.length <= 0 && (
					<EmptyStates
						title={'No Messages'}
						message={'You have no messages'}
						className={`my-10`}
					/>
			)}

			{
				!conversationMessagesIsLoading &&
				!conversationMessagesIsFetching &&
				!conversationMessagesFetchError &&
				conversationMessagesData?.length > 0 && (
				<ul role="list" className="divide-y divide-gray-300">
					{conversationMessagesData.map((message) => {
						return <MessengerChatMessageItem
							key={`messenger_mid_${message._id}`}
							message={message}
						/>
					})}
				</ul>
			)}
		</div>
	)
}