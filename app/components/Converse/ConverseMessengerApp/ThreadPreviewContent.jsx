import {
	CalendarIcon,
	ChatBubbleLeftEllipsisIcon,
	CheckCircleIcon,
	PlusIcon, TagIcon, UserCircleIcon as UserCircleIconMini
} from "@heroicons/react/20/solid";
import {Fragment, useState} from "react";
import DefaultGravatar from "@/components/DefaultGravatar";
import classNames from "@/utils/classNames";
import ThreadCloseStatus from "@/components/Converse/ConverseMessengerApp/ThreadCloseStatus";

export default function ThreadPreviewContent({ thread }){
	return (
		<div className="py-8 pb-52">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 xl:grid xl:max-w-5xl xl:grid-cols-3">
				<div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
					<div>
						<div>
							<div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">4G Internet Service Issue</h1>
									<p className="mt-2 text-sm text-gray-500">
										#400 opened by{' '}
										<a href="#" className="font-medium text-gray-900">
											The Customer
										</a>{' '}
										in{' '}
										<a href="#" className="font-medium text-gray-900">
											Messenger Account (Unnamed Group)
										</a>
									</p>
								</div>
							</div>

							<TaskPreviewContentAsideMobile thread={thread} />

							<IssueDescription />
						</div>
					</div>

					<section aria-labelledby="activity-title" className="mt-8 xl:mt-10">
						<div>
							<TaskActivities />
						</div>
					</section>
				</div>

				<TaskPreviewContentAsideDesktop thread={thread} />

			</div>
		</div>
	)
}



function TaskPreviewContentAsideMobile({ thread }) {
	return (
		<aside className="mt-8 xl:hidden">
			<h2 className="sr-only">Details</h2>
			<div className="space-y-5">
				<ThreadCloseStatus isClosed={thread?.isClosed} />

				<IssueComments />

				<IssueCreatedTime />
			</div>
			<div className="mt-6 space-y-8 border-b border-t border-gray-200 py-6">
				<TaskAssignees />

				<TaskTags />
			</div>
		</aside>
	);
}

function IssueDescription() {
	return (
		<div className="py-3 xl:pb-0 xl:pt-6">
			<h2 className="sr-only">Description</h2>
			<div className="prose max-w-none">
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, hic? Commodi cumque
					similique id tempora molestiae deserunt at suscipit, dolor voluptatem, numquam, harum
					consequatur laboriosam voluptas tempore aut voluptatum alias?
				</p>
				<ul role="list">
					<li>
						Tempor ultrices proin nunc fames nunc ut auctor vitae sed. Eget massa parturient vulputate
						fermentum id facilisis nam pharetra. Aliquet leo tellus.
					</li>
					<li>Turpis ac nunc adipiscing adipiscing metus tincidunt senectus tellus.</li>
					<li>
						Semper interdum porta sit tincidunt. Dui suspendisse scelerisque amet metus eget sed. Ut
						tellus in sed dignissim.
					</li>
				</ul>
			</div>
		</div>
	);
}

