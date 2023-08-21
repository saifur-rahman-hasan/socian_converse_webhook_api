import {useGetThreadsByConversationIdQuery} from '@/store/features/messenger/MessengerAPISlice'
import Dump from "@/components/Dump";
import EmptyStates from "@/components/ui/EmptyStates";
import ConversationThreadListItem from "@/components/Converse/ConverseMessengerApp/ConversationThreadListItem";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import {useEffect, useState} from "react";
import collect from "collect.js";
import AssignTaskToAgentComponent from "@/components/Converse/Tasks/AssignTaskToAgentComponent";
import {useSelector} from "react-redux";

export default function ConversationThreadsList({ chatWindowData }) {
    const {
        workspaceId,
        channelId,
        conversationId,
    } = chatWindowData

    const {
        data: threadsData,
        isLoading: threadsDataIsLoading,
        isFetching: threadsDataIsFetching,
        isSuccess: threadsDataFetchSuccess,
        error: threadsDataFetchError,
        refetch: threadsDataRefetch
    } = useGetThreadsByConversationIdQuery({
        workspaceId,
        channelId,
        conversationId
    })


    // refreshing data when assignment dialog closed
    const isTaskDialogClosed = useSelector((state:any) => state?.tasks?.assign_task_modal?.isOpen);
    useEffect(() => {
        if(!isTaskDialogClosed){
            threadsDataRefetch()
        }
    }, [isTaskDialogClosed]);


    return (
        <>
            <AssignTaskToAgentComponent/>

            { threadsDataIsLoading && <DefaultSkeleton className={'py-4'} /> }
            { !threadsDataIsLoading && threadsDataIsFetching && <DefaultSkeleton className={'py-4'} /> }

            { !threadsDataIsLoading && !threadsDataIsFetching && threadsDataFetchError && <Dump data={{threadsDataFetchError}} title={'threadsDataFetchError'} className={`my-1`} />}
            { !threadsDataIsLoading && !threadsDataIsFetching && threadsDataFetchSuccess && !threadsData?.length && <EmptyStates /> }
            { !threadsDataIsLoading && !threadsDataIsFetching && threadsDataFetchSuccess && threadsData?.length > 0 && (
                <ThreadsList
                    threads={threadsData}
                    workspaceId={workspaceId}
                    channelId={channelId}
                    conversationId={conversationId}
                />
            )}
        </>
    )
}

function ThreadsList({ threads, workspaceId, channelId, conversationId }) {
    const [filteredThreadsList, setFilteredThreadsList] = useState([])

    useEffect(() => {
        if(threads?.length > 0){
            const filteredThreads = collect(threads)
                .sortByDesc('createdAt')
                .toArray()

            setFilteredThreadsList(filteredThreads)
        }
    }, [threads])

    return (
        <ul role="list" className="divide-y divide-gray-100">
            {filteredThreadsList.map((thread) => (
                <ConversationThreadListItem key={`conversation_thread_${thread.id}`} thread={thread} />
            ))}
        </ul>
    );
}
