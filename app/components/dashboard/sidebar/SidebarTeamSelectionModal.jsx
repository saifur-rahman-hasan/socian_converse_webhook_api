
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CalendarIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { BarsArrowUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {ArrowLeftIcon, ArrowSmallLeftIcon} from "@heroicons/react/24/solid";
import {useGetTeamsQuery} from "../../../store/features/adminDashboard/AdminDashboardAPISlice";
import DefaultSkeleton from "../../ui/Skeleton/DefaultSkeleton";
import Dump from "../../Dump";
import Link from "next/link";
const positions = [
	{
		id: 1,
		title: 'Back End Developer',
		department: 'Engineering',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		applicants: [
			{
				name: 'Dries Vincent',
				email: 'dries.vincent@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Lindsay Walton',
				email: 'lindsay.walton@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Courtney Henry',
				email: 'courtney.henry@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Tom Cook',
				email: 'tom.cook@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
	{
		id: 2,
		title: 'Front End Developer',
		department: 'Engineering',
		closeDate: '2020-01-07',
		closeDateFull: 'January 7, 2020',
		applicants: [
			{
				name: 'Whitney Francis',
				email: 'whitney.francis@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Leonard Krasner',
				email: 'leonard.krasner@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Floyd Miles',
				email: 'floyd.miles@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
	{
		id: 3,
		title: 'User Interface Designer',
		department: 'Design',
		closeDate: '2020-01-14',
		closeDateFull: 'January 14, 2020',
		applicants: [
			{
				name: 'Emily Selman',
				email: 'emily.selman@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Kristin Watson',
				email: 'kristin.watson@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
			{
				name: 'Emma Dorsey',
				email: 'emma.dorsey@example.com',
				imageUrl:
					'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			},
		],
	},
]

export default function SidebarTeamSelectionModal() {
	const [open, setOpen] = useState(false)

	const { data: teams , isLoading: teamsQueryLoading, error: teamQueryError } = useGetTeamsQuery({ sort: 'desc', limit: 4 })

	let content = null;

	if(teamsQueryLoading){
		content = <DefaultSkeleton className={`my-5`} />
	}

	if(!teamsQueryLoading && teamQueryError){
		content = <div>Error : {teamQueryError}</div>
	}

	if(!teamsQueryLoading && !teamQueryError && teams?.length < 1){
		content = <div>No Data found</div>
	}

	if(!teamsQueryLoading && !teamQueryError && teams?.length > 0) {
		content = (<>
			<div className="divide-y divide-gray-200">
				{teams.map((team) => (
					<div key={`teams_list_${team?._id}`}>
						<Link href="/dashboard" className="block hover:bg-gray-50">
							<div className="flex items-center px-4 py-4 sm:px-6">
								<div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
									<div className="truncate">
										<div className="flex text-sm">
											<p className="truncate font-medium text-indigo-600">{team.name}</p>
											<p className="ml-1 flex-shrink-0 font-normal text-gray-500">in {team.color}</p>
										</div>
										<div className="mt-2 flex">
											<div className="flex items-center text-sm text-gray-500">
												<CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
												<p>
													Closing on
												</p>
											</div>
										</div>
									</div>
									<div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
										<div className="flex -space-x-1 overflow-hidden">
											{
												team?.members?.length > 0 && team.members.map((member) => (
													<img
														key={member.email}
														className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
														src={member.imageUrl}
														alt={member.name}
													/>
												))
											}
										</div>
									</div>
								</div>
								<div className="ml-5 flex-shrink-0">
									<ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</>)
	}

	return (
		<>
			<div
				className={`group flex items-center rounded-md px-9 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer`}
				onClick={() => setOpen(true)}
			>
				See more ...
			</div>

			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden bg-white transition-all">
									<button
										className={`text-left flex items-center gap-x-4 fixed top-8 left-20`}
										onClick={() => { setOpen(false) }}
									>
										<ArrowSmallLeftIcon className={`w-6 h-6`} />
										<span>Back</span>
									</button>

									<div className={`w-screen h-screen bg-gray-100 p-20 overflow-y-auto`}>
										<div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
											<h3 className="text-base font-semibold leading-6 text-gray-900">Your Teams</h3>
											<div className="mt-3 sm:mt-0 sm:ml-4">
												<label htmlFor="mobile-search-candidate" className="sr-only">
													Search
												</label>
												<label htmlFor="desktop-search-candidate" className="sr-only">
													Search
												</label>
												<div className="flex rounded-md shadow-sm">
													<div className="relative flex-grow focus-within:z-10">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
														</div>
														<input
															type="text"
															name="mobile-search-candidate"
															id="mobile-search-candidate"
															className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:hidden"
															placeholder="Search"
														/>
														<input
															type="text"
															name="desktop-search-candidate"
															id="desktop-search-candidate"
															className="hidden w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:block sm:text-sm"
															placeholder="Search candidates"
														/>
													</div>
													<button
														type="button"
														className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
													>
														<BarsArrowUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
														<span className="ml-2">Sort</span>
														<ChevronDownIcon className="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
													</button>
												</div>
											</div>
										</div>

										<div className="overflow-hidden bg-white shadow sm:rounded-md">
											<h4>Example</h4>
											<ul role="list" className="divide-y divide-gray-200">
												{positions.map((position) => (
													<li key={position.id}>
														<a href="#" className="block hover:bg-gray-50">
															<div className="flex items-center px-4 py-4 sm:px-6">
																<div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
																	<div className="truncate">
																		<div className="flex text-sm">
																			<p className="truncate font-medium text-indigo-600">{position.title}</p>
																			<p className="ml-1 flex-shrink-0 font-normal text-gray-500">in {position.department}</p>
																		</div>
																		<div className="mt-2 flex">
																			<div className="flex items-center text-sm text-gray-500">
																				<CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
																				<p>
																					Closing on <time dateTime={position.closeDate}>{position.closeDateFull}</time>
																				</p>
																			</div>
																		</div>
																	</div>
																	<div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
																		<div className="flex -space-x-1 overflow-hidden">
																			{position.applicants.map((applicant) => (
																				<img
																					key={applicant.email}
																					className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
																					src={applicant.imageUrl}
																					alt={applicant.name}
																				/>
																			))}
																		</div>
																	</div>
																</div>
																<div className="ml-5 flex-shrink-0">
																	<ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
																</div>
															</div>
														</a>
													</li>
												))}
											</ul>

											<hr/>
											<h4>Real</h4>
											{ content }
										</div>
									</div>

								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	)
}
