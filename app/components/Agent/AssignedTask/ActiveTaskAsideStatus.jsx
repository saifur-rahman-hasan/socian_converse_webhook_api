import {CalendarIcon, ChatBubbleLeftEllipsisIcon, LockOpenIcon} from "@heroicons/react/20/solid";
import {ClockIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import ActiveTaskFreezeTimer from "./ActiveTaskFreezeTimer";
import moment from "moment";
import DefaultGravatar from "@/components/DefaultGravatar";
import SocianContextSentiment from "@/components/SocianAI/SocianContextSentiment";
import SocianContextTopic from "@/components/SocianAI/SocianContextTopic";
import ConversationThreadPreviewTags from "@/components/Converse/ConverseMessengerApp/ConversationThreadPreviewTags";
import ConversationThreadPreviewSentimentAndTopic
	from "@/components/Converse/ConverseMessengerApp/ConversationThreadPreviewSentimentAndTopic";
import ConversationThreadPreviewAssignedAgent
	from "@/components/Converse/ConverseMessengerApp/ConversationThreadPreviewAssignedAgent";
import Dump from "@/components/Dump";
import ConversationThreadMessagesCount
	from "@/components/Converse/ConverseMessengerApp/ConversationThreadMessagesCount";

function TaskTimeDuration() {
	return (
		<div className="flex items-center space-x-2">
			<ClockIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
			<span className="text-sm font-medium text-gray-600">
				Task Duration: 12min 25 sec
			</span>
		</div>
	);
}


export default function ActiveTaskAsideStatus({ thread }){

	const threadContext = thread?.threadContext || 'Why is the service quality so poor?'

	return (
		<aside className="hidden xl:block xl:pl-8">
			<h2 className="sr-only">Details</h2>
			<div className="space-y-5">
				{
					thread?.isClosed
						? (
							<div className="flex items-center space-x-2">
								<LockClosedIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
								<span className="text-sm font-medium text-green-700">Closed Thread</span>
							</div>
						)
						: (
							<div className="flex items-center space-x-2">
								<LockOpenIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
								<span className="text-sm font-medium text-green-700">Open Thread</span>
							</div>
						)
				}

				{
					thread?.isClosed && <TaskTimeDuration />
				}

				<ConversationThreadMessagesCount messageCount={thread?.messageCount | 0} />


				<div className="flex items-center space-x-2">
					<CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					<span className="text-sm font-medium text-gray-900">
					  Created on{' '}
						<br />
						<time dateTime={thread.task.createdAt}>
					    {moment(thread.task.createdAt).format('MMMM Do YYYY, h:mm:ss A')}
					    </time>
					</span>
				</div>
			</div>

			{/* Assigned Agent, Sentiment, Topic and Tags */}
			<div className="mt-6 space-y-8 border-t border-gray-200 py-6">

				<ConversationThreadPreviewAssignedAgent agent={thread?.agent} />

				<ConversationThreadPreviewSentimentAndTopic
					threadContext={thread.content}
				/>

				<ConversationThreadPreviewTags closingTags={thread?.task?.closingTags || []} />

			</div>
		</aside>
	)
}