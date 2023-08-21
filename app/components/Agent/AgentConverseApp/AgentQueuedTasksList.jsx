import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";
import DefaultGravatar from "@/components/DefaultGravatar";
import Link from "next/link";
import {useSelector} from "react-redux";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import EmptyStates from "@/components/ui/EmptyStates";

const tabs = [
	{ name: 'All', href: '#', current: true },
	{ name: 'In Progress', href: '#', current: false },
	{ name: 'Completed', href: '#', current: false },
]

export default function AgentQueuedTasksList() {
	const [open, setOpen] = useState(true)
	const agentDashboardProviderData = useSelector(state => state.agentDashboardProviderData)
	const agentQueueTasks = agentDashboardProviderData?.data?.agentQueueTasks || null

	return (
		<div className="flex h-full flex-col overflow-y-scroll bg-white">
			<div className="p-6">
				<div className="flex items-start justify-between">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Queue Tasks</h1>
					<div className="ml-3 flex h-7 items-center">
						<button
							type="button"
							className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
							onClick={() => setOpen(false)}
						>
							<span className="sr-only">Close panel</span>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
			<div className="border-b border-gray-200">
				<div className="px-6">
					<nav className="-mb-px flex space-x-6" x-descriptions="Tab component">
						{tabs.map((tab) => (
							<a
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.current
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
								)}
							>
								{tab.name}
							</a>
						))}
					</nav>
				</div>
			</div>
			<ul role="list" className="flex-1 divide-y divide-gray-200 overflow-y-auto overflow-x-hidden">
				{ agentQueueTasks?.loading && <DefaultSkeleton /> }

				{
					!agentQueueTasks?.loading &&
					agentQueueTasks?.loaded &&
					!agentQueueTasks?.data?.length &&
					<EmptyStates
						title={'Queue Tasks'}
						message={'Currently you have no tasks for you into the queue list.'}
						action={false}
					/>
				}


				{
					!agentQueueTasks?.loading &&
					agentQueueTasks?.loaded &&
					agentQueueTasks?.data?.length > 0 &&
					agentQueueTasks?.data?.map((task) => (
						<li key={task.id}>
							<div className="group relative flex items-center px-5 py-6">
								<Link href={{
									pathname: `/agent/dashboard/converse`,
									query: {
										taskId: task.task_id
									}
								}} className="-m-1 block flex-1 p-1">
									<div className="absolute inset-0 group-hover:bg-gray-50" aria-hidden="true" />
									<div className="relative flex min-w-0 flex-1 items-center">
	                                <span className="relative inline-block flex-shrink-0">
		                                <DefaultGravatar className="h-10 w-10 rounded-full" />
		                                <span
			                                className={classNames(
				                                task.task_status === 'online' ? 'bg-green-400' : 'bg-gray-300',
				                                'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white'
			                                )}
			                                aria-hidden="true"
		                                />
	                                </span>

										<div className="ml-4 truncate">
											<p className="truncate text-sm font-medium text-gray-900">{task.customer_name}</p>
											<p className="truncate text-sm text-gray-500 no-wrap">
												{task.task_description.length > 40
													? `${task.task_description.slice(0, 40)}...`
													: task.task_description}
											</p>
										</div>
									</div>
								</Link>
								<Menu as="div" className="relative ml-2 inline-block flex-shrink-0 text-left">
									<Menu.Button className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
										<span className="sr-only">Open options menu</span>
										<span className="flex h-full w-full items-center justify-center rounded-full">
                                  <EllipsisVerticalIcon
	                                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
	                                  aria-hidden="true"
                                  />
                                </span>
									</Menu.Button>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-9 top-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div className="py-1">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
																'block px-4 py-2 text-sm'
															)}
														>
															View profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
																'block px-4 py-2 text-sm'
															)}
														>
															Send message
														</a>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</li>
					))
				}
			</ul>
		</div>
	)
}
