import FBMessengerIceFeedbackRatings, {FBMessengerIceFeedbackMessageText} from "@/lib/ConverseMessengerService/FbMessengerIceFeedbackQuickReplies";

export default function MessengerChatIceFeedbackContent() {
	const ratings = FBMessengerIceFeedbackRatings
	return (
		<span className="isolate inline-flex rounded-md shadow-sm">
	      {ratings.map((rating, index) => (
		      <button
			      key={`ice_message_ratting_id_${index + 1}`}
			      type="button"
			      className={`relative inline-flex items-center ${index === 0 ? 'rounded-l-md' : index === ratings.length - 1 ? 'rounded-r-md' : ''} bg-white px-3 py-2 text-2xl font-bold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10`}
		      >
			      {rating.title}
		      </button>
	      ))}
    </span>
	)
}