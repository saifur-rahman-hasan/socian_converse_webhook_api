
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
	FolderIcon, ForwardIcon, LockClosedIcon, PencilSquareIcon, TagIcon, UserPlusIcon,
} from '@heroicons/react/24/outline';
import collect from "collect.js";
import { Fragment, useEffect, useState } from 'react';
import classNames from "@/utils/classNames";
import {useDispatch, useSelector} from "react-redux";
import {inActivateChatCommand} from "@/store/features/messenger/MessengerInstanceSlice";
import MessengerChatCommandPalletSelectedCommandPreview
	from "@/components/Converse/ConverseMessengerApp/MessengerChatCommandPalletSelectedCommandPreview";
import {StarIcon} from "@heroicons/react/24/solid";

const DEFAULT_QUICK_COMMANDS = [
	{ id: 1, command: '/close-thread', name: 'Close Thread', icon: LockClosedIcon, shortcut: 'C', url: '#' },
	// { id: 2, command: '/send-ice-message', name: 'Ask Service Feedback', icon: StarIcon, shortcut: 'I', url: '#' },
	{ id: 4, command: '/forward-to-an-agent', name: 'Forward to an Agent', icon: ForwardIcon, shortcut: 'F', url: '#' },
	{ id: 5, command: '/add-tag', name: 'Add tag...', icon: TagIcon, shortcut: 'T', url: '#' },
	{ id: 6, command: '/message-templates', name: 'Message Templates', icon: TagIcon, shortcut: 'MT', url: '#' },
]

const recent = []
export default function MessengerChatCommandPallet({ chatWindowData }) {
	const dispatch = useDispatch()
	const chatCommand = useSelector(state => state?.messengerInstance?.chat_command || null)

	const [query, setQuery] = useState('')
	const [open, setOpen] = useState(false)
	const [quickCommands, setQuickCommands] = useState(DEFAULT_QUICK_COMMANDS)
	const [selectedCommand, setSelectedCommand] = useState(null)

	useEffect(() => {
		setOpen(chatCommand?.open === true)
	}, [chatCommand])

	useEffect(()=> {
		if(selectedCommand?.id){
			setQuery(selectedCommand.name)
		}
	}, [selectedCommand])

	const filteredProjects =
		query === ''
			? []
			: quickCommands.filter((project) => {
				return project.name.toLowerCase().includes(query.toLowerCase())
			})

	const closeChatCommand = async () => {
		setOpen(false)
		dispatch(inActivateChatCommand())
	};

	return (
		<Transition.Root
			show={open}
			as={Fragment}
			afterLeave={() => setQuery('')}
			appear
		>
			<Dialog as="div" className="relative z-10" onClose={closeChatCommand}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-40 overflow-y-auto p-4 sm:p-6 md:p-20">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-10  rounded-xl bg-white bg-opacity-80 shadow-2xl ring-1 ring-black ring-opacity-5 backdrop-blur backdrop-filter transition-all">
							<Combobox onChange={(item) => setSelectedCommand(item)}>
								<div className="relative">
									<MagnifyingGlassIcon
										className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-900 text-opacity-40"
										aria-hidden="true"
									/>
									<Combobox.Input
										className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 focus:ring-0 sm:text-sm"
										placeholder="Search..."
										onChange={(event) => setQuery(event.target.value)}
										value={query || ''}
									/>
								</div>

								{(query === '' || filteredProjects.length > 0) && (
									<Combobox.Options
										static
										className="max-h-80 scroll-py-2 overflow-y-auto"
									>
										<li className="p-2">
											<ul className="text-sm text-gray-700">
												{(query === '' ? recent : filteredProjects).map((project) => (
													<Combobox.Option
														key={project.id}
														value={project}
														className={({ active }) =>
															classNames(
																'flex cursor-default select-none items-center rounded-md px-3 py-2',
																active && 'bg-gray-900 bg-opacity-5 text-gray-900'
															)
														}
													>
														{({ active }) => (
															<>
																<FolderIcon
																	className={classNames(
																		'h-6 w-6 flex-none text-gray-900 text-opacity-40',
																		active && 'text-opacity-100'
																	)}
																	aria-hidden="true"
																/>
																<span className="ml-3 flex-auto truncate">{project.name}</span>
																{active && <span className="ml-3 flex-none text-gray-500">Jump to...</span>}
															</>
														)}
													</Combobox.Option>
												))}
											</ul>
										</li>

										{query === '' && (
											<li className="p-2">
												<h2 className="sr-only">Quick actions</h2>
												<ul className="text-sm text-gray-700">
													{collect(quickCommands).take(10).map((action) => (
														<Combobox.Option
															key={action.id}
															value={action}
															className={({ active }) =>
																classNames(
																	'flex cursor-default select-none items-center rounded-md px-3 py-2',
																	active && 'bg-gray-900 bg-opacity-5 text-gray-900'
																)
															}
														>
															{({ active }) => (
																<>
																	<action.icon
																		className={classNames(
																			'h-6 w-6 flex-none text-gray-900 text-opacity-40',
																			active && 'text-opacity-100'
																		)}
																		aria-hidden="true"
																	/>
																	<span className="ml-3 flex-auto truncate">{action.name}</span>
																	<span className="ml-3 flex-none text-xs font-semibold text-gray-500">
									                                    <kbd className="font-sans">⌘</kbd>
									                                    <kbd className="font-sans">{action.shortcut}</kbd>
																	</span>
																</>
															)}
														</Combobox.Option>
													))}
												</ul>
											</li>
										)}
									</Combobox.Options>
								)}

								{query !== '' && filteredProjects.length === 0 && (
									<div className="px-6 py-14 text-center sm:px-14">
										<FolderIcon className="mx-auto h-6 w-6 text-gray-900 text-opacity-40" aria-hidden="true" />
										<p className="mt-4 text-sm text-gray-900">
											We couldn't find any projects with that term. Please try again.
										</p>
									</div>
								)}

								{/* Selected Command Preview */}
								{
									query !== '' && selectedCommand?.id > 0 &&
									<MessengerChatCommandPalletSelectedCommandPreview
										chatWindowData={chatWindowData}
										selectedCommand={selectedCommand} />
								}
							</Combobox>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
