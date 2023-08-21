import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import {
	Bars4Icon,
	CalendarIcon,
	ChartBarIcon, ClockIcon,
	FolderIcon,
	HomeIcon,
	InboxIcon,
	UsersIcon,
	XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "../../../../utils/classNames";
import {useDispatch, useSelector} from "react-redux";
import {setSidebarOpenState} from "../../../../store/features/theme/themeSlice";
import SocianConverseLogo from "../../../media/SocianConverseLogo";

const navigation = [
	{ name: 'Home', href: '#', icon: HomeIcon, current: true },
	{ name: 'My tasks', href: '#', icon: Bars4Icon, current: false },
	{ name: 'Recent', href: '#', icon: ClockIcon, current: false },
]

export default function AdminDashboardSidebar(){
	const dispatch = useDispatch()
	const dashboardTheme = useSelector(state => state?.theme?.dashboard)
	const dashboardSidebarOpen = dashboardTheme?.sidebar_open || false
	const [sidebarOpen, setSidebarOpen] = useState(false)

	useEffect(() => {
		setSidebarOpen(dashboardSidebarOpen)
	}, [dashboardSidebarOpen])

	useEffect(() => {
		dispatch(setSidebarOpenState(sidebarOpen))
	}, [sidebarOpen])

	return (
		<>
			{/* Overlay Sidebar */}
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
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
							<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-12 pt-2">
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
									<SocianConverseLogo dark={true} className={`w-32 mx-auto`} />
								</div>
								<div className="mt-6 flex flex-grow flex-col">
									<nav className="flex-1 space-y-1 bg-gray-900" aria-label="Sidebar">
										{navigation.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? 'bg-gray-900/80 border-emerald-300 text-emerald-600'
														: 'border-transparent text-gray-300',
													'group flex items-center px-3 py-2 text-sm font-medium border-l-4 hover:bg-gray-900 hover:text-gray-400'
												)}
											>
												<item.icon
													className={classNames(
														item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500',
														'mr-3 flex-shrink-0 h-6 w-6'
													)}
													aria-hidden="true"
												/>
												{item.name}
											</Link>
										))}
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
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex min-h-0 flex-1 flex-col bg-gray-900">
					<div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
						<SocianConverseLogo dark={true} className={`w-32 mx-auto`} />
					</div>
					<div className="mt-5 flex flex-grow flex-col">
						<nav className="flex-1 space-y-1" aria-label="Sidebar">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={classNames(
										item.current
											? 'bg-gray-900/80 border-emerald-300 text-emerald-600'
											: 'border-transparent text-gray-300',
										'group flex items-center px-3 py-2 text-sm font-medium border-l-4 hover:bg-gray-900 hover:text-gray-400'
									)}
								>
									<item.icon
										className={classNames(
											item.current ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500',
											'mr-3 flex-shrink-0 h-6 w-6'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							))}
						</nav>
					</div>

					<div className="group flex flex-shrink-0 border-t border-gray-600">
						<a href="#" className=" block w-full flex-shrink-0  p-4 group-hover:bg-gray-800/80">
							<div className="flex items-center">
								<div>
									<img
										className="inline-block h-9 w-9 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-gray-300 ">Tom Cook</p>
									<p className="text-xs font-medium text-gray-500">View profile</p>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</>
	)
}