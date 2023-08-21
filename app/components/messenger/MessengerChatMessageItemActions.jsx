import {FaReply} from "react-icons/fa";
import {MdAddTask} from "react-icons/md";
import {useDispatch} from "react-redux";
import {openChatTaskCreateModal} from "@/store/features/draft/draftSlice";


export default function MessengerChatMessageItemActions({ message }) {
	const dispatch = useDispatch()

	const addTask = async (message) => {
		const taskPayload = {
			...message,
			conversationId: message?.conversationDocumentId,
			conversationUID: message?.conversationId,
			messageId: message?._id
		}

		delete taskPayload.conversationDocumentId
		await dispatch(openChatTaskCreateModal(taskPayload))
	}

	return (
		<span className="isolate inline-flex rounded-md shadow-sm">
			<button
				type="button"
				className="relative inline-flex gap-x-2 items-center items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
				onClick={() => addTask(message) }
			>
					<MdAddTask className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
					Add Task
				</button>


			<button
				type="button"
				className="relative -ml-px inline-flex items-center gap-x-2 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
			>
				<FaReply className={`w-4 h-4 text-gray-500`} />
				Replay
			</button>
    </span>
	)
}
