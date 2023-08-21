import React from "react";

export default function MessengerChatReplayWindow(){
	return (
		<div className="p-4 border-t">
			<form className="flex">
				<input
					className="flex-1 px-2 py-1 border border-gray-300 rounded"
					type="text"
					placeholder="Type your message..."
				/>
				<button
					className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
					type="submit"
				>
					Send
				</button>
			</form>
		</div>
	)
}