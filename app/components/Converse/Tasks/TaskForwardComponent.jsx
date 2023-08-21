import {Fragment, useEffect, useState} from "react";
import {useGetWorkspaceTeamMembersQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {Listbox, Transition} from "@headlessui/react";
import classNames from "@/utils/classNames";
import {CheckIcon, ChevronUpDownIcon, Square2StackIcon} from "@heroicons/react/24/outline";
import TeamUserSelectionListComponent from "@/components/Converse/Tasks/UserSelectionListComponent";
import {closeAssignTaskModal} from "@/store/features/tasks/tasksSlice";
import {useGetUsersQuery} from "@/store/features/user/UserAPISlice";

const TaskForwardComponent = ({handleSelectedUser,handleSubmitButton,handleCancelButton, workspaceId,formError,assigned_user_id}) => {
    const [alreadyAssignedAgent, setAlreadyAssignedAgent] = useState({})

    const {
        data: userData,
        isLoading: userDataIsLoading,
        error: userDataFetchError,
        refetch: refetchUserData
    } = useGetUsersQuery({
        user_id: assigned_user_id
    },{skip:!assigned_user_id})


    useEffect(() => {
        if (userData) {
            setAlreadyAssignedAgent(userData)
        }
    }, [userData]);

    return (
        <div>
            <div className="text-center mb-8">
                <Square2StackIcon className="mx-auto h-12 w-12 text-gray-400"/>
                <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">Forward Thread
                    Task</h2>
                <p className="mt-1 text-sm text-gray-500">You haven’t assigned any team members to
                    this thread yet.</p>
            </div>
            {Object.keys(alreadyAssignedAgent).length>0 ? (
                <div className="mb-8">
                    <span className="block text-sm font-medium leading-6 text-gray-900 mb-2">Forward From</span>
                    <span className="flex flex-col">
                                            <span className="flex items-center">
                                                <span
                                                    aria-label={'Online'}
                                                    className={classNames(
                                                        'bg-green-400',
                                                        'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                                    )}
                                                />
                                                <span
                                                    className="ml-3 block truncate">{alreadyAssignedAgent?.name + "( " + alreadyAssignedAgent?.email + " )"}</span>
                                            </span>
                        {/*<span*/}
                        {/*    className="block truncate">Role : {alreadyAssignedAgent?.role} || Team : {alreadyAssignedAgent?.team?.name}</span>*/}
                                        </span>
                </div>
            ):(<></>)}
            <div className="mb-12">
                <TeamUserSelectionListComponent handleSelectedUser={handleSelectedUser} workspaceId={workspaceId} label={"Forward to"}/>
            </div>
            <div>
                {formError !== "" ? (
                    <p className="text-red-500 text-sm mt-1 sm:flex sm:flex-row-reverse">{formError}</p>) : (
                    <p></p>)}
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={(event) => handleSubmitButton(event)}
                >
                    Forward Now
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => handleCancelButton(event)}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default TaskForwardComponent;
