import {Bars3BottomLeftIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {FaFacebook} from "react-icons/fa";
import {EnvelopeIcon, PhoneIcon} from "@heroicons/react/20/solid";

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const items = [
	{ name: 'Save and schedule', href: '#' },
	{ name: 'Save and completed', href: '#' },
	{ name: 'Export PDF', href: '#' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function QuickAction() {
	return (
		<div className="inline-flex rounded-md shadow-sm">
			<button
				type="button"
				className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				Actions
			</button>
			<Menu as="div" className="relative -ml-px block">
				<Menu.Button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
					<span className="sr-only">Open options</span>
					<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
					<Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							{items.map((item) => (
								<Menu.Item key={item.name}>
									{({ active }) => (
										<a
											href={item.href}
											className={classNames(
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
												'block px-4 py-2 text-sm'
											)}
										>
											{item.name}
										</a>
									)}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	)
}


export default function MessengerHeader({ setSidebarOpen }){
	return (
		<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white w-full">
			<button
				type="button"
				className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
				onClick={() => setSidebarOpen(true)}
			>
				<span className="sr-only">Open sidebar</span>
				<Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
			</button>

			<div className="flex flex-1 justify-between px-4">

				<div className="flex flex-1">
					<form className="flex w-full lg:ml-0" action="#" method="GET">
						<label htmlFor="search-field" className="sr-only">
							Search
						</label>
						<div className="relative w-full text-gray-400 focus-within:text-gray-600">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
								<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
							</div>
							<input
								id="search-field"
								className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
								placeholder="Search"
								type="search"
								name="search"
							/>
						</div>
					</form>
				</div>

				<div className="ml-4 flex items-center lg:ml-6 gap-2">
					<span className="isolate inline-flex rounded-md shadow-sm">
						<button
							type="button"
							className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
						>
							<FaFacebook className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
							<span className="ml-3">View Profile</span>
						</button>

						<button
					      type="button"
					      className="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				        >
					        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							<span className="ml-3">Call</span>
				        </button>

				        <button
					        type="button"
					        className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
				        >
				            <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							<span className="ml-3">Forward</span>
				        </button>
				    </span>

					<QuickAction />
				</div>
			</div>
		</div>
	)
}