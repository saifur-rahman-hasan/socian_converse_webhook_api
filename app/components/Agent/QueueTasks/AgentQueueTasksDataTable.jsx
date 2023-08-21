import Link from "next/link";

const queueTasks = [
	{
		"task_id": 1,
		"thread_id": "ABC123",
		"customer_name": "John Doe",
		"task_description": "Handle customer inquiries for SIM purchase (3G/4G/5G/e-SIM).",
		"task_status": "completed",
		"task_start_time": "2023-07-06T09:00:00",
		"task_end_time": "2023-07-06T09:10:00",
		"task_duration_seconds": 600,
		"selected_network_type": "4G"
	},
	{
		"task_id": 2,
		"thread_id": "DEF456",
		"customer_name": "Jane Smith",
		"task_description": "Assist customers in purchasing internet packs (1GB - 7 days) for 20 Taka.",
		"task_status": "pending",
		"task_start_time": "2023-07-06T09:10:00",
		"task_end_time": null,
		"task_duration_seconds": null,
		"selected_network_type": "5G"
	},
	{
		"task_id": 3,
		"thread_id": "GHI789",
		"customer_name": "Michael Johnson",
		"task_description": "Assist customers in purchasing internet packs (1GB - 15 days) for 30 Taka.",
		"task_status": "pending",
		"task_start_time": "2023-07-06T09:20:00",
		"task_end_time": null,
		"task_duration_seconds": null,
		"selected_network_type": "3G"
	},
	{
		"task_id": 4,
		"thread_id": "JKL012",
		"customer_name": "Sarah Davis",
		"task_description": "Assist customers in purchasing internet packs (1GB - 30 days) for 60 Taka.",
		"task_status": "waiting-for-customer-replay",
		"task_start_time": "2023-07-06T09:30:00",
		"task_end_time": null,
		"task_duration_seconds": null,
		"selected_network_type": "e-SIM"
	},
	{
		"task_id": 5,
		"thread_id": "MNO345",
		"customer_name": "Robert Wilson",
		"task_description": "Assist customers with mobile recharge starting from 50 Taka to 5000 Taka.",
		"task_status": "pending",
		"task_start_time": "2023-07-06T09:40:00",
		"task_end_time": null,
		"task_duration_seconds": null,
		"selected_network_type": "4G"
	},
	{
		"task_id": 6,
		"thread_id": "PQR678",
		"customer_name": "Emily Thompson",
		"task_description": "Provide technical support for internet service-related issues.",
		"task_status": "completed",
		"task_start_time": "2023-07-06T09:50:00",
		"task_end_time": "2023-07-06T10:00:00",
		"task_duration_seconds": 600,
		"selected_network_type": "3G"
	},
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function AgentQueueTasksDataTable({ className }) {
	return (
		<div className={className}>
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">Your tasks queue</h1>
						<p className="mt-2 text-sm text-gray-700">
							Manage your queue task and complete it on time.
						</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Reload Queue Tasks
						</button>
					</div>
				</div>
				<div className="mt-8 flow-root">
					<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle">
							<table className="min-w-full border-separate border-spacing-0">
								<thead>
								<tr>
									<th
										scope="col"
										className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
									>
										ID
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
									>
										Description
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
									>
										Status
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
									>
										Task Ending Time
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
									>
										<span className="sr-only">Edit</span>
									</th>
								</tr>
								</thead>
								<tbody>
								{queueTasks.map((task, taskIdx) => (
									<tr key={task.task_id}>
										<td
											className={classNames(
												taskIdx !== task.length - 1 ? 'border-b border-gray-200' : '',
												'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
											)}
										>
											{task.task_id}
										</td>
										<td
											className={classNames(
												taskIdx !== task.length - 1 ? 'border-b border-gray-200' : '',
												'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'
											)}
										>
											{task.task_description}
										</td>
										<td
											className={classNames(
												taskIdx !== task.length - 1 ? 'border-b border-gray-200' : '',
												'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
											)}
										>
											{task.task_status}
										</td>
										<td
											className={classNames(
												taskIdx !== task.length - 1 ? 'border-b border-gray-200' : '',
												'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
											)}
										>
											{task.task_end_time || ''}
										</td>
										<td
											className={classNames(
												taskIdx !== task.length - 1 ? 'border-b border-gray-200' : '',
												'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
											)}
										>
											<Link
												href={{
													pathname: '/agent/dashboard/converse',
													query: {
														taskId: task.task_id
													}
												}}
												className="text-indigo-600 hover:text-indigo-900">
												Open <span className="sr-only">, {task.id}</span>
											</Link>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
