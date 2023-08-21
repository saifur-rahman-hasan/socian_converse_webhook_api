import { CheckIcon, UserIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";
import {BriefcaseIcon, ChatBubbleBottomCenterTextIcon, LinkIcon} from "@heroicons/react/24/solid";

const timeline = [
	{
		id: 1,
		content: 'User Access Token',
		target: 'Verified',
		href: '#',
		date: '',
		datetime: '2020-09-20',
		icon: UserIcon,
		iconBackground: 'bg-gray-300',
	},
	{
		id: 2,
		content: 'Business Account - (Unnamed Group)',
		target: 'Verified & Connected',
		href: '#',
		date: '',
		datetime: '2020-09-22',
		icon: BriefcaseIcon,
		iconBackground: 'bg-gray-400',
	},
	{
		id: 3,
		content: 'Initial Data Load',
		target: 'Completed',
		href: '#',
		date: '',
		datetime: '2020-09-28',
		icon: CheckIcon,
		iconBackground: 'bg-gray-500',
	},
	{
		id: 4,
		content: 'Your channel is prepared.',
		target: '',
		href: '#',
		date: '',
		datetime: '2020-09-30',
		icon: ChatBubbleBottomCenterTextIcon,
		iconBackground: 'bg-green-500',
	}
]


export default function MessengerConnectFormAccountConnectionFeeds({ account }) {
	return (
		<div className="flow-root">

			<ul role="list" className="my-4">
				{timeline.map((event, eventIdx) => (
					<li key={event.id}>
						<div className="relative pb-8">
							{eventIdx !== timeline.length - 1 ? (
								<span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
							) : null}
							<div className="relative flex space-x-3">
								<div>
                  <span
	                  className={classNames(
		                  event.iconBackground,
		                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
	                  )}
                  >
                    <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
								</div>
								<div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
									<div>
										<p className="text-sm text-gray-500">
											{event.content}{' '}
											<a href={event.href} className="font-medium text-gray-900">
												{event.target}
											</a>
										</p>
									</div>
									<div className="whitespace-nowrap text-right text-sm text-gray-500">
										<time dateTime={event.datetime}>{event.date}</time>
									</div>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
