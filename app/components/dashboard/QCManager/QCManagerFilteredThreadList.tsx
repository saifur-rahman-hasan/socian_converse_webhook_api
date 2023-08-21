import {Fragment, useEffect, useState} from 'react'
import classNames from "classnames";
import {useGetQCManagerFilteredTasksMutation} from "@/store/features/tasks/TasksAPISlice";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import useQCManagerTaskFilterDraftSlice from "@/hooks/useQCManagerTaskFilterDraftSlice";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import collect from "collect.js";
import Dump from "@/components/Dump";
import {formatSeconds} from "@/utils/helperFunctions";
import moment from "moment";

const statuses = {
	Complete: 'text-green-700 bg-green-50 ring-green-600/20',
	'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
	Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}


export default function QCManagerFilteredThreadList({ filteredTasks }) {
	return (
		<div>
			<table className="min-w-full divide-y divide-gray-300">
				<thead>
				<tr>
					<th scope="col"
						className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
						ThreadId
					</th>
					<th scope="col"
						className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
						Info
					</th>
					<th scope="col"
						className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
						HandlingTime
					</th>
					<th scope="col"
						className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
						Response Time
					</th>
					<th scope="col"
						className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">

					</th>
				</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
				{/*<ul role="list" className="divide-y divide-gray-100">*/}
					{filteredTasks.map((task) => (
						<QCManagerFilteredThreadListItem key={`QCManagerFilteredTasks_${task._id}`} task={task} />
					))}
				{/*</ul>*/}
				</tbody>responseTime
			</table>

		</div>

	)
}



function QCManagerMessengerExploreActionButton({ task }) {
	const dispatch = useDispatch()
	const router = useRouter()

	const workspaceId = task?.sourceData?.workspaceId
	const channelId = task?.sourceData?.channelId
	const conversationId = task?.sourceData?.conversationId
	const currentThreadId = task?.sourceData?.threadId
	const activityTab = "chat"
	const userActivityType = currentThreadId ? "chat_on_thread" : "none"

	const [isLoading, setIsLoading] = useState(false)

	async function handleExploreClick(e) {
		e.preventDefault()
		setIsLoading(true)

		const link = `/workspaces/${workspaceId}/QCManager/QCManagerMessenger?channelId=${channelId}&conversationId=${conversationId}&activityTab=${activityTab}&threadId=${currentThreadId}`
		await router.push(link)

	}

	return (
		<>
			{ isLoading && <LoadingCircle />}

			{ !isLoading && (
				<a
					href={task?.href}
					className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
					onClick={handleExploreClick}
				>
					Messages<span className="sr-only">, {task?.taskId}</span>
				</a>
			)}
		</>
	);
}

function QCManagerFilteredThreadListItem({ task }) {
	function format_plus_6_gmt(time){
		return new Date( new Date(time).getTime() + (6 * 60 * 60 * 1000)).toISOString();
	}
	return (
		<tr key={task.taskId}>
			<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
				<p className="pr-4 pl-4 text-sm leading-6 text-gray-900">{task?.taskId}</p>
			</td>
			<td className="whitespace-nowrap py-4 text-sm text-gray-500 font-bold">

					{/*<Dump data={task}/>*/}
					<div className="flex items-start justify-start gap-x-3">
						<p className="max-w-md text-sm font-semibold text-blue-900">{task?.consumer?.name || "The Consumer"}</p>
						<p
							className={classNames(
								statuses[task?.taskStatus],
								'px-2 rounded-md whitespace-nowrap mt-0.5 py-0.5 text-xs font-medium ring-1 ring-inset'
							)}
						>

							{task?.taskStatus}
						</p>

					</div>

				<div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
						<p className="whitespace-nowrap">
							{moment(format_plus_6_gmt(task?.updatedAt)).format('HH:mm  A - Do MMMM YYYY')}
						</p>
						<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
							<circle cx={1} cy={1} r={1} />
						</svg>
					<p className="truncate font-semibold  text-gray-600">by {task?.agent?.name || "The Agent"}</p>
				</div>

				<div className="mt-3 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
					<p className="text-sm">Description</p>
					<p className="max-w-md text-sm font-semibold text-gray-900">{task?.taskDescription}</p>
				</div>


			</td>
			<td className="whitespace-nowrap py-4 text-sm text-gray-500">
				<p className="truncate"> {task?.durationInSeconds}</p>
			</td>
			<td className="whitespace-nowrap py-4 text-sm text-gray-500">
				<p className="truncate"> {task?.responseTime}</p>
			</td>
			<td className="whitespace-nowrap py-4 text-sm text-gray-500">
				<div className="flex flex-none items-center gap-x-4">
					<QCManagerMessengerExploreActionButton task={task} />
				</div>
			</td>
		</tr>
	);
}