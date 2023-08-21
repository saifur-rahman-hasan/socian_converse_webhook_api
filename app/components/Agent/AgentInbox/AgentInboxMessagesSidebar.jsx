import {
	useGetAssignedTasksQuery
} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import Dump from "@/components/Dump";
import EmptyStates from "@/components/ui/EmptyStates";
import { useSelector} from "react-redux";
import {useEffect} from "react";
import {BookmarkIcon, QueueListIcon, StarIcon} from "@heroicons/react/24/solid";

import {
	InboxSidebarAssignedTasks
} from "@/components/Agent/AgentInbox/AgentInboxAssignedTasksSidebarContent";

export default function AgentInboxMessagesSidebar({ workspaceId, agentId }) {
	const conversationSearch = useSelector(state => state.messengerInstance.chat_command.open)

	const {
		data: assignedTasksData,
		isLoading: assignedTasksIsLoading,
		isFetching: assignedTasksIsFetching,
		isSuccess: assignedTasksFetchSuccess,
		error: assignedTasksFetchError,
		refetch: assignedTasksRefetch
	} = useGetAssignedTasksQuery({ workspaceId, agentId}, {skip: !workspaceId || !agentId})

	useEffect(() => {
		if(!conversationSearch){
			assignedTasksRefetch()
		}
	}, [conversationSearch])

	return (
		<aside className="hidden xl:order-first xl:block xl:flex-shrink-0">
			<div className="relative flex min-h-screen max-h-screen overflow-y-scroll w-96 flex-col border-r border-gray-200 bg-gray-100">

				<div className="flex-shrink-0 border-b">
					<div className="flex h-16 flex-col justify-center bg-white px-6">
						<div className="flex items-baseline justify-between space-x-3">
							<h2 className="text-lg font-medium text-gray-900">Inbox</h2>

							<div className={`flex items-center gap-x-4`}>
								<div
									className="flex items-center gap-x-2 text-sm font-medium text-gray-500">
									<QueueListIcon className={`h-4 w-4 text-orange-500`} />
									Queue
								</div>

								<div className={`flex items-center gap-x-2 text-sm font-medium text-gray-500`}>
									<BookmarkIcon className={`h-4 w-4 text-yellow-500`} />
									Bookmark
								</div>
							</div>


						</div>
					</div>
				</div>

				{ assignedTasksIsLoading || assignedTasksIsFetching && <DefaultSkeleton className={`p-4 `} /> }
				{ !assignedTasksIsLoading && assignedTasksFetchError && <Dump data={{assignedTasksFetchError}} /> }
				{ !assignedTasksIsLoading && !assignedTasksFetchError && !assignedTasksData?.length && <EmptyStates className={`my-10`} title={`You have no assigned tasks`} action={false} /> }

				{
					!(assignedTasksIsLoading || assignedTasksIsFetching) &&
					assignedTasksFetchSuccess &&
					assignedTasksData?.length > 0 &&
					<InboxSidebarAssignedTasks
						assignedTasks={assignedTasksData}
						agentId={agentId}
					/>
				}

			</div>
		</aside>
	);
}
