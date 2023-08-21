import ActiveTaskAsideStatus from "@/components/Agent/AssignedTask/ActiveTaskAsideStatus";
import {
    useGetMessengerThreadInfoQuery,
} from "@/store/features/messenger/MessengerAPISlice";
import ConversationSingleThreadCardItem
    from "@/components/Converse/ConverseMessengerApp/ConversationSingleThreadCardItem";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import ConversationThreadActivityFeeds
    from "@/components/Converse/ConverseMessengerApp/ConversationThreadActivityFeeds";
import React, {useEffect} from "react";
import AgentStartActiveTaskActionButton from "@/components/Agent/AgentStartActiveTaskActionButton";
import {useCreateAgentActivityMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import AlertError from "@/components/ui/alerts/AlertError";
import ConversationViewMessagesButton from "@/components/Converse/ConverseMessengerApp/ConversationViewMessagesButton";
import useAuthUserSlice from "@/hooks/useAuthUserSlice";


export default function ConversationThreadPreview({ chatWindowData, canPreviewThreadMessages = false }){
    const {
        workspaceId,
        activeThreadId,
        agentId,
        taskDocId
    } = chatWindowData

    const {
        data: threadData,
        isLoading: threadIsLoading,
        isFetching: threadIsFetching,
        error: threadDataFetchError
    } = useGetMessengerThreadInfoQuery({
        threadId: activeThreadId,
        agentId: agentId
    }, {
        skip: !activeThreadId
    })

    const [createAgentActivity] = useCreateAgentActivityMutation()

    useEffect(() => {
        if(threadData?.id > 0 && agentId > 0 && threadData?.workspaceId > 0){
            createAgentActivity({
                agentId: agentId,
                workspaceId: threadData.workspaceId,
                channelId: threadData.channelId,
                conversationId: threadData.conversationId,
                threadId: threadData.id,
                activityGroup: 'messenger_inbox_access',
                activityType: 'task_opened',
                activityInfo: `Agent (${agentId}) opened the Thread (${threadData.id}) from workspace (${threadData.workspaceId})`,
                activityData: { time: new Date() }
            })
        }
    }, [threadData, agentId, createAgentActivity])

    return (
        <div className="flex-1 min-h-screen">

            <div className={`shadow px-8`}>

                {
                    (threadIsLoading || threadIsFetching) &&  <DefaultSkeleton className={`p-4`} />
                }


                {
                    ! threadIsLoading && !threadIsFetching && !threadDataFetchError && threadData?.id > 0 &&
                    <ConversationSingleThreadCardItem
                        thread={threadData}
                    />
                }
            </div>

            {
                !threadIsLoading &&
                !threadDataFetchError &&
                threadData?.id &&
                (
                    <div className="py-8 xl:py-10">

                        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-7xl xl:grid-cols-3">
                            <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
                                <ConversationThreadActivityFeeds
                                    chatWindowData={chatWindowData}
                                    thread={threadData} />

                                <ThreadCloseWarningMessage
                                    chatWindowData={chatWindowData}
                                    isClosed={threadData.isClosed && threadData?.task?.assigned && threadData?.task?.assignedTaskIsClosed} />

                                {/*{ !threadData.isClosed && threadData?.task?.assigned && !threadData?.task?.assignedTaskIsClosed && (*/}
                                {/*    <div className={`ml-9 my-10`}>*/}
                                {/*        <AgentAssignedTaskActions*/}
                                {/*            workspaceId={workspaceId}*/}
                                {/*            agentId={agentId}*/}
                                {/*            taskDocId={taskDocId}*/}
                                {/*            agentLog={threadData?.task?.agentLog || null}*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {
                                    canPreviewThreadMessages && (
                                        <div className={`ml-9 my-10`}>
                                            <ConversationViewMessagesButton isClosed={threadData.isClosed} />
                                        </div>
                                    )
                                }

                            </div>

                            {/* Aside Right */}
                            <ActiveTaskAsideStatus thread={threadData} />
                        </div>

                    </div>
                )
            }

        </div>
    )
}




function AgentAssignedTaskActions({ workspaceId, agentId, taskDocId, agentLog }) {
    return (
        <div className="rounded-md shadow-sm flex justify-between">

            { agentLog?.agentTaskAccepted === true && (
                <button
                    type="button"
                    className="w-full relative inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                >
                    Forward to Supervisor
                </button>
            ) }

            { !agentLog?.agentTaskAccepted && (
                <AgentStartActiveTaskActionButton
                    workspaceId={workspaceId}
                    agentId={agentId}
                    taskDocId={taskDocId}
                    className={''}
                    accepted={agentLog?.agentTaskAccepted || false}
                />
            ) }
        </div>
    );
}


function ThreadCloseWarningMessage({ chatWindowData, isClosed }) {

    if(!isClosed){
        return null
    }

    return (
        <div className={`ml-8`}>
            <AlertError
                className={`my-6 text-center text-red-600`}
                message={`Thread is closed`} />
        </div>
    );
}