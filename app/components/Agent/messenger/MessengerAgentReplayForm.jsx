import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CalendarIcon, PaperClipIcon, TagIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import {socket} from "../../../socket/socket";
import classNames from "../../../utils/classNames";
import {useSession} from "next-auth/react";

const assignees = [
	{ name: 'Unassigned', value: null },
	{
		name: 'Wade Cooper',
		value: 'wade-cooper',
		avatar:
			'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	}
]

const labels = [
	{ name: 'Unlabelled', value: null },
	{ name: 'Engineering', value: 'engineering' },
]

const dueDates = [
	{ name: 'No due date', value: null },
	{ name: 'Today', value: 'today' },
]

export default function MessengerAgentReplayForm() {
	const session = useSession()
	const { user: authUser, id: authId } = session?.data

	const [assigned, setAssigned] = useState(assignees[0])
	const [labelled, setLabelled] = useState(labels[0])
	const [dated, setDated] = useState(dueDates[0])

	const [message, setMessage] = useState('I want to buy 4G enabled e-sim for my Iphone 12. How can you help me?');
	const [isLoading, setIsLoading] = useState(false);

	// const [
	// 	data: sendMessage,
	// 	{
	// 		isLoading: sendMessageIsLoading,
	// 		error: sendMessageError
	// 	}
	// ] = useSendMessageMutation()

	function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		const newMsgData = {
			id: authId,
			name: authUser?.name,
			message: message,
			imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			agent_replay: true,
			time: '35 min ago.'
		}

		socket.timeout(2000).emit('chatMsgSend', newMsgData, () => {
			setIsLoading(false);
		});
	}

	return (
		<form onSubmit={ onSubmit }>
			<div
				className="overflow-hidden bottom-0 border border-gray-200 border-x-0 focus-within:border-t-indigo-300"
			>
				<textarea
					rows={4}
					name="description"
					id="description"
					className="block w-full resize-none border-0 py-4 px-8 placeholder-gray-500 focus:ring-0 sm:text-sm"
					placeholder="Write a message..."
					defaultValue={''}
					onChange={ e => setMessage(e.target.value) }
				/>
			</div>

			<div className="inset-x-px bottom-0">
				<div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-8 py-2 sm:px-6">
					<div className="flex">
						<button
							type="submit"
							className="mr-10 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
							disabled={ isLoading }
						>
							Send
						</button>

						<button
							type="button"
							className="group -my-2 -ml-2 inline-flex items-center rounded-full px-3 py-2 text-left text-gray-400"
						>
							<PaperClipIcon className="-ml-1 mr-2 h-5 w-5 group-hover:text-gray-500" aria-hidden="true" />
							<span className="text-sm italic text-gray-500 group-hover:text-gray-600">Attach a file</span>
						</button>

						{/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
						<div className="flex flex-nowrap justify-end space-x-2 px-2 sm:px-3">
							<Listbox as="div" value={assigned} onChange={setAssigned} className="flex-shrink-0">
								{({ open }) => (
									<>
										<Listbox.Label className="sr-only"> Assign </Listbox.Label>
										<div className="relative">
											<Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
												{assigned.value === null ? (
													<UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-300 sm:-ml-1" aria-hidden="true" />
												) : (
													<img src={assigned.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
												)}

												<span
													className={classNames(
														assigned.value === null ? '' : 'text-gray-900',
														'hidden truncate sm:ml-2 sm:block'
													)}
												>
							                      {assigned.value === null ? 'Assign' : assigned.name}
							                    </span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
												className={classNames(
													"absolute z-50 w-52 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
													"mb-1 bottom-full",
												)}
											>
												<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{assignees.map((assignee) => (
														<Listbox.Option
															key={assignee.value}
															className={({ active }) =>
																classNames(
																	active ? 'bg-gray-100' : 'bg-white',
																	'relative cursor-default select-none py-2 px-3'
																)
															}
															value={assignee}
														>
															<div className="flex items-center">
																{assignee.avatar ? (
																	<img src={assignee.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
																) : (
																	<UserCircleIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
																)}

																<span className="ml-3 block truncate font-medium">{assignee.name}</span>
															</div>
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>

							<Listbox as="div" value={labelled} onChange={setLabelled} className="flex-shrink-0">
								{({ open }) => (
									<>
										<Listbox.Label className="sr-only"> Add a label </Listbox.Label>
										<div className="relative">
											<Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
												<TagIcon
													className={classNames(
														labelled.value === null ? 'text-gray-300' : 'text-gray-500',
														'h-5 w-5 flex-shrink-0 sm:-ml-1'
													)}
													aria-hidden="true"
												/>
												<span
													className={classNames(
														labelled.value === null ? '' : 'text-gray-900',
														'hidden truncate sm:ml-2 sm:block'
													)}
												>
					                      {labelled.value === null ? 'Label' : labelled.name}
					                    </span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
												className={classNames(
													"absolute z-50 w-52 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
													"mb-1 bottom-full",
												)}
											>
												<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{labels.map((label) => (
														<Listbox.Option
															key={label.value}
															className={({ active }) =>
																classNames(
																	active ? 'bg-gray-100' : 'bg-white',
																	'relative cursor-default select-none py-2 px-3'
																)
															}
															value={label}
														>
															<div className="flex items-center">
																<span className="block truncate font-medium">{label.name}</span>
															</div>
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>

							<Listbox as="div" value={dated} onChange={setDated} className="flex-shrink-0">
								{({ open }) => (
									<>
										<Listbox.Label className="sr-only">Message Template</Listbox.Label>
										<div className="relative">
											<Listbox.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-100 sm:px-3">
												<CalendarIcon
													className={classNames(
														dated.value === null ? 'text-gray-300' : 'text-gray-500',
														'h-5 w-5 flex-shrink-0 sm:-ml-1'
													)}
													aria-hidden="true"
												/>
												<span
													className={classNames(
														dated.value === null ? '' : 'text-gray-900',
														'hidden truncate sm:ml-2 sm:block'
													)}
												>
							                      {dated.value === null ? 'Message Template' : dated.name}
							                    </span>
											</Listbox.Button>

											<Transition
												show={open}
												as={Fragment}
												leave="transition ease-in duration-100"
												leaveFrom="opacity-100"
												leaveTo="opacity-0"
												className={classNames(
													"absolute z-50 w-52 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
													"mb-1 bottom-full",
												)}
											>
												<Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
													{dueDates.map((dueDate) => (
														<Listbox.Option
															key={dueDate.value}
															className={({ active }) =>
																classNames(
																	active ? 'bg-gray-100' : 'bg-white',
																	'relative cursor-default select-none py-2 px-3'
																)
															}
															value={dueDate}
														>
															<div className="flex items-center">
																<span className="block truncate font-medium">{dueDate.name}</span>
															</div>
														</Listbox.Option>
													))}
												</Listbox.Options>
											</Transition>
										</div>
									</>
								)}
							</Listbox>
						</div>
					</div>

					<div className="flex-shrink-0">
						<button
							type="submit"
							className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							disabled={ isLoading }
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</form>
	)
}


export async function getServerSideProps(ctx) {
	return {
		props: {
			session: await getSession(ctx)
		}
	}
}