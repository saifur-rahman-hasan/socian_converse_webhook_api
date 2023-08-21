import { ChatBubbleLeftIcon, QueueListIcon } from "@heroicons/react/24/outline";
import classNames from "../../utils/classNames";
import Badge from "@/components/ui/Badge";
import {useDispatch, useSelector} from "react-redux";
import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import useAuthUserSlice from "@/hooks/useAuthUserSlice";
import Link from "next/link";

export default function MessengerChatAndTasksSelectionToolbar({ agentId = null }){
	const chatWindowData = useSelector(state => state.messengerInstance.chat_window.data)
	const {isQCManager, isAgent, isAdmin, isSupervisor} = useAuthUserSlice()
	const dispatch = useDispatch()
	const isOnlyQCManager = isQCManager && !isAdmin && !isSupervisor && !isAgent

	const {
		currentThreadId,
		activeThreadId,
		activityTab,
		userActivityType,
		workspaceId,
	} = chatWindowData

	let tabs = [
		{ id: 'chat', name: 'Chat', current: activityTab === 'chat' },
		{ id: 'threads', name: 'Threads', current: activityTab === 'threads' }
	]

	if(isOnlyQCManager){
		tabs = [
			{ id: 'chat', name: 'Chat', current: activityTab === 'chat' },
		]
	}

	async function handleActivityTabSelection(tab) {
		let userActivityType = 'chat'
		let activityTab = tab.id
		if(tab.id === 'chat' && chatWindowData?.currentThreadId > 0){
			userActivityType = 'chat_on_thread'
		}else if(tab.id === 'chat' && !chatWindowData?.currentThreadId || !chatWindowData?.activeThreadId){
			userActivityType = 'preview_all_threads'
			activityTab = 'threads'
		}else if(tab.id === 'threads') {
			userActivityType = agentId > 0
				? 'preview_single_thread'
				: 'preview_all_threads'
		}


		await dispatch(editChatWindow({
			...chatWindowData,
			activityTab: activityTab,
			userActivityType: userActivityType
		}))
	}

	return (
		<div className="flex-none bg-white">
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">
					Select a tab
				</label>

				<select
					id="tabs"
					name="tabs"
					className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
					defaultValue={tabs.find((tab) => tab.current)?.name}
				>
					{tabs.map((tab) => (
						<option key={tab.name}>{tab?.name}</option>
					))}
				</select>
			</div>

			<div className="hidden sm:block">
				{isOnlyQCManager && (
					<div className={`p-4`}>
						<Link
							href={`/workspaces/${workspaceId}/QCManager/dashboard`}
							className={`p-4`}>&larr; Go Back</Link>
					</div>
				)}
				<nav className="isolate flex divide-x divide-gray-200 shadow" aria-label="Tabs">
					{tabs.map((tab, tabIdx) => {
						return (
							<div
								onClick={() => handleActivityTabSelection(tab) }
								key={tab.name}
								className={classNames(
									tab.current || activityTab === tab.name.toLowerCase() ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
									'group relative min-w-0 flex-1 overflow-hidden overflow-x-auto bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 cursor-pointer'
								)}
								aria-current={tab.current ? 'page' : undefined}
							>
								<div className={`flex items-center gap-x-4`}>
									{ tab.name.toLowerCase() === 'chat' && <ChatBubbleLeftIcon className={`w-6 h-6`} /> }
									{ tab.name.toLowerCase() === 'tasks' && <QueueListIcon className={`w-6 h-6`} /> }

									<span>{tab.name}</span>

									{
										tab.name.toLowerCase() === 'chat' && userActivityType === 'chat_on_thread' &&
										(<Badge
											color={'red'}
											text={`Current Thread: ${ userActivityType === 'chat_on_thread' ? activeThreadId : currentThreadId || 'no_thread' }`} />)
									}

									<span
										aria-hidden="true"
										className={classNames(
											activityTab === tab.name.toLowerCase() ? 'bg-indigo-500' : 'bg-transparent',
											'absolute inset-x-0 bottom-0 h-0.5'
										)}
									/>
								</div>
							</div>
						)
					})}
				</nav>
			</div>
		</div>
	)
}