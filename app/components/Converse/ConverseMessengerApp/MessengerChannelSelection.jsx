import {Fragment, useEffect, useState} from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import {useRouter} from "next/router";
import classNames from "@/utils/classNames";
import collect from "collect.js";
import ChannelIcon from "@/components/Converse/ConverseMessengerApp/ChannelIcon";

function EmptyChannelsDropdown({ className }) {
	const people = [
		{ id: 0, name: 'Loading' },
	]
	const [selected, setSelected] = useState(people[0])
	return (
		<div className={className || ''}>
			<Listbox value={selected} onChange={setSelected}>
				{({ open }) => (
					<>
						<div className="relative mt-2">
							<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
								<span className="block truncate w-44">{selected.name}</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
								<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
									{people.map((person) => (
										<Listbox.Option
											key={person.id}
											className={({ active }) =>
												classNames(
													active ? 'bg-indigo-600 text-white' : 'text-gray-900',
													'relative cursor-default select-none py-2 pl-3 pr-9'
												)
											}
											value={person}
										>
											{({ selected, active }) => (
												<>
                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {person.name}
                        </span>

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
		</div>
	);
}

export default function MessengerChannelSelection({ channels, loading = false, onSelect }) {

	if(channels === false && loading === true){
		return <EmptyChannelsDropdown />
	}

	const router = useRouter()
	const queryChannelId = router?.query?.channelId || channels[0]?.id
	const [selectedChannel, setSelectedChannel] = useState([])

	useEffect(() => {
		if(queryChannelId){
			const parsedChannelId = parseInt(queryChannelId)
			const channel = collect(channels)
				.firstWhere('id', parsedChannelId) || []

			setSelectedChannel(channel)
		}
	}, [queryChannelId])


	useEffect(() => {
		onSelect(selectedChannel)
	}, [selectedChannel])

	return (
		<Listbox value={selectedChannel} onChange={setSelectedChannel}>
			{({ open }) => (
				<>
					<div className="relative mt-1 z-20">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
							<span className="flex items-center">
								<ChannelIcon channelType={selectedChannel?.channelType} size={20} />

								<span className="ml-3 block truncate">{selectedChannel.channelName}</span>
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
							<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{ channels?.length > 0 && [...channels].map((channel) => (
									<Listbox.Option
										key={channel.id}
										className={({ active }) =>
											classNames(
												active ? 'bg-gray-100' : 'text-gray-900',
												'relative cursor-default select-none py-2 pl-3 pr-9 cursor-pointer'
											)
										}
										value={channel}
									>
										{
											({ selected, active }) => (
												<>
													<div className="flex items-center">
														<ChannelIcon channelType={channel?.channelType} size={20} />

														<span
															className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
														>
							                            {channel.channelName}
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
											)
										}
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
