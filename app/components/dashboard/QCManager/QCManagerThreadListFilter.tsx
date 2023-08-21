import {Fragment, useEffect, useState} from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import useQCManagerTaskFilterDraftSlice from "@/hooks/useQCManagerTaskFilterDraftSlice";
import WorkspaceChannelSelectionDropDown from "@/components/WorkspaceChannel/WorkspaceChannelSelectionDropDown";
import {useDispatch} from "react-redux";
import {updateQCManagerTaskFilterData} from "@/store/features/draft/draftSlice";
import WorkspaceChannelThreadSelectionDropDown
	from "@/components/WorkspaceChannel/WorkspaceChannelThreadSelectionDropDown";
import DateRangePickerComponent from "@/components/dashboard/report/dateTimeFilter/DateRangePickerComponent";
import Badge from "@/components/ui/Badge";
import MultipleSelectMenu from "@/components/ui/forms/MultipleSelectMenu";
import {debugLog} from "@/utils/helperFunctions";
import collect from "collect.js";
import AgentUserSelection from "@/components/Agent/AgentUserSelection";
import MultipleTagSelect from '@/components/tag/MultipleTagSelect';


const filters = [
	{
		id: 'threads',
		name: 'Threads',
		options: [
			{ id: 1, name: "Thread Id: 1", value: 'white', label: 'White', checked: false },
			{ id: 2, name: "Thread Id: 2", value: 'beige', label: 'Beige', checked: false },
			{ id: 3, name: "Thread Id: 3", value: 'blue', label: 'Blue', checked: false },
		],
	},
	{
		id: 'sizes',
		name: 'Sizes',
		options: [
			{ value: 's', label: 'S', checked: false },
			{ value: 'm', label: 'M', checked: false },
			{ value: 'l', label: 'L', checked: false },
		],
	},
]


function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function SelectedChannels({ selectedChannels }) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
			<h3 className="text-sm font-medium text-gray-500">
				Channels
				<span className="sr-only">, active</span>
			</h3>

			<div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

			<div className="mt-2 sm:ml-4 sm:mt-0">
				<div className="-m-1 flex flex-wrap items-center">
					{
						selectedChannels?.length > 0 && selectedChannels.map(channel => (
							<span
								key={`QCManagerTaskFilterSelectedChannels_channelId_${channel.id}`}
								className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
							>
			                    <span>{channel?.name}</span>

			                    <button
				                    type="button"
				                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
			                    >
									<span className="sr-only">Remove filter for {channel?.name}</span>
									<svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
										<path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
									</svg>
			                    </button>
		                    </span>
						))
					}
				</div>
			</div>
		</div>
	);
}

function SelectedThreads({ selectedThreads }) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
			<h3 className="text-sm font-medium text-gray-500">
				Threads
				<span className="sr-only">, active</span>
			</h3>

			<div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

			<div className="mt-2 sm:ml-4 sm:mt-0">
				<div className="-m-1 flex flex-wrap items-center">
					{
						selectedThreads?.length > 0 && selectedThreads.map(thread => (
							<span
								key={`QCManagerTaskFilterSelectedThreads_threadId_${thread.id}`}
								className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
							>
			                    <span>{thread?.name}</span>

			                    <button
				                    type="button"
				                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
			                    >
									<span className="sr-only">Remove filter for {thread?.name}</span>
									<svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
										<path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
									</svg>
			                    </button>
		                    </span>
						))
					}
				</div>
			</div>
		</div>
	);
}

function SelectedDateRangeContent({ selectedDateRange }) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
			<h3 className="text-sm font-medium text-gray-500">
				Date Range
				<span className="sr-only">, active</span>
			</h3>

			<div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

			<div className="mt-2 sm:ml-4 sm:mt-0">
				<div className="-m-1 flex flex-wrap items-center">
					<div className={`flex items-center gap-x-4`}>
						<Badge color={'green'} text={selectedDateRange?.from} />
						<span>to</span>
						<Badge color={'green'} text={selectedDateRange?.to} />
					</div>
				</div>
			</div>
		</div>
	);
}

function SelectedIceFeedbackFilterContent({ selectedIceFeedback }) {
	return (
		<div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
			<h3 className="text-sm font-medium text-gray-500">
				Ice Feedback
				<span className="sr-only">, active</span>
			</h3>

			<div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

			<div className="mt-2 sm:ml-4 sm:mt-0">
				<div className="-m-1 flex flex-wrap items-center">
					{
						selectedIceFeedback?.length > 0 && selectedIceFeedback.map(item => (
							<span
								key={`QCManagerTaskFilterSelectedIceFeedback_iceFeedback_${item.id}`}
								className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
							>
			                    <span>{item?.name}</span>

			                    <button
				                    type="button"
				                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
			                    >
									<span className="sr-only">Remove filter for {item?.name}</span>
									<svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
										<path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
									</svg>
			                    </button>
		                    </span>
						))
					}
				</div>
			</div>
		</div>
	);
}

function ActiveFilters({taskFilter}) {
	// const taskFilter = useQCManagerTaskFilterDraftSlice()
	const selectedChannels = taskFilter?.channels
	const selectedThreads = taskFilter?.threads
	const selectedDateRange = taskFilter?.dateRange
	const selectedIceFeedback = taskFilter?.iceFeedback

	return (
		<div className="bg-gray-100">
			{/* Channels Filter  */}
			{ selectedChannels?.length > 0 && <SelectedChannels selectedChannels={selectedChannels} />}

			{/* Selected Threads */}
			{ selectedThreads?.length > 0 && <SelectedThreads selectedThreads={selectedThreads} />}

			{/* Selected Date Range Threads */}
			{ selectedDateRange?.from && selectedDateRange?.to && <SelectedDateRangeContent selectedDateRange={selectedDateRange} />}

			{/* Selected Date Range Threads */}
			{ selectedIceFeedback?.length > 0 && <SelectedIceFeedbackFilterContent selectedIceFeedback={selectedIceFeedback} />}
		</div>
	);
}

