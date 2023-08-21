import {Fragment, useEffect, useRef, useState} from 'react'
import {Dialog, Transition, Listbox} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon, Square2StackIcon} from '@heroicons/react/24/outline'
import {useDispatch, useSelector} from "react-redux";
import {closeAssignTaskModal, openAssignTaskModal} from "@/store/features/tasks/tasksSlice";
import {useGetWorkspaceTeamMembersQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import classNames from '@/utils/classNames'
import Dump from "@/components/Dump";
import {
    useAssignTaskMutation,
    useCreateTaskMutation,
    useForwardTaskMutation, useGetTaskByThreadIdQuery
} from "@/store/features/tasks/TasksAPISlice";
import {showErrorPopUp, showSuccessPopUp} from "@/store/features/global/globalSlice";
import {useGetUsersQuery} from "@/store/features/user/UserAPISlice";
import TeamUserSelectionListComponent from "@/components/Converse/Tasks/UserSelectionListComponent";
import TaskCreateComponent from "@/components/Converse/Tasks/TaskCreateComponent";
import TaskForwardComponent from "@/components/Converse/Tasks/TaskForwardComponent";
import TaskInfoComponent from "@/components/Converse/Tasks/TaskInfoComponent";

export default function AssignTaskToAgentComponent() {



    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    const [threadId, setThreadId] = useState(undefined)
    const [workspaceId, setWorkspaceId] = useState(undefined)

    const assign_task_modal = useSelector((state) => state.tasks.assign_task_modal);
    useEffect(() => {
        if (assign_task_modal?.thread_id) {
            setThreadId(assign_task_modal.thread_id);
        }
        if (assign_task_modal?.workspaceId) {
            setWorkspaceId(assign_task_modal.workspaceId);
        }
        setOpen(assign_task_modal.isOpen);
    }, [assign_task_modal]);

    function onTaskInfoClose(){
        dispatch(closeAssignTaskModal())
    }
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => dispatch(closeAssignTaskModal())}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                            <Dialog.Panel
                                className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <TaskInfoComponent
                                    thread_id={threadId}
                                    workspace_id={workspaceId}
                                    onTaskInfoClose={onTaskInfoClose}
                                    showAction={""}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
