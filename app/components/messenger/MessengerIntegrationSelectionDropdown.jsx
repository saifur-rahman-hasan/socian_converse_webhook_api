import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import classNames from "../../utils/classNames";

const integrations = [
	{
		id: 1,
		name: "telegram",
		source: 'socian_ai_converse_test_bot',
		avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	}
]

export default function MessengerIntegrationSelectionDropdown() {
	const [selected, setSelected] = useState(integrations[0])

	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select Channel</Listbox.Label>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
							<span className="flex items-center">
			                    <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
			                    <span className="ml-3 block truncate">{selected.source}</span>
			                </span>

							<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
			                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
			                </span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{integrations.map((integration) => (
									<Listbox.Option
										key={integration.id}
										className={({ active }) =>
											classNames(
												active ? 'bg-indigo-600 text-white' : 'text-gray-900',
												'relative cursor-pointer select-none py-2 pl-3 pr-9'
											)
										}
										value={integration}
									>
										{({ selected, active }) => (
											<>
												<div className="flex items-center">
													<img src={integration.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />

													<span
														className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
													>
							                            {integration.source}
													</span>

													<span className={classNames(active ? 'text-indigo-200' : 'text-gray-500', 'ml-2 truncate')}>
						                            @ {integration.type}
						                            </span>
												</div>

												{selected ? (
													<span
														className={classNames(
															active ? 'text-white' : 'text-indigo-600',
															'absolute inset-y-0 right-0 flex items-center pr-4'
														)}
													>
							                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
							                          </span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	)
}
