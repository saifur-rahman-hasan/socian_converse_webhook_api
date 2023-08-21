import React from "react";

export default function MessengerChatMessageItem({ sender, message, avatarUrl, timestamp, status }) {
	const isYou = sender === "You";

	return (
		<div className={`px-4 flex items-start justify-between py-4 border-b border-gray-300 ${isYou ? "bg-gray-200" : "bg-gray-100"}`}>
			<div className="flex items-center">
				<img
					className="w-8 h-8 rounded-full mr-2"
					src={avatarUrl}
					alt={`${sender}'s Avatar`}
				/>
				<div className="px-4 py-2 rounded-lg">
					<p className="text-gray-800">{message}</p>
					<div className="flex items-center mt-1">
						<span className="text-sm text-gray-500">{sender}</span>
						<span className="text-sm text-gray-500 ml-2">{timestamp}</span>
					</div>
				</div>
			</div>
			<div className="flex items-center">
				<span className="text-sm text-gray-500 mr-2">{status}</span>
				<button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Button</button>
			</div>
		</div>
	);
}
