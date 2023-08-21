import ActiveTaskAsideStatus from "../Agent/AssignedTask/ActiveTaskAsideStatus";

export default function MessengerChatTaskOverview___REMOVE({ task }){
	return (
		<div className="flex-1">
			<div className="py-8 xl:py-10">
				<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-7xl xl:grid-cols-3">
					<div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">

					</div>

					{/* Aside Right */}
					<ActiveTaskAsideStatus />
				</div>
			</div>
		</div>
	)
}