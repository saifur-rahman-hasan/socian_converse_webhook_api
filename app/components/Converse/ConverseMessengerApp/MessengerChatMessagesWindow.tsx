import MessengerChatMessages from "@/components/Converse/ConverseMessengerApp/MessengerChatMessages";
import MessengerReplayForm from "@/components/Converse/ConverseMessengerApp/MessengerReplayForm";
import React from "react";

export default function MessengerChatMessagesWindow({ chatWindowData, agentId }){
    return (
        <div className="flex flex-col h-screen">
            <header className="sticky top-0 z-10">
                {/*<MessengerToolbar />*/}
            </header>

            <div className="flex-grow overflow-y-auto">
                <MessengerChatMessages chatWindowData={chatWindowData} />
            </div>

            <footer className="sticky bottom-0 z-10 pb-10">
                <MessengerReplayForm />
            </footer>
        </div>
    )
}