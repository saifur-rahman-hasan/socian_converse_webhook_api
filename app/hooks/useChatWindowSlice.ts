import { useSelector } from 'react-redux';

interface ChatWindowInterface {
	workspaceId: number,
	channelId: number,
	conversationId: string,
	currentThreadId: number | null,
	activeThreadId: number | null,
	activityTab: string,
	userActivityType: string,
}

function useChatWindowSlice(): ChatWindowInterface {
	const chatWindowData = useSelector((state: any) => state.messengerInstance.chat_window.data)

	const workspaceId = chatWindowData?.workspaceId
	const channelId = chatWindowData?.channelId
	const conversationId = chatWindowData?.conversationId
	const currentThreadId = chatWindowData?.currentThreadId
	const activeThreadId = chatWindowData?.activeThreadId
	const activityTab = chatWindowData?.activityTab
	const userActivityType = chatWindowData?.userActivityType

	return {
		workspaceId,
		channelId,
		conversationId,
		currentThreadId,
		activeThreadId,
		activityTab,
		userActivityType,
	};
}

export default useChatWindowSlice;
