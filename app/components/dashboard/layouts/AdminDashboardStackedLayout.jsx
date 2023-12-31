import { Fragment, useState } from 'react'
import { Disclosure, Menu, RadioGroup, Switch, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid'
import {
	Bars3Icon,
	BellIcon,
	CogIcon,
	CreditCardIcon,
	KeyIcon,
	SquaresPlusIcon,
	UserCircleIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import classNames from "../../../utils/classNames";
import SocianConverseLogo from "../../media/SocianConverseLogo";
import Link from "next/link";

const user = {
	name: 'Lisa Marie',
	email: 'lisamarie@example.com',
	imageUrl:
		'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80',
}
const navigation = [
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Agent Dashboard', href: '/dashboard/agent' },
	{ name: 'Integrations', href: '/dashboard/integrations' },
	{ name: 'Workspaces', href: '/dashboard/workspaces' },
	{ name: 'Teams', href: '/dashboard/teams' },
]

const userNavigation = [
	{ name: 'Your Profile', href: '/account' },
	{ name: 'Settings', href: 'account' },
	{ name: 'Sign out', href: '/api/auth/sign-out' },
]


export default function AdminDashboardStackedLayout({ children }) {
	return (
		<>
			<div className="h-full">
				<Disclosure as="header" className="bg-white shadow">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
								<div className="relative flex h-16 justify-between">
									<div className="relative z-10 flex px-2 lg:px-0">
										<div className="flex flex-shrink-0 items-center">
											<SocianConverseLogo className={`w-32`} />
										</div>
									</div>
									<div className="relative z-10 flex items-center lg:hidden">
										{/* Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900">
											<span className="sr-only">Open menu</span>
											{open ? (
												<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
											) : (
												<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
											)}
										</Disclosure.Button>
									</div>
									<div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
										<button
											type="button"
											className="flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
										>
											<span className="sr-only">View notifications</span>
											<BellIcon className="h-6 w-6" aria-hidden="true" />
										</button>

										{/* Profile dropdown */}
										<Menu as="div" className="relative ml-4 flex-shrink-0">
											<div>
												<Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
													<span className="sr-only">Open user menu</span>
													<img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
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
												<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													{userNavigation.map((item) => (
														<Menu.Item key={item.name}>
															{({ active }) => (
																<a
																	href={item.href}
																	className={classNames(
																		active ? 'bg-gray-100' : '',
																		'block py-2 px-4 text-sm text-gray-700'
																	)}
																>
																	{item.name}
																</a>
															)}
														</Menu.Item>
													))}
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>

								<nav className="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
									{navigation.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className="inline-flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
										>
											{item.name}
										</Link>
									))}
								</nav>
							</div>

							<Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
								<div className="space-y-1 px-2 pt-2 pb-3">
									{navigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											as="a"
											href={item.href}
											className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
										>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
								<div className="border-t border-gray-200 pt-4 pb-3">
									<div className="flex items-center px-4">
										<div className="flex-shrink-0">
											<img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
										</div>
										<div className="ml-3">
											<div className="text-base font-medium text-gray-800">{user.name}</div>
											<div className="text-sm font-medium text-gray-500">{user.email}</div>
										</div>
										<button
											type="button"
											className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
										>
											<span className="sr-only">View notifications</span>
											<BellIcon className="h-6 w-6" aria-hidden="true" />
										</button>
									</div>
									<div className="mt-3 space-y-1 px-2">
										{userNavigation.map((item) => (
											<Disclosure.Button
												key={item.name}
												as="a"
												href={item.href}
												className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
											>
												{item.name}
											</Disclosure.Button>
										))}
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>

				<main>
					{ children }
				</main>


			</div>
		</>
	)
}
