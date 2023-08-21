import {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {setSidebarOpenState} from "../../../store/features/theme/themeSlice";
import {
	CalendarIcon,
	ChartBarIcon,
	FolderIcon,
	HomeIcon,
	InboxIcon,
	UsersIcon,
	XMarkIcon
} from "@heroicons/react/24/outline";
import SocianConverseLogo from "../../media/SocianConverseLogo";
import classNames from "../../../utils/classNames";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";


const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
	{ name: 'Workspaces', href: '/workspaces', icon: FolderIcon, current: false },
	{ name: 'Team', href: '/teams', icon: UsersIcon, current: false },
	{ name: 'Calendar', href: '/calendar', icon: CalendarIcon, current: false },
	{ name: 'Reports', href: '/reports', icon: ChartBarIcon, current: false },
]

export default function DashboardSidebarMobile(){
	const dispatch = useDispatch()
	const dashboardTheme = useSelector(state => state?.theme?.dashboard)
	const sidebarOpen = dashboardTheme?.sidebar_open || false

	return (
		<Transition.Root show={sidebarOpen} as={Fragment}>
			<Dialog as="div" className="relative z-40 lg:hidden" onClose={() => dispatch(setSidebarOpenState(false))}>
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
						<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
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
							<div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
								<div className="flex flex-shrink-0 items-center px-4">
									<SocianConverseLogo />
								</div>
								<nav className="mt-5 space-y-1 px-2">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className={classNames(
												item.current
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'group flex items-center rounded-md px-2 py-2 text-base font-medium'
											)}
										>
											<item.icon
												className={classNames(
													item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
													'mr-4 h-6 w-6 flex-shrink-0'
												)}
												aria-hidden="true"
											/>
											{item.name}
										</a>
									))}
								</nav>
							</div>
							<div className="flex flex-shrink-0 bg-gray-700 p-4">
								<Link href="/" className="group block flex-shrink-0">
									<div className="flex items-center">
										<div>
											<SocianConverseLogo />
										</div>
										<div className="ml-3">
											<p className="text-base font-medium text-white">Tom Cook</p>
											<p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">View profile</p>
										</div>
									</div>
								</Link>
							</div>
						</Dialog.Panel>
					</Transition.Child>
					<div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}