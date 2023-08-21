import {Fragment, useEffect, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserPlusIcon} from "@heroicons/react/24/solid";
import { Switch } from '@headlessui/react'
import classNames from "@/utils/classNames";
import SelectMenu from "@/components/ui/forms/SelectMenu";
import {
	useCreateWorkspaceTeamMemberMutation,
} from "@/store/features/workspace/WorkspaceAPISlice";
import Dump from "@/components/Dump";
import {useGetRolesQuery,useGetPermissionsQuery} from "@/store/features/authorization/AuthorizationApiSlice";
import {useRouter} from "next/router";
import MultipleSelectMenu from '@/components/ui/forms/multipleSelectManu';

export default function WorkspaceEditTeamMemberFormModal({ workspaceId, workspaceTeams, memberData }) {
	const router = useRouter()
	const [teamsList, setTeamsList] = useState([])
	const [rolesList, setRolesList] = useState([])
	const [permissionsList, setPermissionsList] = useState([])
	const [errorMessage, setErrorMessage] = useState('')
	const { data: rolesData } = useGetRolesQuery()
	const { data: permissionsData } = useGetPermissionsQuery()

	const [name, setName] = useState(memberData?.use?.name)
	const [email, setEmail] = useState('')
	const [team, setTeam] = useState('')
	const [selectedRoles, setSelectedRoles] = useState([])
	const [selectedPermissions, setSelectedPermissions] = useState([])
	const [active, setActive] = useState(true)
	const [open, setOpen] = useState(true)
	const [searchText, setSearchText] = useState("")
	const cancelButtonRef = useRef(null)

	useEffect(() => {
		if(workspaceTeams?.length > 0){
			const teamsData = workspaceTeams.map(team => { return {id: team.id, name: team.name, workspaceId: team.workspaceId} })
			setTeamsList(teamsData)
		}
	}, [workspaceTeams])

	useEffect(() => {
		if(rolesData?.length > 0){
			setRolesList(rolesData)
		}
	}, [rolesData])
	
	useEffect(() => {
		if(permissionsData?.length > 0){
			setPermissionsList(permissionsData)
		}
	}, [permissionsData])

	const [
		addMemberToTeam,
		{
			isLoading: addMemberToTeamIsLoading,
			error: addMemberToTeamError
		}
	] = useCreateWorkspaceTeamMemberMutation();

	const handleWorkspaceTeamSubmit = async (e) => {
		e.preventDefault()

		const memberData = {
			workspaceId: workspaceId,
			teamId: team.id,
			user: {
				name,
				email,
				selectedRoles,
				selectedPermissions
			}
		}

		const userCreateResponse = await addMemberToTeam(memberData)

		if(userCreateResponse?.data?.success === true){
			setOpen(false)
			setErrorMessage('')
		}else if(userCreateResponse?.error){
			setErrorMessage(userCreateResponse?.error.data.message)
		}

	}

	return (
		<>
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
													Add Team Member
												</Dialog.Title>
											</div>

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
														placeholder="Jane Smith"
														value={name}
														onChange={(e) => setName(e.target.value)}
														required
													/>
												</div>

												<div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
													<label htmlFor="name" className="block text-xs font-medium text-gray-900">
														Email
													</label>
													<input
														type="email"
														name="email"
														id="email"
														className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
														placeholder="your@email.com"
														onChange={(e) => setEmail(e.target.value)}
														required
													/>
												</div>

												<div className={`mb-4`}>
													<SelectMenu
														label={`Select Team`}
														options={teamsList}
														onSelected={setTeam} />
												</div>

												<div className={`mb-4`}>
													<MultipleSelectMenu
														label={`Select Rolessss`}
														options={rolesList}
														onSelected={setSelectedRoles} setSearchText={setSearchText} isLoading={false} />
												</div>
												
												<div className={`mb-4`}>
													<MultipleSelectMenu
														label={`Select Permission`}
														options={permissionsList}
														onSelected={setSelectedPermissions} setSearchText={setSearchText} isLoading={false}/>
												</div>

												<Switch.Group as="div" className="flex items-center justify-between">
													<span className="flex flex-grow flex-col">
												        <Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900" passive>
												          Activate Account
												        </Switch.Label>

												        <Switch.Description as="span" className="text-sm text-gray-500">
												          Only active user will be able to use this workspace
												        </Switch.Description>
											        </span>

													<Switch
														checked={active}
														onChange={setActive}
														className={classNames(
															active ? 'bg-green-600' : 'bg-gray-200',
															'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
														)}
													>
												        <span
													        aria-hidden="true"
													        className={classNames(
														        active ? 'translate-x-5' : 'translate-x-0',
														        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
													        )}
												        />
													</Switch>
												</Switch.Group>

											</div>
										</div>

										{errorMessage && <Dump className={`mt-3 rounded`} data={errorMessage} />}


										<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
											<button
												type="submit"
												className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
												disabled={addMemberToTeamIsLoading}
											>
												{ addMemberToTeamIsLoading ? 'Please wait...' : 'Add New Member' }
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
		</>
	)
}