function IceFeedbackSelection({ onSelected }) {
	const [searchText, setSearchText] = useState("")

	const iceSelectionOptions = [
		{id: 1, name: 'Y', selected: false },
		{id: 2, name: 'N', selected: false },
		{id: 3, name: 'All', selected: false },
	]
	return (
		<MultipleSelectMenu
			id={`iceFeedback`}
			label={'IceFeedback'}
			options={iceSelectionOptions}
			onSelected={(item) => onSelected(item)}
			displaySelectedPreviewContent={false}
			setSearchText={setSearchText}
		/>
	);
}

export default function QCManagerThreadListFilter({ workspaceId,setStaticFilterData,staticFilterDate }) {
	const [open, setOpen] = useState(true)
	// const taskFilter = useQCManagerTaskFilterDraftSlice()
	// const dispatch = useDispatch()

	const [selectedAgent,setSelectedAgent] = useState(null)
	const [selectedTags,setSelectedTags] = useState(null)
	useEffect(() => {
		if(selectedAgent && Object.keys(selectedAgent).length>0 && selectedAgent.id !== "all"){
			setStaticFilterData({
				...staticFilterDate,
				agents: [selectedAgent]
			})
		}else{
			setStaticFilterData({
				...staticFilterDate,
				agents: []
			})
		}

	}, [selectedAgent])


	const handleChannelSelection = (channels) => {
		setStaticFilterData({
			...staticFilterDate,
			channels: channels
		})
	}

	const handleThreadSelection = (threads) => {
		setStaticFilterData({
			...staticFilterDate,
			threads: threads
		})
	}

	const handleDateRangeSelection = (dateRange) => {
		setStaticFilterData({
			...staticFilterDate,
			dateRange: dateRange
		})
	}

	const handleIceFeedbackSelection = (iceFeedback) => {
		setStaticFilterData({
			...staticFilterDate,
			iceFeedback: collect(iceFeedback).unique('id').toArray()
		})
	}


	return (
		<div className="bg-white">

			{/* Mobile filter dialog */}
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="translate-x-full"
						>
							<Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
								<div className="flex items-center justify-between px-4">
									<h2 className="text-lg font-medium text-gray-900">Filters</h2>
									<button
										type="button"
										className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
										onClick={() => setOpen(false)}
									>
										<span className="sr-only">Close menu</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>

								{/* Filters */}
								<form className="mt-4">
									{filters.map((section) => (
										<Disclosure as="div" key={section.name} className="border-t border-gray-200 px-4 py-6">
											{({ open }) => (
												<>
													<h3 className="-mx-2 -my-3 flow-root">
														<Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
															<span className="font-medium text-gray-900">{section.name}</span>
															<span className="ml-6 flex items-center">
								                                <ChevronDownIcon
									                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
									                                aria-hidden="true"
								                                />
								                              </span>
														</Disclosure.Button>
													</h3>
													<Disclosure.Panel className="pt-6">
														<div className="space-y-6">
															{section.options.map((option, optionIdx) => (
																<div key={option.value} className="flex items-center">
																	<input
																		id={`filter-mobile-${section.id}-${optionIdx}`}
																		name={`${section.id}[]`}
																		defaultValue={option.value}
																		type="checkbox"
																		defaultChecked={option.checked}
																		className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																	/>
																	<label
																		htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
																		className="ml-3 text-sm text-gray-500"
																	>
																		{option.label}
																	</label>
																</div>
															))}
														</div>
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									))}
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>


			<div>
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">QCManager Dashboard</h1>
				</div>

				{/* Desktop Filters */}
				<section aria-labelledby="filter-heading">
					<div className="border-b border-gray-200 bg-white pb-4">
						<div className="mx-auto flex max-w-7xl items-center gap-x-10 px-4 sm:px-6 lg:px-8">
							<div className="relative inline-block text-left">
								<WorkspaceChannelSelectionDropDown
									workspaceId={workspaceId}
									onSelected={handleChannelSelection}
								/>
							</div>

							<div className="relative inline-block text-left">
								<WorkspaceChannelThreadSelectionDropDown
									workspaceId={workspaceId}
									onSelected={handleThreadSelection}
									channels={staticFilterDate?.channels}
								/>
							</div>

							<div className="relative inline-block text-left">
								<DateRangePickerComponent
									onSelected={handleDateRangeSelection}
								/>
							</div>

							{/*<div className="relative inline-block text-left">*/}
							{/*	<IceFeedbackSelection onSelected={handleIceFeedbackSelection} />*/}
							{/*</div>*/}

							<div className="relative inline-block text-left">
								<div>
									<AgentUserSelection
										workspaceId={workspaceId}
										onSelect={setSelectedAgent}
									/>
								</div>
							</div>
							
							<div className="relative inline-block text-left">
								<div>
									<MultipleTagSelect onSelected={setSelectedTags} channelId={staticFilterDate?.channels} /> 
								</div>
							</div>
						</div>
					</div>

					{/* Active filters */}
					<ActiveFilters
						taskFilter={staticFilterDate}/>
				</section>
			</div>
		</div>
	)
}
