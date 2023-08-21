import React from "react";
import MessengerChatWindow from "@/components/Converse/ConverseMessengerApp/MessengerChatWindow";
import MessengerEmptyChatWindow from "@/components/Converse/ConverseMessengerApp/MessengerEmptyChatWindow";

export default function AgentInboxChatWindow({ chatWindow, agentId }){
	return (
		<div>
			{
				chatWindow?.open === true &&
				chatWindow?.data?.workspaceId &&
				chatWindow?.data?.channelId &&
				chatWindow?.data?.conversationId &&
				chatWindow?.data?.currentThreadId &&
				(<MessengerChatWindow
					chatWindowData={chatWindow.data}
					agentId={agentId}
				/>)
			}

			{
				chatWindow?.open === false &&
				(<MessengerEmptyChatWindow
					message={`Select your assigned task and continue to work.`}
				/>)
			}
		</div>
	)
}