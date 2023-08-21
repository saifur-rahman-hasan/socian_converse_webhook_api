import {Fragment, useState} from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ExclamationTriangleIcon, FolderIcon, LifebuoyIcon } from '@heroicons/react/24/outline'
import classNames from "../../../utils/classNames";
import {ChevronUpDownIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import {useGetWorkspaceByIdQuery, useGetWorkspacesQuery} from "../../../store/features/workspace/WorkspaceAPISlice";
import {useSession} from "next-auth/react";
import {useDispatch, useSelector} from "react-redux";
import {increment} from "../../../store/features/counter/counterSlice";

function WorkspacesSelectionModal({ open, setOpen }) {
	const { data: session } = useSession()
	const { user_id: authId } = session
	const {
		data: workspaces,
		isLoading: workspacesIsLoading,
		error: workspacesError
	} = useGetWorkspacesQuery()

	const router = useRouter()
	const [rawQuery, setRawQuery] = useState('')
	const query = rawQuery.toLowerCase().replace(/^[#>]/, '')
	const counterValue = useSelector(state => {  })
	const dispatch = useDispatch()

	const filteredWorkspaces =
		rawQuery === '#'
			? workspaces
			: query === '' || rawQuery.startsWith('>')
				? workspaces
				: workspaces.filter((workspace) => workspace.name.toLowerCase().includes(query))

	let content = null
	if(workspacesIsLoading){
		content = <div className="block h-full w-full border-transparent py-2 pt-5 pl-8 pr-3 text-gray-600 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm">Loading your workspaces ...</div>
	}

	if(!workspacesIsLoading && workspacesError){
		content = <span>Error: { workspacesError }</span>
	}

	if (!workspacesIsLoading && !workspacesError && workspaces?.length <= 0){
		content = <span>You have no data</span>
	}

	const handleWorkspaceSelection = async (selectedWorkspace) => {
		dispatch(increment())
		setOpen(false)
		await router.push(`/workspaces/${selectedWorkspace?.id}`)
	}


	return (
		<Transition.Root show={open} as={Fragment} afterLeave={() => setRawQuery('')} appear>
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
					<div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
							<Combobox onChange={(item) => handleWorkspaceSelection(item)}>
								<div className="relative">
									<MagnifyingGlassIcon
										className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
										aria-hidden="true"
									/>
									<Combobox.Input
										className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
										placeholder="Search..."
										onChange={(event) => setRawQuery(event.target.value)}
									/>
								</div>

								{ filteredWorkspaces?.length > 0 && (
									<Combobox.Options
										static
										className="max-h-80 scroll-py-10 scroll-py-10 scroll-pb-2 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
									>
										<li>
											<h2 className="text-xs font-semibold text-gray-900">Workspaces</h2>
											<ul className="-mx-4 mt-2 text-sm text-gray-700">
												{filteredWorkspaces.map((workspace) => (
													<Combobox.Option
														key={workspace.id}
														value={workspace}
														className={({ active }) =>
															classNames(
																'flex cursor-default select-none items-center px-4 py-2',
																active && 'bg-indigo-600 text-white'
															)
														}
													>
														{({ active }) => (
															<>
																<FolderIcon
																	className={classNames('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-400')}
																	aria-hidden="true"
																/>
																<span className="ml-3 flex-auto truncate">{workspace.name}</span>
															</>
														)}
													</Combobox.Option>
												))}
											</ul>
										</li>
									</Combobox.Options>
								)}

								{rawQuery === '?' && (
									<div className="py-14 px-6 text-center text-sm sm:px-14">
										<LifebuoyIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
										<p className="mt-4 font-semibold text-gray-900">Help with searching</p>
										<p className="mt-2 text-gray-500">
											Use this tool to quickly search for users and projects across our entire platform. You can also
											use the search modifiers found in the footer below to limit the results to just users or projects.
										</p>
									</div>
								)}

								{query !== '' && rawQuery !== '?' && filteredProjects.length === 0 && filteredUsers.length === 0 && (
									<div className="py-14 px-6 text-center text-sm sm:px-14">
										<ExclamationTriangleIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
										<p className="mt-4 font-semibold text-gray-900">No results found</p>
										<p className="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
									</div>
								)}

								<div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-2 text-xs text-gray-700">
									<kbd
										className={classNames(
											'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
											rawQuery.startsWith('#') ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
										)}
									>
										+
									</kbd>{' '}
									<span className="sm:hidden">Add workspace</span>
									<span className="hidden sm:inline">New Workspace</span>
									<kbd
										className={classNames(
											'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
											rawQuery === '?' ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
										)}
									>
										?
									</kbd>{' '}
									for help.
								</div>
							</Combobox>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default function WorkspaceSelectionCommandPallet() {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const {  workspaceId } = router?.query

	// Define your RTK query hook
	const {
		data: workspaceData,
		isLoading: workspaceLoading,
		error: workspaceError
	} = useGetWorkspaceByIdQuery(workspaceId)

	let content = null
	if(workspaceLoading){
		content = (<div className={`py-5 pl-6 cursor-pointer`}>Loading....</div>)
	}

	if(!workspaceLoading && workspaceError){
		content = (<div className={`py-5 pl-6 cursor-pointer`}>Workspace load error</div>)
	}

	if(!workspaceLoading && !workspaceError && workspaceData?.id){
		content = (<div className={`py-5 pl-6 cursor-pointer`}>{workspaceData?.name}</div>)
	}

	return (
		<>
			<div className="relative w-full text-gray-400 focus-within:text-gray-600" onClick={() => setOpen(true)}>
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
					<span className="cursor-pointer absolute inset-y-0 left-0 flex items-center pr-2">
		                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</span>
				</div>

				{ content }
			</div>

			<WorkspacesSelectionModal open={open} setOpen={setOpen} />
		</>
	)
}
