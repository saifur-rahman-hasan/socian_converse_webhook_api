import {Fragment, useEffect, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import MessengerChatTaskAssignedAgentsList from "./MessengerChatTaskAssignedAgentsList";
import MessengerChatTaskDurationSelection from "./MessengerChatTaskDurationSelection";
import {useDispatch, useSelector} from "react-redux";
import {closeChatTaskCreateModal, updateChatTaskCreateData} from "../../store/features/draft/draftSlice";
import {useSession} from "next-auth/react";
import MessengerChatTaskAgentSearchToolbar from "./MessengerChatTaskAgentSearchToolbar";
import {useCreateConversationTaskMutation} from "../../store/features/messenger/MessengerAPISlice";
import {useRouter} from "next/router";

function OptionalText() {
	return (
		<span className={`ml-1 inline-block text-sm text-gray-400`}>(optional)</span>
	)
}

const defaultAvatarLink = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

export default function MessengerChatTaskCreateModal() {
	const [open, setOpen] = useState(false)
	const dispatch = useDispatch()
	const router = useRouter()
	const {
		workspaceId,
		integrationId,
		sourceId,
		conversationId
	} = router?.query

	const [messageContent, setMessageContent] = useState('')
	const [taskData, setTaskData] = useState({})
	const [selectedDuration, setSelectedDuration] = useState({ id: 1, name: '5 min' })
	const [aboutTask, setAboutTask] = useState("")

	const draftMessengerChatTaskCreateModalState = useSelector(state => state?.draftSlice?.messengerChatTaskCreateModal)

	const session = useSession()
	const {status: sessionStatus, data: sessionData} = session

	let authUser = null

	if(sessionStatus === 'authenticated'){
		authUser = {
			id: sessionData?.id,
			name: sessionData?.user?.name,
			email: sessionData?.user?.email,
			role: 'agent',
			avatar: defaultAvatarLink
		}
	}

	const [
		createConversationTask,
		{
			isLoading: conversationTaskIsCreating
		}
	] = useCreateConversationTaskMutation()

	useEffect(() => {
		if(draftMessengerChatTaskCreateModalState?.open){
			setOpen(true)

			const { data: draftTaskData } = draftMessengerChatTaskCreateModalState
			setMessageContent(draftTaskData?.message?.content)

			const {
				conversationId,
				conversationUID
			} = draftTaskData

			if(authUser?.id){
				const newTaskData = {
					conversationId,
					conversationUID,
					messageId: draftTaskData?._id,
					title: draftTaskData?.message?.content,
					customer: draftTaskData?.sender,
					teams: [authUser],
					duration: selectedDuration,
					about: aboutTask
				}

				setTaskData(newTaskData)
			}
		}else{
			setOpen(false)
		}
	}, [draftMessengerChatTaskCreateModalState])

	/**
	 * Update the selected duration data
	 */
	useEffect(() => {
		const updatedTaskData = {
			...taskData,
			duration: selectedDuration
		}

		setTaskData(updatedTaskData)

		dispatch(updateChatTaskCreateData(updatedTaskData))
	}, [selectedDuration])

	useEffect(() => {
		const updatedTaskData = {
			...taskData,
			about: aboutTask
		}

		setTaskData(updatedTaskData)

		dispatch(updateChatTaskCreateData(updatedTaskData))
	}, [aboutTask])

	const onCloseModal = () => {
		setOpen(false)
		dispatch(closeChatTaskCreateModal())
	}

	const handleCreateTask = async (e) => {
		e.preventDefault()

		if(authUser?.id){
			const newTaskData = draftMessengerChatTaskCreateModalState?.data
			const taskCreateResult = await createConversationTask(newTaskData)
			await dispatch(closeChatTaskCreateModal())

			if(taskCreateResult?.data?.success){
				const taskId = taskCreateResult?.data?.data?._id

				await router.push({
					pathname: `/workspaces/[workspaceId]/converse/channels/[integrationId]/[sourceId]/[conversationId]/tasks/[taskId]`,
					query: {
						workspaceId,
						integrationId,
						sourceId,
						conversationId,
						taskId,
						tab: 'tasks'
					}
				})
			}else if(taskCreateResult?.error?.data?.error){
				alert(JSON.stringify(taskCreateResult?.error?.data?.error, null, 2))
			}
		}
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onCloseModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
								<div>
									<div className="mt-3 sm:mt-5">
										<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
											Add new Task
										</Dialog.Title>

										<form onSubmit={handleCreateTask}>
											<div className="space-y-12">

												<div className="border-b border-gray-900/10 pb-12">
													<div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
														<div className="col-span-full">
															<label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
																Message
															</label>

															<div className="mt-2">
																<textarea
																	id="about"
																	name="about"
																	rows={3}
																	className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-200"
																	defaultValue={messageContent || ''}
																	disabled={true}
																/>
															</div>
														</div>

														<div className="col-span-full">
															<div className="mt-2">
																<MessengerChatTaskDurationSelection onSelected={(duration) => setSelectedDuration(duration) } />
															</div>
														</div>

														<div className="col-span-full">
															<label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
																About
																<OptionalText />
															</label>
															<div className="mt-2">
												                <textarea
													                id="about"
													                name="about"
													                rows={3}
													                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
													                defaultValue={aboutTask || ''}
													                onChange={(e) => setAboutTask(e.target.value)}
												                />
															</div>
															<p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about this task.</p>
														</div>

														<div className="col-span-full">
															<MessengerChatTaskAgentSearchToolbar />
															<MessengerChatTaskAssignedAgentsList draftTaskData={draftMessengerChatTaskCreateModalState.data} />
														</div>
													</div>
												</div>


											</div>

											<div className="mt-6 flex items-center justify-end gap-x-6">
												<button
													type="button"
													className="text-sm font-semibold leading-6 text-gray-900"
													onClick={onCloseModal}
												>
													Cancel
												</button>

												{
													conversationTaskIsCreating && (
														<button
															type="submit"
															className="animate-pulse rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
														>
															Saving ...
														</button>
													)
												}

												{
													! conversationTaskIsCreating && (
														<button
															type="submit"
															className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
														>
															Save Task
														</button>
													)
												}
											</div>
										</form>

									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
