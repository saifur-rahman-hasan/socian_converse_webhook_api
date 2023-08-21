import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export default function ConversationViewMessagesButton({ isClosed = false }){
    const chatWindowData = useSelector((state: any) => state.messengerInstance.chat_window.data)
    const dispatch = useDispatch()


    function handleViewMessageClick(e) {
        e.preventDefault()

        dispatch(editChatWindow({
            ...chatWindowData,
            activityTab: 'chat',
            userActivityType: 'chat_on_thread',
            threadIsClosed: isClosed
        }))
    }

    return (
        <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleViewMessageClick}
        >
            View Messages
        </button>
    )
}