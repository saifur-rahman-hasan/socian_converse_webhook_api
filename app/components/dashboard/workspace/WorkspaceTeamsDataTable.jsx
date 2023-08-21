import { Fragment,useState,useEffect,useRef } from "react";
import { Dialog, Transition } from '@headlessui/react'
import WorkspaceAddTeamMemberFormModal from "./WorkspaceAddTeamMemberFormModal"
import { UserPlusIcon} from "@heroicons/react/24/solid";
import {useGetWorkspaceTeamsQuery,useCreateWorkspaceTeamMutation} from "@/store/features/workspace/WorkspaceAPISlice";
import Link from "next/link";
import { PencilIcon,PlusIcon,ListBulletIcon } from "@heroicons/react/24/outline";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";


export default function WorkspaceTeamsDataTable({draftWorkspace}) {
	const cancelButtonRef = useRef(null)
	
	const {
		data: workspaceTeam,
		isLoading: workspaceTeamIsLoading
	} = useGetWorkspaceTeamsQuery(draftWorkspace?.id,{skip:!draftWorkspace?.id})
	const [workspaceTeamList, setWorkspaceTeamList] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const [modalShow, setModalShow] = useState(false)
	const [open, setOpen] = useState(false)
	const [modalFor, setModalFor] = useState("")
	const [name, setName] = useState('')
	// const { data: workspaceTeam } = ()
	const [createWorkspaceTeam, {
        isLoading: workspaceTeamCreateIsLoading
    }] = useCreateWorkspaceTeamMutation();

	const handleWorkspaceTeamSubmit = async (e) => {
		e.preventDefault()

		if (modalFor === "Create"){
			const createWorkTeam = await createWorkspaceTeam({
				workspaceId: draftWorkspace.id,
				name:name
			});
		}

		
		if (modalFor === "Update"){
			console.log("REQUEST TO EDIT");
		}
		setOpen(false)
	}

	useEffect(() => {
		if(workspaceTeam?.length > 0){
			setWorkspaceTeamList(workspaceTeam)
		}
	}, [workspaceTeam])

	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Teams</h1>
					<p className="mt-2 text-sm text-gray-700">
						Your workspace team and members
					</p>
				</div>
				<div className="mt-4 flex items-center gap-x-3">
					<button
						type="button"
						className="inline-flex rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={() => {
							setOpen(true)
							setModalFor("Create")
						}}
					>
						Add New Team
					</button>
				</div>
			</div>

			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
									Name
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Members
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
							</thead>

							{ workspaceTeamIsLoading && (
								<DefaultSkeleton className={`py-4`}/>
							)}

							<tbody className="divide-y divide-gray-200 bg-white border border-solid border-red-500 border-2">
								{workspaceTeamList?.map((team,index) => (
								<tr key={index}>
									<td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
										<div className="flex items-center">
											<div className="ml-4">
												<div className="font-medium text-gray-900">{team.name}</div>
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
										<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
											{team.members.length+" Member"}
										</span>
									</td>
									<td className="relative whitespace-nowrap py-5 pl-3 pr-4 px-3 text-center text-sm font-medium sm:pr-0">
										<span className="isolate inline-flex rounded-md shadow-sm">
											<Link
												href={`/workspaces/${draftWorkspace?.id}/teams/${team?.id}/member/`}
												className="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
											>
												<ListBulletIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
											</Link>
											<button
												type="button"
												onClick={()=> {
													setOpen(true)
													setModalFor("Update")
													setName(team.name)
												} }
												className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
											>
												<PencilIcon className="-ml-0.5 h-4 w-5 text-gray-400" aria-hidden="true" />
											</button>
										</span>
										
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				</div>
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
									<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">

										<form onSubmit={handleWorkspaceTeamSubmit}>
											<div>
												<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
													<UserPlusIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
												</div>
												<div className="my-6 text-center sm:mt-5">
													<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
														{modalFor}
													</Dialog.Title>
												</div>
												
												{modalFor === "Update" && (
													<div className="mt-2">

														<div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
															<label htmlFor="name" className="block text-xs font-medium text-gray-900">
																Name
															</label>
															<input
																type="text"
																name="name"
																id="name"
																value={name}
																className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
																placeholder="Jane Smith"
																onChange={(e) => setName(e.target.value)}
																required
															/>
														</div>
													</div>
												)}
												
												{modalFor === "Create" && (
													<div className="mt-2">

														<div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
															<label htmlFor="name" className="block text-xs font-medium text-gray-900">
																Name
															</label>
															<input
																type="text"
																name="name"
																id="name"
																className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
																placeholder="Slowly Smith"
																onChange={(e) => setName(e.target.value)}
																required
															/>
														</div>
													</div>
												)}
											</div>

											{errorMessage && <Dump className={`mt-3 rounded`} data={errorMessage} />}


											<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
												<button
													type="submit"
													className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
													// disabled={addMemberToTeamIsLoading}
												>
													{ modalFor }
												</button>

												<button
													type="button"
													className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
													onClick={() => setOpen(false)}
													ref={cancelButtonRef}
												>
													Cancel
												</button>
											</div>
										</form>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			</div>
		</div>
	)
}
