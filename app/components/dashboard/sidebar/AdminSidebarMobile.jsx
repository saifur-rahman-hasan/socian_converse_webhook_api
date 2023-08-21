import {Fragment} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {Bars4Icon, ClockIcon, HomeIcon, XMarkIcon} from "@heroicons/react/24/outline";
import classNames from "../../../utils/classNames";
import {useDispatch, useSelector} from "react-redux";
import {setSidebarOpenState} from "../../../store/features/theme/themeSlice";
import Link from "next/link";
import SocianConverseLogo from "../../media/SocianConverseLogo";

export default function AdminSidebarMobile(){
	const dispatch = useDispatch()

	const dashboardTheme = useSelector(state => state?.theme?.dashboard)
	const sidebarOpen = dashboardTheme?.sidebar_open || false

	const adminDashboardState = useSelector(state => state.adminDashboard)
	const navigation = adminDashboardState?.navigation || []
	const teams = adminDashboardState?.teams || []

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
						<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
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
										onClick={() => dispatch(setSidebarOpenState(false))}
									>
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
									</button>
								</div>
							</Transition.Child>
							<div className="flex flex-shrink-0 items-center px-4">
								<SocianConverseLogo />
							</div>
							<div className="mt-5 h-0 flex-1 overflow-y-auto">
								<nav className="px-2">
									<div className="space-y-1">
										{navigation.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? 'bg-gray-100 text-gray-900'
														: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
													'group flex items-center px-2 py-2 text-base leading-5 font-medium rounded-md'
												)}
												aria-current={item.current ? 'page' : undefined}
											>
												{item.name}
											</Link>
										))}
									</div>
									<div className="mt-8">
										<h3 className="px-3 text-sm font-medium text-gray-500" id="mobile-teams-headline">
											Teams
										</h3>
										<div className="mt-1 space-y-1" role="group" aria-labelledby="mobile-teams-headline">
											{teams.map((team) => (
												<Link
													key={team.name}
													href={team.href}
													className="group flex items-center rounded-md px-3 py-2 text-base font-medium leading-5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
												>
					                              <span
						                              className={classNames(team.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
						                              aria-hidden="true"
					                              />
													<span className="truncate">{team.name}</span>
												</Link>
											))}
										</div>
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
	)
}