import {AtSymbolIcon, EnvelopeIcon} from "@heroicons/react/24/outline";

export default function MessengerChatTaskAssignedAgentsList({ draftTaskData }) {
	const people = draftTaskData?.teams

	return (
		<div>
			<div className="mt-6 flow-root">
				<ul role="list" className="-my-5 divide-y divide-gray-200">
					{people?.length > 0 && people.map((person) => (
						<li key={person.id} className="py-4">
							<div className="flex items-center space-x-4">
								<div className="flex-shrink-0">
									<img className="h-8 w-8 rounded-full" src={person.avatar} alt="" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900">{person.name}</p>
									<p className="truncate text-sm text-gray-500 flex gap-x-4">
										<span className={`flex items-center gap-x-2`}>
											<EnvelopeIcon className={`w-4 h-4`} />
											{ person.email }
										</span>
										<span className={`flex items-center gap-x-1`}>
											<AtSymbolIcon className={`w-4 h4-`} />
											{ person.role }
										</span>
									</p>
								</div>
								<div>
									<a
										href="#"
										className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
									>
										View
									</a>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>

			{
				people?.length > 3 && (
					<div className="mt-6">
						<a
							href="#"
							className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
						>
							View all
						</a>
					</div>
				)
			}
		</div>
	)
}
