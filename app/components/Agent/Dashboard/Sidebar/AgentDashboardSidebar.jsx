import {Combobox, Dialog, Menu, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import {HomeIcon, InboxIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {ChevronUpDownIcon, CheckIcon, BackwardIcon} from "@heroicons/react/20/solid";
import classNames from "@/utils/classNames";
import Link from "next/link";
import DefaultGravatar from "@/components/DefaultGravatar";
import {useRouter} from "next/router";
import collect from "collect.js";
import UserSignOut from "@/components/UserSignOut";
import {useSession} from "next-auth/react";
import {useGetAgentWorkspacesQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import AgentAvailabilityStatusCommandButton from "@/components/Agent/AgentAvailabilityStatusCommandButton";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import {useGetAgentAssignedTeamsQuery} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import {BriefcaseIcon} from "@heroicons/react/24/solid";

export default function AgentDashboardSidebar({ workspaceId, agentId }){

	const router = useRouter()
	const [navigations, setNavigations] = useState([])

	const {
		data: assignedTeamsData,
		isLoading: assignedTeamsDataIsLoading
	} = useGetAgentAssignedTeamsQuery({
		workspaceId,
		agentId,
		active: true
	}, {skip: !workspaceId || !agentId })

	useEffect(() => {
		if(workspaceId){
			const navigation = getSidebarNavigations(workspaceId)
			setNavigations(navigation)
		}
	}, [workspaceId])

	const [sidebarOpen, setSidebarOpen] = useState(false)


	async function handleGoBack() {
		await router.push({
			pathname: `/dashboard`
		})
	}

	return (
		<>
			{/* Sidebar for Mobile */}
			{/*<AgentDashboardSidebarMobile />*/}

			{/* Static sidebar for desktop */}
			{/*<AgentDashboardSidebarDesktop />*/}

			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute right-0 top-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div className="flex flex-shrink-0 items-center px-4">
									<DefaultGravatar className="h-8 w-auto" />
								</div>

								<div className="mt-5 h-0 flex-1 overflow-y-auto">
									<nav className="px-2">
										<div className="space-y-1">
											{navigations.map((item) => (
												<Link
													key={item.name}
													href={item.href}
													className={classNames(
														item.current
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
														'group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5'
													)}
													aria-current={item.current ? 'page' : undefined}
												>
													<item.icon
														className={classNames(
															item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
															'mr-3 h-6 w-6 flex-shrink-0'
														)}
														aria-hidden="true"
													/>
													{item.name}
												</Link>
											))}
										</div>

										<div className="mt-8">
											<h3 className="px-3 text-sm font-medium text-gray-500" id="mobile-teams-headline">
												Teams
											</h3>

											{ assignedTeamsDataIsLoading && <DefaultSkeleton /> }
											{ !assignedTeamsDataIsLoading && assignedTeamsData?.length > 0 && (
												<div className="mt-1 space-y-1" role="group" aria-labelledby="mobile-teams-headline">
													{assignedTeamsData.map((team) => (
														<a
															key={team.name}
															href={team.href}
															className="group flex items-center rounded-md px-3 py-2 text-base font-medium leading-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
														>
						                              <span
							                              className={classNames(team.color_code, 'mr-4 h-2.5 w-2.5 rounded-full')}
							                              aria-hidden="true"
						                              />
															<span className="truncate">{team.name}</span>
														</a>
													))}
												</div>
											)}
										</div>
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className="w-14 flex-shrink-0" aria-hidden="true">
							{/* Dummy element to force sidebar to shrink to fit close icon */}
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pb-4 lg:pt-5">

				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex h-0 flex-1 flex-col overflow-y-auto pt-1">
					{/* User account dropdown */}
					<AgentAccountDropdown />

					<div className={`mt-10 mb-4 px-3`}>
						<h3 className="text-sm font-medium text-gray-500" id="desktop-teams-headline">
							Your Workspaces
						</h3>

						<AgentAssignedWorkspaceSelection
							agentId={agentId}
						/>
					</div>

					{/* Navigation */}
					<nav className="mt-6 px-3">
						<div className="space-y-1">
							{navigations.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={classNames(
										item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
										'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									<item.icon
										className={classNames(
											item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
											'mr-3 h-6 w-6 flex-shrink-0'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							))}
						</div>

						<div className="mt-8">
							{/* Secondary navigation */}
							<h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-teams-headline">
								Your Teams
							</h3>
							{ assignedTeamsDataIsLoading && <DefaultSkeleton /> }
							{ !assignedTeamsDataIsLoading && assignedTeamsData?.length > 0 && (
								<div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
									{assignedTeamsData.map((team) => (
										<a
											key={team.name}
											href={team.href}
											className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
										>
					                      <span
						                      className={classNames(team.color_code, 'mr-4 h-2.5 w-2.5 rounded-full')}
						                      aria-hidden="true"
					                      />
											<span className="truncate">{team.name}</span>
										</a>
									))}
								</div>
							)}
						</div>
					</nav>

					<AgentAvailabilityStatusCommandButton
						workspaceId={workspaceId}
						agentId={agentId}
						className={`mx-3 my-10 bg-indigo-500`}
					/>

				</div>
			</div>
		</>
	)
}

function AgentAccountDropdown() {
	const { data: sessionData } = useSession()
	const agentUser = sessionData?.user || {}

	return (
		<Menu as="div" className="relative inline-block px-3 text-left">
			<div>
				<Menu.Button className="group w-full rounded-md bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					<span className="flex w-full items-center justify-between">
						<span className="flex min-w-0 items-center justify-between space-x-3">
							<DefaultGravatar className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300" />
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-medium text-gray-900">{ agentUser?.name || 'The Agent' }</span>
								<span className="truncate text-sm text-gray-500">{ agentUser?.email || 'undefined' }</span>
							</span>
						</span>

						<ChevronUpDownIcon
							className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
							aria-hidden="true"
						/>
					</span>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
									Settings
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
									Notifications
								</a>
							)}
						</Menu.Item>
					</div>
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
									Get desktop app
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
									Support
								</a>
							)}
						</Menu.Item>
					</div>
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<UserSignOut
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								></UserSignOut>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}




function AgentAssignedWorkspaceSelection({ className, agentId, workspaceId = null }) {
	const [query, setQuery] = useState('')
	const [assignedWorkspaces, setAssignedWorkspaces] = useState([])
	const [selectedWorkspace, setSelectedWorkspace] = useState({})

	const {
		data: workspacesData,
		isLoading: workspacesDataIsLoading,
		isFetching: workspacesDataIsFetching,
		refetch: workspaceDataRefetch,
	} = useGetAgentWorkspacesQuery({ agentId: agentId }, { skip: !agentId })

	useEffect(() => {
		const assignedWorkspaces = collect(workspacesData?.length > 0 ? workspacesData : [])
			.map(({ id, name }) => ({ id, name }))
			.toArray()

		setAssignedWorkspaces(assignedWorkspaces)

		if(!workspaceId){
			setSelectedWorkspace(assignedWorkspaces[0])
		}

	}, [workspacesData, workspaceId])


	const filteredAssignedWorkspaces =
		query === ''
			? assignedWorkspaces
			: assignedWorkspaces.filter((workspace) => {
				return workspace.name.toLowerCase().includes(query.toLowerCase())
			})

	return (
		<div>
			{ workspacesDataIsLoading || workspacesDataIsFetching && 'wait...' }

			{ !workspacesDataIsLoading && !workspacesDataIsFetching && workspacesData?.length > 0 && (
				<Combobox
					as="div"
					value={selectedWorkspace}
					onChange={setSelectedWorkspace}
					className={classNames(className)}
				>
					<div className="relative mt-2">

						<Combobox.Input
							className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							onChange={(event) => setQuery(event.target.value)}
							displayValue={(person) => person?.name}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
							<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</Combobox.Button>

						{filteredAssignedWorkspaces.length > 0 && (
							<Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{filteredAssignedWorkspaces.map((person) => (
									<Combobox.Option
										key={person.id}
										value={person}
										className={({ active }) =>
											classNames(
												'relative cursor-default select-none py-2 pl-3 pr-9',
												active ? 'bg-indigo-600 text-white' : 'text-gray-900'
											)
										}
									>
										{({ active, selected }) => (
											<>
												<span className={classNames('block truncate', selected && 'font-semibold')}>{person.name}</span>

												{selected && (
													<span
														className={classNames(
															'absolute inset-y-0 right-0 flex items-center pr-4',
															active ? 'text-white' : 'text-indigo-600'
														)}
													>
					                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
					                        </span>
												)}
											</>
										)}
									</Combobox.Option>
								))}
							</Combobox.Options>
						)}
					</div>
				</Combobox>
			)}
		</div>
	)
}


function getSidebarNavigations(workspaceId) {
	return [
		{
			id: 1,
			name: 'Home',
			href: `/dashboard`,
			icon: HomeIcon,
			current: false
		},
		{
			id: 1,
			name: 'Agent Dashboard',
			href: `/workspaces/${workspaceId}/agent/dashboard`,
			icon: BriefcaseIcon,
			current: true
		},
		{
			id: 2,
			name: 'My Inbox',
			href: `/workspaces/${workspaceId}/agent/dashboard/myTasks`,
			icon: InboxIcon,
			current: false
		}
	]
}