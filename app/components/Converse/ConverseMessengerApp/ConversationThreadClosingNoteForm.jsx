import {useEffect, useState} from "react";
import {
	useCloseConversationThreadMutation,
	useCreateConversationMessageMutation
} from "@/store/features/messenger/MessengerAPISlice";
import {useDispatch, useSelector} from "react-redux";
import {editChatWindow, inActivateChatCommand} from "@/store/features/messenger/MessengerInstanceSlice";
import {useCreateAgentActivityMutation,useGetTagListQuery} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import {useSession} from "next-auth/react";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import AlertError from "@/components/ui/alerts/AlertError";
import MultipleTagSelect from "@/components/tag/MultipleTagSelect";

export default function ConversationThreadClosingNoteForm(){
	const dispatch = useDispatch()
	const chatWindowData = useSelector(state => state.messengerInstance.chat_window.data)

	const [note, setNote] = useState('');
	const [selectedTags, setSelectedTags] = useState([]);
	const [fromParticipant, setFromParticipant] = useState(null)

	const session = useSession()
	const sessionData = session?.data

	useEffect(() => {
		if(sessionData?.user){
			setFromParticipant({
				id: sessionData.user.id,
				name: sessionData.user.name,
				role: 'agent',
			})
		}else{
			setFromParticipant(null)
		}
	}, [sessionData])

	const {
		workspaceId,
		channelId,
		conversationId,
		activeThreadId
	} = chatWindowData

	const [
		closeThread,
		{ data: closedThreadData, isLoading: threadIsClosing, error: threadCloseError }
	] = useCloseConversationThreadMutation()

	const [createAgentActivity] = useCreateAgentActivityMutation()

	const handleSubmit = async (e) => {
		e.preventDefault();

		if(!workspaceId || !channelId || !conversationId){
			alert("Invalid Request to process")
			return false
		}

		const closingTags = selectedTags?.length > 0
			? selectedTags.map(({id, name}) => ({id, name}))
			: []

		const threadCloseResponse = await closeThread({
			"taskId": chatWindowData.activeThreadId,
			"iceFeedback": true,
			"assignedTags": closingTags,
			closeNote: note || ""
		})


		// TODO: If got success response
		const closedThreadId = threadCloseResponse?.data?.data?.taskId
		if(closedThreadId){
			console.log(`threadCloseResponse: `, threadCloseResponse)


			await dispatch(editChatWindow({
				...chatWindowData,
				activityTab: 'threads',
				userActivityType: 'preview_all_threads'
			}))

			await dispatch(inActivateChatCommand())

			await createAgentActivity({
				workspaceId: chatWindowData?.workspaceId,
				channelId: chatWindowData?.channelId,
				agentId: chatWindowData?.agentId,
				conversationId: chatWindowData?.conversationId,
				threadId: chatWindowData?.activeThreadId,
				activityGroup: 'occupied_on_task',
				activityType: 'task_closed',
				activityInfo: `Agent (${chatWindowData?.agentId}) has closed the Thread (${chatWindowData?.activeThreadId}) from Workspace (${workspaceId})`,
				activityState: 'end',
				activityData: {
					time: new Date(),
					closed: true,
					closeNote: note
				}
			})

		}
	};

	const handleCancel = () => {
		// Add your logic to handle cancellation here
		// For example, resetting the form or closing the thread
		console.log('Form canceled');
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className={`my-4`}>
					<label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900">
						Add your comment or note
					</label>
					<textarea
						id="note"
						rows="4"
						className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Write your note here"
						value={note}
						onChange={(e) => setNote(e.target.value)}
					></textarea>
				</div>

				<div className={`my-4`}>
					<div className={`mt-4`}>
						<MultipleTagSelect onSelected={setSelectedTags} channelId={chatWindowData?.channelId}/>
					</div>
				</div>

				<div className={`flex items-center gap-x-4 `}>
					<button
						type="submit"
						className="inline-flex text-white items-center bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
					>
						Close The Thread
					</button>

					<button
						type="button"
						className="text-gray-500 bg-red-600 text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10"
						onClick={handleCancel}
					>
						Cancel
					</button>
				</div>
			</form>


			{ threadIsClosing && <div className={`flex items-center gap-x-4`}><LoadingCircle /> Closing thread ...</div>}
			{ !threadIsClosing && threadCloseError && <AlertError className={`my-4`} message={threadCloseError.data.message} /> }

			{!threadIsClosing && !threadCloseError && closedThreadData?.data?.id > 0 && (
				<div>Thread Closed.</div>
			)}
		</>
	);
}