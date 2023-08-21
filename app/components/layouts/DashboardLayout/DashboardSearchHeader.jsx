import {Bars3CenterLeftIcon} from "@heroicons/react/24/outline";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";
import {useDispatch} from "react-redux";
import {setSidebarOpenState} from "../../../store/features/theme/themeSlice";

export default function DashboardSearchHeader(){
	const dispatch = useDispatch()

	return (
		<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
			<button
				type="button"
				className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
				onClick={() => dispatch(setSidebarOpenState(true))}
			>
				<span className="sr-only">Open sidebar</span>
				<Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
			</button>
			<div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex flex-1">
					<form className="flex w-full md:ml-0" action="#" method="GET">
						<label htmlFor="search-field" className="sr-only">
							Search
						</label>
						<div className="relative w-full text-gray-400 focus-within:text-gray-600">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
								<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
							</div>
							<input
								id="search-field"
								name="search-field"
								className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
								placeholder="Search"
								type="search"
							/>
						</div>
					</form>
				</div>
				<div className="flex items-center">
					{/* Profile dropdown */}
					<Menu as="div" className="relative ml-3">
						<div>
							<Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
								<span className="sr-only">Open user menu</span>
								<img
									className="h-8 w-8 rounded-full"
									src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
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
							<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
											<a
												href="#"
												className={classNames(
													active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
													'block px-4 py-2 text-sm'
												)}
											>
												Logout
											</a>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
		</div>
	)
}