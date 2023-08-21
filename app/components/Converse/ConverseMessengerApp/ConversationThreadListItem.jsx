import Link from "next/link";
import DefaultGravatar from "@/components/DefaultGravatar";
import {CheckCircleIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ChatBubbleLeftIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import {useDispatch, useSelector} from "react-redux";
import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import moment from "moment";
import {LockOpenIcon, PlusIcon} from "@heroicons/react/20/solid";
import AssignTaskToAgentComponent from "@/components/Converse/Tasks/AssignTaskToAgentComponent";
import {closeAssignTaskModal, openAssignTaskModal} from "@/store/features/tasks/tasksSlice";
import {useGetWorkspaceTeamMembersQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {useEffect, useState} from "react";
import {useGetTaskByThreadIdQuery} from "@/store/features/tasks/TasksAPISlice";
import Dump from "@/components/Dump";
import {useSession} from "next-auth/react";
import ConversationThreadMessagesCount
    from "@/components/Converse/ConverseMessengerApp/ConversationThreadMessagesCount";

export default function ConversationThreadListItem({thread}) {


    const dispatch = useDispatch()
    const chatWindowData = useSelector(state => state.messengerInstance.chat_window.data)

    async function handleThreadSelection(thread) {
        await dispatch(
            editChatWindow({
                ...chatWindowData,
                activeThreadId: thread.id,
                userActivityType: 'preview_single_thread'
            })
        )
    }

    return (
        <li
            key={thread.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
        >
            <div>
                {/*<Dump data={{thread:thread,team_member_list:team_member_list,task_details:threadTask}}/>*/}
                <div className="flex items-center gap-x-4 text-sm leading-6 text-gray-900">
                    <div
                        onClick={() => handleThreadSelection(thread)}
                        className="hover:underline font-semibold cursor-pointer"
                    >
                        Thread: {thread?.query || thread?.id}
                    </div>

                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                        <circle cx={1} cy={1} r={1}/>
                    </svg>

                    <p className={`text-xs text-gray-400`}>
                        <time dateTime={thread?.createdAt}>
                            Last update: {moment(thread?.updatedAt).format('hh:mm A - DD/MM/YYYY')}
                        </time>
                    </p>
                </div>

                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p>
                        <Link
                            href={{
                                pathname: '/workspaces/[workspaceId]/converse',
                                query: {
                                    workspaceId: thread.workspaceId,
                                    channelId: thread.channelId,
                                    conversationId: thread.conversationId,
                                    threadId: thread?.id,
                                    activityTab: 'threads'
                                }
                            }}
                            className="hover:underline"
                        >
                            {thread.content}
                        </Link>
                    </p>

                </div>
            </div>

            <div className="flex w-full flex-none justify-between items-center gap-x-8 sm:w-auto">

                <ShowTaskAssignRelatedActionButtons thread={thread} />

                <ConversationThreadMessagesCount messageCount={thread?.messageCount} text={false} />

                <div className="flex">
                    {
                        thread?.isClosed
                            ? <LockClosedIcon className="h-6 w-6 text-red-400" aria-hidden="true"/>
                            : <LockOpenIcon className="h-6 w-6 text-green-400" aria-hidden="true"/>
                    }
                </div>
            </div>
        </li>

    )
}



// create,assign,forward,close
function ShowTaskAssignRelatedActionButtons({ thread }) {
    const {data: sessionData} = useSession()

    const dispatch = useDispatch()

    function handleAssignTaskClick(event) {
        event.preventDefault();
        if (thread?.id) {
            dispatch(openAssignTaskModal({thread_id: thread?.id, workspaceId: thread?.workspaceId}))
        }

    }

    let action = ''
    let actionTitle = ''

    if (thread && thread?.task && Object.keys(thread?.task).length > 0) {
        const {assignable, assignedAgentId, taskStatus, assigned, assignedTaskIsClosed} = thread?.task
        if (assignedTaskIsClosed) {
            action = 'close'
        }

        if (taskStatus === 'new' && assignable) {
            action = 'assign'
            actionTitle = 'Assign Task'
        }

        if (!assignable && assigned) {
            if (assignedAgentId === sessionData?.user?.id) {
                action = 'forward'
                actionTitle = 'Forward Task'
            }
        }

    } else {
        action = 'create'
        actionTitle = 'Create Task'
    }

    return (
        <div>
            {
                action && action !== '' && action !== 'close' &&
                (
                    <button
                        type="button"
                        onClick={(event) => handleAssignTaskClick(event)}
                        className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {actionTitle}
                        <PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true"/>
                    </button>
                )
            }
        </div>
    )
}