function TaskActivities() {
	return (
		<div className="divide-y divide-gray-200">
			<div className="pb-4">
				<h2 id="activity-title" className="text-lg font-medium text-gray-900">
					Activity
				</h2>
			</div>

			<div className="pt-6">
				{/* Activity feed*/}
				<IssueActivityFeedList />

				<div className="mt-6">
					<div className="flex space-x-3">
						<div className="min-w-0 flex-1">
							<div className="mt-6 flex items-center justify-end space-x-4">
								<button
									type="button"
									className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
								>
									<CheckCircleIcon className="-ml-0.5 h-5 w-5 text-green-500" aria-hidden="true" />
									Accept & Continue to the Thread
								</button>

								<button
									type="submit"
									className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
								>
									Decline
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function TaskAssignees() {
	return (
		<div>
			<h2 className="text-sm font-medium text-gray-500">Assignees</h2>
			<ul role="list" className="mt-3 space-y-3">
				<li className="flex justify-start">
					<a href="#" className="flex items-center space-x-3">
						<div className="flex-shrink-0">
							<img
								className="h-5 w-5 rounded-full"
								src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div className="text-sm font-medium text-gray-900">Eduardo Benz</div>
					</a>
				</li>
			</ul>
		</div>
	);
}

function TaskPreviewContentAsideDesktop({ thread }) {
	return (
		<aside className="hidden xl:block xl:pl-8">
			<h2 className="sr-only">Details</h2>
			<div className="space-y-5">
				<ThreadCloseStatus isClosed={thread?.isClosed} />

				<IssueComments />

				<IssueCreatedTime />
			</div>
			<div className="mt-6 space-y-8 border-t border-gray-200 py-6">
				<TaskAssignees />

				<TaskTags />
			</div>
		</aside>
	);
}

function IssueComments({ count }) {
	return (
		<div className="flex items-center space-x-2">
			<ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
			<span className="text-sm font-medium text-gray-900">{count || 0} comments</span>
		</div>
	);
}

function IssueCreatedTime() {
	return (
		<div className="flex items-center space-x-2">
			<CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
			<span className="text-sm font-medium text-gray-900">
                Created on <time dateTime="2020-12-02">Dec 2, 2020</time>
            </span>
		</div>
	);
}

function TaskTags() {
	const DEMO_TAGS = [
		{
			id: 1,
			name: 'Mobile Network',
			color: 'red'
		},
		{
			id: 2,
			name: 'Internet Service',
			color: 'orange'
		},
		{
			id: 2,
			name: '4G SIM',
			color: 'green'
		}
	]

	const [tags, setTags] = useState(DEMO_TAGS || [])
	const [canCreateTag, setCanCreateTag] = useState(true)

	return (
		<div>
			<div className={`flex items-center justify-between`}>
				<h2 className="text-sm font-medium text-gray-500">Tags</h2>

				<button onClick={() => alert('Coming soon...') }>
					<PlusIcon className={`w-4 h-4 text-gray-500`} />
				</button>
			</div>
			<ul role="list" className="mt-2 leading-8">
				{tags.map(tag => (
					<li
						key={`task_tags_${tag.id}`}
						className="inline">
						<span
							className="relative inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							<div className="absolute flex flex-shrink-0 items-center justify-center">
								<span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
							</div>
							<div className="ml-3 text-xs font-semibold text-gray-900">{tag?.name}</div>
						</span>{' '}
					</li>
				))}

			</ul>
		</div>
	);
}

function IssueActivityFeedList() {
	const demoActivities = [
		{
			id: 1,
			type: 'comment',
			person: { name: 'Eduardo Benz', href: '#' },
			imageUrl:
				'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
			date: '6d ago',
		},
		{
			id: 2,
			type: 'assignment',
			person: { name: 'Hilary Mahy', href: '#' },
			assigned: { name: 'Kristin Watson', href: '#' },
			date: '2d ago',
		},
		{
			id: 3,
			type: 'tags',
			person: { name: 'Hilary Mahy', href: '#' },
			tags: [
				{ name: 'Bug', href: '#', color: 'bg-rose-500' },
				{ name: 'Accessibility', href: '#', color: 'bg-indigo-500' },
			],
			date: '6h ago',
		},
		{
			id: 4,
			type: 'comment',
			person: { name: 'Jason Meyers', href: '#' },
			imageUrl:
				'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
			date: '2h ago',
		},
	]
	const [activities, setActivities] = useState(demoActivities || [])

	return (
		<div className="flow-root">
			<ul role="list" className="-mb-8">
				{activities.map((item, itemIdx) => (
					<li key={item.id}>
						<div className="relative pb-8">
							{itemIdx !== activities.length - 1 ? (
								<span
									className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
									aria-hidden="true"
								/>
							) : null}
							<div className="relative flex items-start space-x-3">
								{item.type === 'comment' ? (
									<>
										<div className="relative">

											<DefaultGravatar className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white" />

											<span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
												<ChatBubbleLeftEllipsisIcon
													className="h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
                                            </span>
										</div>

										<div className="min-w-0 flex-1">
											<div>
												<div className="text-sm">
													<a href={item.person.href} className="font-medium text-gray-900">
														{item.person.name}
													</a>
												</div>
												<p className="mt-0.5 text-sm text-gray-500">Commented {item.date}</p>
											</div>
											<div className="mt-2 text-sm text-gray-700">
												<p>{item.comment}</p>
											</div>
										</div>
									</>
								) : item.type === 'assignment' ? (
									<>
										<div>
											<div className="relative px-1">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
													<UserCircleIconMini
														className="h-5 w-5 text-gray-500"
														aria-hidden="true"
													/>
												</div>
											</div>
										</div>

										<div className="min-w-0 flex-1 py-1.5">
											<div className="text-sm text-gray-500">
												<a href={item.person.href} className="font-medium text-gray-900">
													{item.person.name}
												</a>{' '}
												assigned{' '}
												<a href={item.assigned.href} className="font-medium text-gray-900">
													{item.assigned.name}
												</a>{' '}
												<span className="whitespace-nowrap">{item.date}</span>
											</div>
										</div>
									</>
								) : (
									<>
										<div>
											<div className="relative px-1">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white">
													<TagIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
												</div>
											</div>
										</div>
										<div className="min-w-0 flex-1 py-0">
											<div className="text-sm leading-8 text-gray-500">
                                              <span className="mr-0.5">
                                                <a href={item.person.href} className="font-medium text-gray-900">
                                                  {item.person.name}
                                                </a>{' '}
	                                              added tags
                                              </span>{' '}
												<span className="mr-0.5">
                                                {item.tags.map((tag) => (
	                                                <Fragment key={tag.name}>
		                                                <a
			                                                href={tag.href}
			                                                className="relative inline-flex items-center rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
		                                                >
                                                      <span className="absolute flex flex-shrink-0 items-center justify-center">
                                                        <span
	                                                        className={classNames(tag.color, 'h-1.5 w-1.5 rounded-full')}
	                                                        aria-hidden="true"
                                                        />
                                                      </span>
			                                                <span className="ml-3 font-semibold text-gray-900">
                                                        {tag.name}
                                                      </span>
		                                                </a>{' '}
	                                                </Fragment>
                                                ))}
                                              </span>
												<span className="whitespace-nowrap">{item.date}</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
