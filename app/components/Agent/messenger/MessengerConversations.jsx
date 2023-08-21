import {BookmarkIcon} from "@heroicons/react/24/solid";
import classNames from "../../../utils/classNames";

export default function MessengerConversations({ messages }) {

	return (
		<div className="mt-6 flow-root pb-56">
			<ul role="list" className="-my-5 divide-y divide-gray-200">
				{messages.map((conversation, index) => (
					<li key={`conversation.message_${index}`} className={classNames(
						conversation?.agent_replay && "bg-gray-200",
						"py-4 px-8 hover:bg-gray-50"
					)}>
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<img className="h-8 w-8 rounded-full" src={conversation?.imageUrl} alt="" />
							</div>

							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-gray-900">{conversation?.name}</p>
								<p className="truncate text-sm text-gray-500">{conversation?.message}</p>
							</div>

							<div className={`text-right`} >
								<time className={`block truncate text-xs text-gray-400`}>{conversation?.time}</time>

								{
									index === 0 && (
										<div className={`mt-1 flex items-center`}>
												<span className="mx-1 inline-flex items-center rounded-full bg-blend-lighten px-2.5 py-0.5 text-xs font-medium text-indigo-800">
											        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
											          <circle cx={4} cy={4} r={3} />
											        </svg>

											        Sell
										        </span>

											<span className="mx-1 inline-flex items-center rounded-full px-2.5 text-xs font-medium text-indigo-800">
									        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
									          <circle cx={4} cy={4} r={3} />
									        </svg>

									        4G Sim
								        </span>

											<span className="mx-1 mr-0 inline-flex items-center rounded-full px-2.5 text-xs font-medium text-indigo-800">
									        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
									          <circle cx={4} cy={4} r={3} />
									        </svg>

									        e-sim
								        </span>

											<span className="mx-1 mr-0 inline-flex items-center rounded-full px-2.5 text-xs font-medium text-indigo-800">
									        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
									          <circle cx={4} cy={4} r={3} />
									        </svg>

									        Iphone 12
								        </span>

											<span className="mx-1 mr-0 inline-flex items-center px-2.5 text-xs font-medium text-gray-800">
													<BookmarkIcon className={`w-4 h-4 text-green-600`}/>
												</span>
										</div>
									)
								}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
