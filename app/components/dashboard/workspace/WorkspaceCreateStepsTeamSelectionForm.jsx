import {useLayoutEffect, useRef, useState, Fragment, useEffect} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classNames from "@/utils/classNames";
import { UserPlusIcon} from "@heroicons/react/24/solid";
import { Switch } from '@headlessui/react'
import SelectMenu from "@/components/ui/forms/SelectMenu";
import {useGetRolesQuery} from "@/store/features/authorization/AuthorizationApiSlice";
import {
    useGetDraftWorkspaceQuery, useGetWorkspaceTeamMembersQuery,
    useUpdateDraftWorkspaceMutation,useGetWorkspaceTeamsQuery,useCreateWorkspaceTeamMemberMutation,
    useCreateRevokeTeamMemberMutation,useCreateSwitchTeamMemberMutation
} from "@/store/features/workspace/WorkspaceAPISlice";
import {updateWorkspaceCreateActiveStep} from "@/store/features/workspace/WorkspaceSlice";
import {useDispatch} from "react-redux";
import Dump from "@/components/Dump";
import {useRouter} from "next/router";
import WorkspaceAddTeamMemberFormModal from "@/components/dashboard/workspace/WorkspaceAddTeamMemberFormModal";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";

export default function WorkspaceCreateStepsTeamSelectionForm({draftWorkspace}) {
    const router = useRouter()
    const {teamId} = router.query

    const {
        data: teamMembers,
        isLoading: teamMembersIsLoading,
        error: teamMembersFetchError,
        refetch: refetchTeamMembers
    } = useGetWorkspaceTeamMembersQuery({
        workspaceId: draftWorkspace?.id,
        teamId: teamId,
    })
    
    const {
        data: workspaceTeams,
        isLoading: workspaceTeamsIsLoading,
        error: workspaceTeamsFetchError,
        // refetch: refetchworkspaceTeams
    } = useGetWorkspaceTeamsQuery(draftWorkspace?.id)
    const { data: rolesData } = useGetRolesQuery()
    const {
        refetch: refetchDraftWorkspace
    } = useGetDraftWorkspaceQuery();

    const [updateDraftWorkspace, {
        isLoading: updatingWorkspace
    }] = useUpdateDraftWorkspaceMutation();

    const dispatch = useDispatch()

    const checkbox = useRef()
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedPeople, setSelectedPeople] = useState([])
    const [members, setMembers] = useState([])
    
	const [active, setActive] = useState(true)
    const cancelButtonRef = useRef(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalFor, setModalFor] = useState("")
    
    const [selectedUser, setSelectedUser] = useState({})
    const [userName, setUserName] = useState("")
    const [userMail, setUserMail] = useState("")
    const [userTeam, setUserTeam] = useState("")
    const [userRole, setUserRole] = useState("")
    const [userAcountActive, setUserAcountActive] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    
    const [teamsList, setTeamsList] = useState([])
	const [rolesList, setRolesList] = useState([])
	const [revokeMemberId, setRevokeMemberId] = useState(null)
    
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

    const [
		editMemberTeam,
		{
			isLoading: editMemberTeamIsLoading,
			error: editMemberTeamError
		}
	] = useCreateWorkspaceTeamMemberMutation();

    const handleWorkspaceTeamSubmit = async (e) => {
		e.preventDefault()
		const memberData = {
			workspaceId: draftWorkspace?.id,
			teamId: userTeam.id,
			userId: selectedUser?.userId,
			user: {
				userName,
				userMail,
				userRole,
			},
            raw:selectedUser,
            operationType:"update"
		}
		const userUpdateResponse = await editMemberTeam(memberData)

		if(userUpdateResponse?.data?.success === true){
			setModalOpen(false)
			setErrorMessage('')
		}else if(userUpdateResponse?.error){
            console.log(userUpdateResponse?.error.data.message);
			setErrorMessage(userUpdateResponse?.error.data.message)
		}
    }

    useLayoutEffect(() => {
        if (!teamMembersIsLoading && teamMembers?.length > 0) {
            setMembers(teamMembers)

            const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < members.length
            setChecked(selectedPeople.length === teamMembers.length)
            setIndeterminate(isIndeterminate)
            checkbox.current.indeterminate = isIndeterminate
        }
    }, [teamMembersIsLoading, teamMembers, selectedPeople])

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : members)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    const [revokeTeamMember, {
        isLoading: revokeTeamMemberIsLoading
    }] = useCreateRevokeTeamMemberMutation();

    const handleRevokeUser = async (member) => {
        const userConfirmed = window.confirm("Do you want to proceed?");
        if (userConfirmed) {
            setRevokeMemberId(member?.id)
            let memberData = {
                workspaceId: draftWorkspace?.id,
                teamId: userTeam.id,
                selectedUser: member,
            }
            const userRevokeResponse = await revokeTeamMember(memberData)

            if(userRevokeResponse?.data?.success === true){
                setErrorMessage('')
            }else if(userRevokeResponse?.error){
                console.log(userRevokeResponse?.error.data.message);
                setErrorMessage(userRevokeResponse?.error.data.message)
            }
        }
    }

    const [switchTeamMember, {
        isLoading: switchTeamMemberIsLoading
    }] = useCreateSwitchTeamMemberMutation();
    
    const handleSwitchTeam = async (e) => {
        e.preventDefault();
        let memberData = {
            workspaceId: draftWorkspace?.id,
            teamId: userTeam.id,
            userTeam: userTeam,
            selectedPeople: selectedPeople,
        }
        const userSwitchResponse = await switchTeamMember(memberData)
        if(userSwitchResponse?.data?.success === true){
            setErrorMessage('')
            setModalOpen(false)
        }else if(userSwitchResponse?.error){
            console.log(userSwitchResponse?.error.data.message);
            setErrorMessage(userSwitchResponse?.error.data.message)
        }
    }
    const handleNextClick = async () => {
        if (!draftWorkspace?.id) {
            alert(`Draft Workspace is missing...`)
            return false
        }

        const updatedWorkspace = await updateDraftWorkspace({
            workspaceId: draftWorkspace.id,
            members: selectedPeople
        });


        if (updatedWorkspace?.data?.id) {
            await refetchDraftWorkspace()

            await dispatch(updateWorkspaceCreateActiveStep({
                current_step_status: 'complete',
                next_active_step: 'integrations'
            }))

            await router.push({
                pathname: `/workspaces/create`,
                query: {
                    step: 'integrations'
                }
            })
        }

    }

    let content = null

    if (teamMembersIsLoading) {
        content = (
            <div
                className="px-3 py-2 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">Loading
                workspace members</div>
        )
    }

    if (!teamMembersIsLoading && teamMembersFetchError) {
        content = <Dump data={{teamMembersFetchError}}/>
    }

    if (!teamMembersIsLoading && !teamMembersFetchError && teamMembers?.length > 0) {
        content = (
            <div className="relative">
                {selectedPeople.length > 0 && (
                    <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                        <button
                            onClick={()=>{
                                setModalOpen(true)
                                setModalFor("Switch")
                            }}
                            type="button"
                            className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        >
                            Switch Team
                        </button>
                    </div>
                )}

                <table className="min-w-full table-fixed divide-y divide-gray-300">
                    <thead>
                    <tr>
                        <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                            <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                ref={checkbox}
                                checked={checked}
                                onChange={toggleAll}
                            />
                        </th>
                        <th scope="col"
                            className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                            Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Team
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Email
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Role
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {members.map((member,index) => (
                        <tr key={`workspace-team-member-${index}`}
                            className={selectedPeople.includes(member) ? 'bg-gray-50' : undefined}>
                            <td className="relative px-7 sm:w-12 sm:px-6">
                                {selectedPeople.includes(member) && (
                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"/>
                                )}
                                <input
                                    type="checkbox"
                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    value={member?.user?.email}
                                    checked={selectedPeople.includes(member)}
                                    onChange={(e) =>
                                        setSelectedPeople(
                                            e.target.checked
                                                ? [...selectedPeople, member]
                                                : selectedPeople.filter((p) => p !== member)
                                        )
                                    }
                                />
                            </td>
                            <td
                                className={classNames(
                                    'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                                    selectedPeople.includes(member) ? 'text-indigo-600' : 'text-gray-900'
                                )}
                            >
                                {member?.user?.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.team?.name}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.user.email}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{member.role}</td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                <button 
                                    className="text-indigo-600 hover:text-indigo-900" 
                                    onClick={() => {
                                        setModalOpen(true)
                                        setModalFor("Edit")
                                        setUserName(member.user.name)
                                        setUserMail(member.user.email)
                                        setSelectedUser(member)
                                    }}
                                >
                                    Edit
                                </button>

	                            {
									!revokeTeamMemberIsLoading && revokeMemberId == member?.id ? (
                                        <button
											className="text-indigo-600 hover:text-indigo-900 pl-3"
                                            disabled={true}
										>
											Wait...
										</button>
									) : (
										<button
											className="text-indigo-600 hover:text-indigo-900 pl-3"
											onClick={() => handleRevokeUser(member)}
										>
											Revoke
										</button>
									)
								}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="p-8 bg-white rounded-t-md shadow-md">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Team Members</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the users in your account including their name, title, email and role.
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-x-3">
                        <WorkspaceAddTeamMemberFormModal
                            workspaceId={draftWorkspace.id}
                            workspaceTeams={draftWorkspace.teams}
                        />
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            {content}
                        </div>
                    </div>
                </div>
            </div>

            {
                !teamMembersIsLoading && !teamMembersFetchError && teamMembers?.length > 0 && (
                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 shadow-md rounded-b-md border-t">
                        <button
                            onClick={handleNextClick}
                            disabled={updatingWorkspace}
                            className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {updatingWorkspace && 'Saving your team members...'}
                            {!updatingWorkspace && 'Next'}
                        </button>
                    </div>
                )
            }

            <Transition.Root show={modalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setModalOpen}>
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
                                    {modalFor == "Switch" && (
                                        <form onSubmit={handleSwitchTeam}>
                                            <div>
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <UserPlusIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                <div className="my-6 text-center sm:mt-5">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Switch Team
                                                    </Dialog.Title>
                                                </div>

                                                <div className="mt-2">
                                                    <div className={`mb-4`}>
                                                        <SelectMenu
                                                            label={`Switch To`}
                                                            options={teamsList}
                                                            onSelected={setUserTeam} />
                                                    </div>
                                                </div>
                                            </div>

                                            {errorMessage && <Dump className={`mt-3 rounded`} data={errorMessage} />}


                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                                <button
                                                    type="submit"
                                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                    disabled={editMemberTeamIsLoading}
                                                >
                                                    { editMemberTeamIsLoading ? 'Please wait...' : 'Update Member' }
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
                                    )}
                                    {modalFor == "Edit" && (
                                        <form onSubmit={handleWorkspaceTeamSubmit}>
                                            <div>
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <UserPlusIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                <div className="my-6 text-center sm:mt-5">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Edit Member
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
                                                            value={userName}
                                                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="Jane Smith"
                                                            disabled={true}
                                                            onChange={(e) => setUserName(e.target.value)}
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
                                                            disabled={true}
                                                            value={userMail}
                                                            onChange={(e) => setUserMail(e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <div className={`mb-4`}>
                                                        <SelectMenu
                                                            label={`Select Team`}
                                                            options={teamsList}
                                                            onSelected={setUserTeam} />
                                                    </div>

                                                    <div className={`mb-4`}>
                                                        <SelectMenu
                                                            label={`Select Role`}
                                                            options={rolesList}
                                                            onSelected={setUserRole} />
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
                                                    disabled={editMemberTeamIsLoading}
                                                >
                                                    { editMemberTeamIsLoading ? 'Please wait...' : 'Update Member' }
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
                                    )}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>

        </>

    )
}
