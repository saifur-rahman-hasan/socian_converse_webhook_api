import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import Link from "next/link";

const positions = [
	{
		id: 1,
		title: 'I want to buy 4G enabled e-sim for my Iphone 12. Can anyone help me?',
		type: 'Full-time',
		location: 'Remote',
		department: 'Sale & Marketing',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		image:
			'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		id: 2,
		title: 'Task Title',
		type: 'Full-time',
		location: 'Remote',
		department: 'Engineering',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		image:
			'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		id: 3,
		title: 'User Interface Designer',
		type: 'Full-time',
		location: 'Remote',
		department: 'Design',
		closeDate: '2020-01-14',
		closeDateFull: 'January 14, 2020',
		image:
			'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
]

export default function HumanAgentMyTasksStackLists({ tasks }) {
	return (
		<div className="overflow-hidden bg-white shadow sm:rounded-md">
			<ul role="list" className="divide-y divide-gray-200">
				{tasks.map((task) => (
					<li key={task._id}>
						<Link
							href={`/dashboard/agent/my-tasks/${task?._id}`}
							className="block hover:bg-gray-50"
						>
							<div className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">

									<p className="truncate text-sm font-medium text-indigo-600">{task.title}</p>
									<div className="ml-2 flex flex-shrink-0">
										<p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
											{`position.type`}
										</p>
									</div>
								</div>
								<div className="mt-2 sm:flex sm:justify-between">
									<div className="sm:flex">
										<p className="flex items-center text-sm text-gray-500">
											<UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
											{task.team}
										</p>
										<p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
											<MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
											{`position.location`}
										</p>
									</div>
									<div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
										<CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
										<p>
											Last update <time dateTime={task.updated_at}>{task.updated_at}</time>
										</p>
									</div>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
