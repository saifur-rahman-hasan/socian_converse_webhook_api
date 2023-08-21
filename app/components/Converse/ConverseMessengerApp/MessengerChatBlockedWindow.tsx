// Chat blocked window component
export default function MessengerChatBlockedWindow() {
	return (
		<div className="w-full">
			<div className="relative w-full p-6 overflow-y-auto h-[40rem]">
				<div className="flex items-center justify-center h-full">
					<p className="text-gray-500">Please select a conversation.</p>
				</div>
			</div>
		</div>
	);
}