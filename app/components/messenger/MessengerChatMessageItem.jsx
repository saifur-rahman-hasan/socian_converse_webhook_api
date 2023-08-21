import DefaultGravatar from "@/components/DefaultGravatar";
import classNames from "@/utils/classNames";
import moment from "moment";
import {useSession} from "next-auth/react";
import MessengerChatMessageItemContent
	from "@/components/Converse/ConverseMessengerApp/MessengerChatMessageItemContent";
import MessengerChatMessageSentimentAndTopicContent
	from "@/components/Converse/ConverseMessengerApp/MessengerChatMessageSentimentAndTopicContent";

function MessageSentStatus({ status }) {

	let messageSentContent = null

	switch (status) {
		case "sent-success":
			messageSentContent = (<span className="w-2 h-2 bg-green-600 rounded-full"></span>)
			break

		case "sent-fail":
			messageSentContent = (<span className="w-2 h-2 bg-red-300 rounded-full"></span>)
			break

		default:
			messageSentContent = (<span className="w-2 h-2 bg-gray-300 rounded-full"></span>)
	}

	return messageSentContent
}


export function MessageTime({ timestamp, className = null }) {
	const formattedDateTime = moment(timestamp).format('D MMM h:mm A');


	return (
		<time className={className || `text-xs text-gray-500`}>{formattedDateTime}</time>
	);
}



export default function MessengerChatMessageItem({ message }){

	const session = useSession()
	const authId = session?.status === 'authenticated' && session?.data?.user?.id || null
	const  channelType = 'fb_page'

	const messageType = message?.messageType

	if(messageType === 'echo'){
		return null
	} else if (messageType === 'message_deliveries') {
		return null
	} else if (messageType === 'message_reads') {
		return null
	}

	return (
		<li className={classNames(
			message.sender?.id === authId ? "bg-gray-100" : "bg-white",
			"px-6 py-4"
		)}>
			<div className="flex">
				<div className="mr-4 flex-shrink-0">
					<span className="relative inline-block">
						<DefaultGravatar className="h-8 w-8 rounded-full" />
					</span>
				</div>

				<div className="flex-1">
					<div className="flex items-center justify-between">
						<h3 className="text-sm">{ message?.from?.name || message?.message?.from?.name || 'UNDEFINED' }</h3>
						<div className="flex items-center gap-x-2">
							<MessageTime timestamp={message?.createdAt} />

							<MessageSentStatus status={message?.messageSentStatus}/>
						</div>
					</div>

					{ !message.isAgentReplied && (
						<div className={`flex items-center gap-x-8`}>
							<MessengerChatMessageSentimentAndTopicContent
								message={message}
							/>

							{
								(channelType === 'fb_page' || channelType === 'facebook_page') && message?.from?.id?.length > 0 && message?.from?.id.includes('_') ? (
									<span>
							      <a className={`text-blue-600`} target={`_blank`} href={`https://www.facebook.com/${message.from.id}`}>View source comment</a>
							    </span>
								) : null
							}
						</div>
					)}

					<MessengerChatMessageItemContent
						messageType={message?.messageType}
						messageContent={message?.content}
					/>

				</div>
			</div>
		</li>
	)
}