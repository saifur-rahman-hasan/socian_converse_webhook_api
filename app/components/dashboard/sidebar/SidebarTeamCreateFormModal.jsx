import {Fragment, useEffect, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PlusCircleIcon} from '@heroicons/react/24/outline'
import {UserGroupIcon} from "@heroicons/react/24/solid";
import Dump from "../../Dump";
import {useCreateTeamMutation} from "../../../store/features/adminDashboard/AdminDashboardAPISlice";
import LoadingCircle from "../../ui/loading/LoadingCircle";

export default function SidebarTeamCreateFormModal() {
	const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)

	const [name, setName] = useState(null)
	const [about, setAbout] = useState(null)
	const [error, setError] = useState(null)

	const [
		createTeam, // This is the mutation trigger
		{ isLoading: isCreating }, // This is the destructured mutation result
	] = useCreateTeamMutation()

	useEffect(() => {
		if(open === false){
			setName(null)
			setAbout(null)
		}
	}, [open])

	const handleCreateTeam = async (e) => {
		e.preventDefault()

		if(! name ){
			setError("Team name is required.")
		}

		try {
			await createTeam({ name, about, color: 'gray' });
			setOpen(false)
		} catch (err) {
			setError(err?.message());
		}
	}

	return (
		<>
			<PlusCircleIcon className={`w-6 h-6 cursor-pointer hover:text-green-600`} onClick={() => setOpen(true)} />

			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
									<form onSubmit={handleCreateTeam}>
										<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
											<div className="sm:flex items-center">
												<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
													<UserGroupIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
												</div>
												<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														Create new Team
													</Dialog.Title>
												</div>
											</div>
										</div>

										<div className={`px-7 pb-10`}>
											<div className="space-y-8 ">
												<div className={`mt-4`}>
													<label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
														Team Name
													</label>
													<div className="mt-1">
														<input
															type="text"
															name="name"
															id="team-name"
															onChange={(e) => setName(e.target.value)}
															className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
															required={true}
															disabled={isCreating}
														/>
													</div>
												</div>

												<div className="mt-6 ">
													<label htmlFor="about" className="block text-sm font-medium text-gray-700">
														About your team <span className={`text-gray-400 text-[.9em]`}>(Optional)</span>
													</label>
													<div className="mt-1">
										                <textarea
											                id="about"
											                name="about"
											                rows={3}
											                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											                defaultValue={''}
											                onChange={(e) => setAbout(e.target.value)}
											                disabled={isCreating}
										                />
													</div>
													<p className="mt-2 text-sm text-gray-500">Write a few sentences about your team.</p>
												</div>
											</div>
										</div>

										{
											error && (
												<div className={`px-8 py-4 mb-10 bg-red-100`}>{ error }</div>
											)
										}

										<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
											{
												isCreating && (
													<button
														type={`button`}
														className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													>
														<LoadingCircle />
														<span>Creating your team ...</span>
													</button>
												)
											}

											{
												!isCreating && (
													<>
														<button
															type="submit"
															className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
														>
															Create Team
														</button>

														<button
															type="button"
															className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
															onClick={() => setOpen(false)}
															ref={cancelButtonRef}
														>
															Cancel
														</button>
													</>
												)
											}



										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>

	)
}
