import {useDispatch, useSelector} from "react-redux";
import {activateChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import {MessageTime} from "@/components/messenger/MessengerChatMessageItem";
import {
	useAgentTaskAcceptActionMutation, useAgentTaskBookmarkActionMutation,
	useGetAssignedTasksQuery
} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import {CheckCircleIcon} from "@heroicons/react/20/solid";
import {BookmarkIcon} from "@heroicons/react/24/solid";
import Dump from "@/components/Dump";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import {useState} from "react";
import collect from "collect.js";

function AgentTasksList({ agentId, tasks }) {
	return (
		<ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
			{ tasks?.length > 0 && tasks.map((task) => <InboxSidebarAssignedTaskItem
				key={`inbox_sidebar_assigned_task_${task.taskId}`}
				task={task}
				agentId={agentId}
			/>)}
		</ul>
	);
}

export function InboxSidebarAssignedTasks({ assignedTasks, agentId }) {

	const acceptedAndBookmarkedTasks = collect(assignedTasks || [])
		.reject((item: any) => !item?.agentLog)
		.sortBy([
			task => !(task?.agentLog?.agentTaskAccepted), // Accepted tasks first
			task => !(task?.agentLog?.agentTaskBookmarked), // Bookmarked tasks next
		]).sortByDesc('updatedAt').all();

	const queueTasks = collect(assignedTasks || [])
		.reject((item: any) => item?.agentLog?.agentTaskAccepted || item?.agentLog?.agentTaskBookmarked)
		.sortBy([
			task => task?.updatedAt,
		]).all(); // Reverse the order to make newer tasks appear first


	return (
		<nav aria-label="Message list" className="min-h-0 flex-1 overflow-y-auto bg-white">
			{/*<Dump data={filteredTasks} />*/}

			<ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
				{acceptedAndBookmarkedTasks.map((task: any) => <InboxSidebarAssignedTaskItem
					key={`inbox_sidebar_assigned_task_${task?.taskId}`}
					task={task}
					agentId={agentId}
				/>)}
			</ul>

			<div className={`p-4 bg-gray-100 border border-y my-2`}>
				<h3>Queue Tasks</h3>
			</div>

			<ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
				{queueTasks.map((task: any) => <InboxSidebarAssignedTaskItem
					key={`inbox_sidebar_assigned_task_${task?.taskId}`}
					task={task}
					agentId={agentId}
				/>)}
			</ul>
		</nav>
	);
}


export default function AgentInboxAssignedTasksSidebarContent({ workspaceId, agentId }){
	const {
		data: agentTasksData,
		isLoading: agentTasksDataIsLoading,
		isFetching: agentTasksDataIsFetching,
		isSuccess: agentTasksDataFetchSuccess,
		error: agentTasksDataFetchError,
	} = useGetAssignedTasksQuery({
		workspaceId,
		agentId,
	}, {
		skip: !workspaceId || !agentId,
	})

	return (
		<nav aria-label="Message list" className="min-h-0 flex-1 overflow-y-auto bg-white">

			{
				agentTasksDataIsLoading || agentTasksDataIsFetching && <DefaultSkeleton className={`my-4`} />
			}

			{ !agentTasksDataIsLoading || !agentTasksDataIsFetching && !agentTasksDataFetchError && agentTasksDataFetchSuccess && (
				<AgentTasksList agentId={agentId} tasks={agentTasksData} />
			)}
		</nav>
	)
}

export function AgentTaskAcceptActionButton({ agentId, taskId, accepted = false }) {

	const [isAccepting, setIsAccepting] = useState(false);
	const [isAccepted, setIsAccepted] = useState(accepted);
	const [isError, setIsError] = useState(false);

	const [agentTaskAcceptAction] = useAgentTaskAcceptActionMutation();

	async function handleAgentTaskAccepted() {
		if (!isAccepting) {
			setIsAccepting(true);

			try {
				await agentTaskAcceptAction({
					agentId: agentId,
					taskId: taskId
				});
				setIsAccepted(true);
			} catch (error) {
				setIsError(true);
			}

			setIsAccepting(false);
		}
	}


	return (
		<>
			{!accepted && isAccepting && <LoadingCircle size={4} />}

			{!isAccepting && isAccepted && ( <CheckCircleIcon className="h-4 w-4 text-green-600" /> )}

			{!isAccepting && !isAccepted && ( <CheckCircleIcon
				className={`h-4 w-4 ${isAccepting ? 'cursor-not-allowed' : 'cursor-pointer'} ${
					isAccepted ? 'text-green-600' : 'text-gray-400'
				}`}
				onClick={handleAgentTaskAccepted}
			/> )}
		</>
	);

}

export function AgentTaskBookmarkActionButton({ agentId, taskId, bookmarked = false }) {

	const [isBookmarking, setIsBookmarking] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(bookmarked);
	const [isError, setIsError] = useState(false);

	const [AgentTaskBookmarkAction] = useAgentTaskBookmarkActionMutation();

	async function handleAgentTaskBookmarked() {
		if (!isBookmarking) {
			setIsBookmarking(true);

			try {
				await AgentTaskBookmarkAction({
					agentId: agentId,
					taskId: taskId
				});
				setIsBookmarked(true);
			} catch (error) {
				setIsError(true);
			} finally {
				setIsBookmarking(false);
			}

		}
	}

	return (
		<>
			{!bookmarked && isBookmarking && <LoadingCircle size={4} />}

			{!isBookmarking && isBookmarked && ( <BookmarkIcon className="h-4 w-4 text-yellow-500" /> )}

			{!isBookmarking && !isBookmarked && ( <BookmarkIcon
				className={`h-4 w-4 ${isBookmarking ? 'cursor-not-allowed' : 'cursor-pointer'} ${
					isBookmarked ? 'text-green-600' : 'text-gray-400'
				}`}
				onClick={handleAgentTaskBookmarked}
			/> )}
		</>
	);
}

function AgentTaskActionButtons({
	agentId,
	taskId,
	accepted = false,
	bookmarked = false
}) {

	return (
		<div className={`flex items-center justify-end gap-x-2 z-10`}>

			<AgentTaskAcceptActionButton
				agentId={agentId}
				taskId={taskId}
				accepted={accepted}
			/>

			<AgentTaskBookmarkActionButton
				agentId={agentId}
				taskId={taskId}
				bookmarked={bookmarked || false}
			/>

		</div>
	);
}

export function InboxSidebarAssignedTaskItem({ task, agentId }) {
	const dispatch = useDispatch()

	function handleTaskSelection(task) {
		const {workspaceId, channelId, conversationId, threadId} = task.sourceData

		let activityTab  = 'threads'
		let userActivityType  = 'preview_single_thread'
		const taskAgentLog = task?.agentLog || null

		if(taskAgentLog?.agentTaskAccepted === true){
			activityTab  = 'chat'
			userActivityType  = 'chat_on_thread'
		}

		dispatch(activateChatWindow({
			workspaceId,
			channelId,
			conversationId,
			currentThreadId: threadId,
			activeThreadId: threadId,
			activityTab,
			userActivityType,
			agentId: agentId,
			taskDocId: task._id
		}))
	}

	return (
		<li
			className="relative bg-white px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
		>
			<div className="flex justify-between space-x-3">
				<div className="min-w-0 flex-1">
					<div
						className="block focus:outline-none cursor-pointer"
						onClick={() => handleTaskSelection(task) }
					>
						<span className="absolute inset-0" aria-hidden="true" />
						<p className="truncate text-sm font-medium text-gray-900">{task?.author?.name || `The Consumer`}</p>
						<p className="truncate text-sm text-gray-500">{task.taskDescription}</p>
					</div>
				</div>

				{/* Right Side */}
				<div className={`flex flex-col gap-y-2 text-right`}>
					<MessageTime
						timestamp={task.updatedAt}
						className="flex-shrink-0 whitespace-nowrap text-xs text-gray-500"
					/>


					{/* Agent Task Action */}
					<AgentTaskActionButtons
						agentId={agentId}
						taskId={task?._id}
						accepted={task?.agentLog?.agentTaskAccepted || false}
						bookmarked={task?.agentLog?.agentTaskBookmarked || false}
					/>
				</div>
			</div>
		</li>
	)
}