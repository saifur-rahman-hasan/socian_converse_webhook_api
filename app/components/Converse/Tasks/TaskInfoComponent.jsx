import {Fragment, useEffect, useState} from "react";
import {useGetWorkspaceTeamMembersQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {Listbox, Transition} from "@headlessui/react";
import classNames from "@/utils/classNames";
import {CheckIcon, ChevronUpDownIcon, Square2StackIcon} from "@heroicons/react/24/outline";
import TeamUserSelectionListComponent from "@/components/Converse/Tasks/UserSelectionListComponent";
import {closeAssignTaskModal} from "@/store/features/tasks/tasksSlice";
import {useGetUsersQuery} from "@/store/features/user/UserAPISlice";
import TaskCreateComponent from "@/components/Converse/Tasks/TaskCreateComponent";
import TaskForwardComponent from "@/components/Converse/Tasks/TaskForwardComponent";
import {
    useAssignTaskMutation,
    useCreateTaskMutation, useForwardTaskMutation,
    useGetTaskByThreadIdQuery
} from "@/store/features/tasks/TasksAPISlice";
import TaskAssignComponent from "@/components/Converse/Tasks/TaskAssignComponent";
import {showErrorPopUp} from "@/store/features/global/globalSlice";
import {useSession} from "next-auth/react";

const TaskInfoComponent = ({thread_id, workspace_id, onTaskInfoClose, showAction}) => {
    const {data: sessionData} = useSession()
    const agentId = parseInt(sessionData?.user?.id || 0);
    const [createTaskApi, {
        isLoading: createTaskApiIsCreating,
        error: createTaskApiCreateError
    }] = useCreateTaskMutation()

    const [assignTaskApi, {
        isLoading: assignTaskApiIsCreating,
        error: assignTaskApiCreateError
    }] = useAssignTaskMutation()

    const [forwardTaskApi, {
        isLoading: forwardTaskApiIsCreating,
        error: forwardTaskApiCreateError
    }] = useForwardTaskMutation()


    const [formError, setFormError] = useState('');

    const [threadTask, setThreadTask] = useState({})
    const [actionType, setActionType] = useState('')
    const {
        data: threadTaskData,
        isLoading: threadTaskDataIsLoading,
        error: threadTaskDataFetchError,
        refetch: threadTaskDataRefetch
    } = useGetTaskByThreadIdQuery({
        thread_id: thread_id
    }, {skip: !thread_id})

    useEffect(() => {
        if (threadTaskData !== null && threadTaskData !== undefined && Object.keys(threadTaskData).length > 0) {
            const {assignable, assignedAgentId, taskStatus, assigned, assignedTaskIsClosed} = threadTaskData
            if (assignedTaskIsClosed) {
                setActionType('close')
            }
            if (taskStatus === 'new' && assignable) {
                setActionType('assign')

            }
            if (!assignable && assigned) {
                if (assignedAgentId === agentId) {
                    setActionType('forward')
                }
            }
            // if (action === '') {
            //     setActionType('close')
            // }


            setThreadTask(threadTaskData)
        } else {
            setActionType('create')
            setThreadTask({})
        }
        // setActions()
    }, [threadTaskData]);


    const [selectedMember, setSelectedMember] = useState({})

    async function handleSubmitButton() {
        if (!selectedMember || Object.keys(selectedMember).length === 0 || !selectedMember?.user?.id) {
            setFormError("Select Agent...!")
            return
        }
        if (actionType === 'create') {
            const result = await createTaskApi({
                threadId: thread_id,
                agentId: selectedMember.user.id
            });
            // showPopup(result)
        } else if (actionType === 'assign') {
            const result = await assignTaskApi({
                threadId: thread_id,
                agentId: selectedMember.user.id
            });
            // showPopup(result)
        } else if (actionType === 'forward') {
            const result = await forwardTaskApi({
                threadId: thread_id,
                fromAgentId: threadTask?.assignedAgentId,
                toAgentId: selectedMember.user.id
            });
        } else {

        }
        onTaskInfoClose()
    }

    async function handleCancelButton() {
        onTaskInfoClose()
    }

    function handleSelectedUser(user) {
        setSelectedMember(user)
    }

    if (showAction !== null && showAction !== undefined && showAction !== "") {
        if (actionType !== showAction) {
            if (showAction === 'create') {
                return (<div>You can't create task...!<br/>Task is in {actionType} state</div>)
            } else if (showAction === 'assign') {
                return (<div>You can't assign task...!<br/>Task is in {actionType} state</div>)
            } else if (showAction === 'forward') {
                return (<div>You can't forward task...!<br/>Task is in {actionType} state</div>)
            } else if (showAction === 'close') {
                return (<div>Task Already Closed...!<br/>Task is in {actionType} state</div>)
            } else {
                return (<div>Unknown action provided</div>)
            }
        }
    }

    if (actionType === 'create') {
        return (
            <TaskCreateComponent
                handleSelectedUser={handleSelectedUser}
                handleSubmitButton={handleSubmitButton}
                handleCancelButton={handleCancelButton}
                workspaceId={workspace_id}
                formError={formError}
            />
        )
    } else if (actionType === 'assign') {
        return (
            <TaskAssignComponent
                handleSelectedUser={handleSelectedUser}
                handleSubmitButton={handleSubmitButton}
                handleCancelButton={handleCancelButton}
                workspaceId={workspace_id}
                formError={formError}
            />
        )
    } else if (actionType === 'forward') {
        return (<TaskForwardComponent
            handleSelectedUser={handleSelectedUser}
            handleSubmitButton={handleSubmitButton}
            handleCancelButton={handleCancelButton}
            workspaceId={workspace_id}
            formError={formError}
            assigned_user_id={threadTask?.assignedAgentId}
        />)
    } else if (actionType === 'close') {
        return (<div>Task Closed...!</div>)
    } else {
        // close state
        return (<div>Task Action Not found...!</div>)
    }
};

export default TaskInfoComponent;
