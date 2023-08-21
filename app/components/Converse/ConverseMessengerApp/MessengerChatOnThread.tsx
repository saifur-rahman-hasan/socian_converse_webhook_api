import React from "react";
import MessengerReplayForm from "@/components/Converse/ConverseMessengerApp/MessengerReplayForm";
import MessengerToolbar from "@/components/Converse/ConverseMessengerApp/MessengerToolbar";
import MessengerChatMessages from "@/components/Converse/ConverseMessengerApp/MessengerChatMessages";

export default function MessengerChatOnThread({ chatWindowData, agentId }){
    return (
        <>
            <div className="flex-none bg-white">
                {/*<MessengerToolbar />*/}
            </div>

            <div className="flex-grow">
                <div className={`h-screen pb-20 overflow-y-auto`}>
                    <MessengerChatMessages chatWindowData={chatWindowData} />
                </div>
            </div>

            <div className="sticky bottom-0 bg-white">
                <MessengerReplayForm />
            </div>
        </>
    )
}