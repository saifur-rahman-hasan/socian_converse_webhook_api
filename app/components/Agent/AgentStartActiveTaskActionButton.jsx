import {useDispatch, useSelector} from "react-redux";
import {useStartAgentActiveTaskMutation} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import React, {useState} from "react";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import {activateAgentActiveTask} from "@/store/features/agentDashboard/AgentDashboardSlice";
import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import {useCreateAgentActivityMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";

export default function AgentStartActiveTaskActionButton({ workspaceId, agentId, taskDocId, className = '', accepted = false }) {
	const chatWindowData = useSelector(state => state.messengerInstance.chat_window.data)

	const dispatch = useDispatch()
	const agentLoadedActiveTask = useSelector((state) => state?.agentDashboardProviderData?.data?.agentActiveTask?.data)

	const [isAccepted, setIsAccepted] = useState(accepted)

	const [
		startAgentActiveTask,
		{
			data: agentActiveTaskData,
			isLoading: startingAgentActiveTask,
			error: agentActiveTaskStartError
		}
	] = useStartAgentActiveTaskMutation()

	async function handleStartActiveTask() {
		const activeTaskData = await startAgentActiveTask({
			workspaceId,
			agentId,
			taskDocId
		})

		if(activeTaskData?.data?.id){
			dispatch(
				activateAgentActiveTask(activeTaskData?.data || {})
			)

			setIsAccepted(true)
		}

	}

	return (
		<>
			{ startingAgentActiveTask && <ButtonLoading /> }

			{ !startingAgentActiveTask && isAccepted && (
				<ButtonTaskAccepted chatWindowData={chatWindowData}/>
			) }

			{ !startingAgentActiveTask && !isAccepted && (
				<ButtonTaskStart handleClick={handleStartActiveTask} />
			) }
		</>
	)
}

function ButtonTaskStart({ handleClick }){
	return (
		<button
			type="button"
			className="w-full relative inline-flex items-center justify-center rounded-l-md bg-gray-50 px-2 py-2 text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
			onClick={handleClick}
		>
			Accept & Continue
		</button>
	)
}

function ButtonTaskAccepted({ chatWindowData }) {
	const dispatch = useDispatch()

	const [
		startAgentIsOccupiedOnTheTask
	] = useCreateAgentActivityMutation()

	async function handleRespondToTheThread(chatWindowData) {
		await dispatch(
			editChatWindow({
				...chatWindowData,
				activityTab: 'chat',
				userActivityType: 'chat_on_thread',
			})
		)

		await startAgentIsOccupiedOnTheTask({
			agentId: chatWindowData.agentId,
			workspaceId: chatWindowData.workspaceId,
			channelId: chatWindowData.channelId,
			conversationId: chatWindowData.conversationId,
			threadId: chatWindowData.activeThreadId,
			activityGroup: 'task_opened',
			activityType: 'occupied_on_task',
			activityInfo: `Agent (${chatWindowData.agentId}) is occupied on Task (${chatWindowData?.activeThreadId} - ${chatWindowData?.taskDocId}) on workspace (${chatWindowData.workspaceId})`,
			activityState: 'start',
			activityData: { taskDocId: chatWindowData?.taskDocId, time: new Date() }
		})
	}

	return (
		<button
			type="button"
			className="w-full relative inline-flex items-center justify-center rounded-md bg-gray-50 px-2 py-2 text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
			onClick={() => handleRespondToTheThread(chatWindowData) }
		>
			Continue
		</button>
	)
}

function ButtonLoading() {
	return (
		<button
			type="button"
			className="w-full relative inline-flex items-center gap-x-4 justify-center rounded-md bg-gray-50 px-2 py-2 text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
		>
			<LoadingCircle size={5} />
			wait...
		</button>
	);
}