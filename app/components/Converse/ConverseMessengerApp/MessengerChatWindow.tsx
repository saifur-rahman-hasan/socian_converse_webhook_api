import ConversationThreadPreview from "@/components/Converse/ConverseMessengerApp/ConversationThreadPreview";
import ConversationThreadsList from "@/components/Converse/ConverseMessengerApp/ConversationThreadsList";
import MessengerChatMessagesWindow from "@/components/Converse/ConverseMessengerApp/MessengerChatMessagesWindow";
import MessengerChatOnThread from "@/components/Converse/ConverseMessengerApp/MessengerChatOnThread";
import MessengerChatAndTasksSelectionToolbar from "@/components/messenger/MessengerChatAndTasksSelectionToolbar";
import React, {useEffect} from "react";
import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import {useDispatch} from "react-redux";


export default function MessengerChatWindow({ chatWindowData, agentId = null, canPreviewThreadMessages = false }) {
	const dispatch = useDispatch()

	const userActivityType = chatWindowData?.userActivityType || 'chat'

	useEffect(() => {
		if(!chatWindowData.currentThreadId){
			dispatch(editChatWindow({
				...chatWindowData,
				activityTab: 'threads',
				userActivityType: 'preview_all_threads'
			}))
		}
	}, [chatWindowData.currentThreadId])

	return (
		<div className="h-full flex flex-col">
			<MessengerChatAndTasksSelectionToolbar
				agentId={agentId}
			/>

			{ userActivityType === 'chat' && (
				<MessengerChatMessagesWindow
					chatWindowData={chatWindowData}
					agentId={agentId}
				/>
			)}

			{ userActivityType === 'chat_on_thread' && (
				<MessengerChatOnThread
					chatWindowData={chatWindowData}
					agentId={agentId}
				/>
			)}

			{ userActivityType === 'preview_all_threads' && (
				<div className={`bg-white px-8`}>
					<ConversationThreadsList chatWindowData={chatWindowData} />
				</div>
			)}

			{ userActivityType === 'preview_single_thread' && (
				<div className={`bg-white`}>
					<ConversationThreadPreview
						chatWindowData={chatWindowData}
						canPreviewThreadMessages={canPreviewThreadMessages}
					/>
				</div>
			)}
		</div>
	);
}
