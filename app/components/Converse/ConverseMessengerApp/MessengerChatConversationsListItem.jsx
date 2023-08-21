"use client"

import DefaultGravatar from "@/components/DefaultGravatar";
import {useDispatch} from "react-redux";
import {activateChatWindow, editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import {formatTimestampToAgo} from "@/utils/helperFunctions";
import {MessageTime} from "@/components/messenger/MessengerChatMessageItem";
import { useState} from "react";
import {useGetAssignedTaskByThreadIdQuery} from "@/store/features/messenger/MessengerAPISlice";

function ShowTimeAgo(time) {
    return (
        <time>{ formatTimestampToAgo(time) }</time>
    );
}

function ConversationAssignedFlag({ taskState}) {
    if (taskState === 'Assignable'){
        return(<div className="w-2 h-2 bg-green-500 rounded-full"></div>)
    }else if(taskState === 'Assigned'){
        return (<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>)
    }else if(taskState === 'Closed'){
        return (<div className="w-2 h-2 bg-red-500 rounded-full"></div>)
    }else{
        return (<div className="w-2 h-2 bg-black-400 rounded-full"></div>)
    }

}

export default function MessengerChatConversationsListItem({ conversation }){
    const dispatch = useDispatch()
    const { workspaceId, channelId, _id: conversationId } = conversation

    async function handleConversationSelect(conversation) {
        const conversationCurrentThreadId = conversation?.currentThreadId || null
        if(!conversationCurrentThreadId){
            dispatch(activateChatWindow({
                workspaceId,
                channelId,
                conversationId,
                currentThreadId: null,
                activeThreadId: null,
                activityTab: 'threads',
                userActivityType: 'preview_all_threads'
            }))
        }else{
            dispatch(activateChatWindow({
                workspaceId,
                channelId,
                conversationId,
                currentThreadId: conversationCurrentThreadId,
                activeThreadId: conversationCurrentThreadId,
                activityTab: 'threads',
                userActivityType: 'preview_all_threads'
            }))
        }
    }

    return (
        <li
            key={`conversations_uid_${conversation._id}`}
            onClick={() => handleConversationSelect(conversation) }
        >
            <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500 hover:bg-gray-50 cursor-pointer">
                <div className="flex-shrink-0">
                    <DefaultGravatar className="h-8 w-8 rounded-full" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className={`flex items-center justify-between`}>
                            <div className="flex-auto text-sm font-medium text-gray-900">
                                <div>
                                    {conversation.participants[0].name}
                                </div>
                            </div>


                            <div className={`flex items-center gap-x-2`}>
                                <ConversationAssignedFlag
                                    taskState={conversation?.taskState}
                                    />

                                <MessageTime timestamp={conversation?.updatedAt} />
                            </div>
                        </div>

                        <p className="truncate text-sm text-gray-500">
                            {conversation?.lastMessage?.content}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    )
}