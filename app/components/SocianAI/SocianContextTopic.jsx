import {
	useFetchMessageTopicDataMutation
} from "@/store/features/messenger/MessengerAPISlice";
import {useEffect} from "react";

export default function SocianContextTopic({ context }) {

	const [fetchTopicData, {
		isLoading: loadingTopicData,
		data: topicData
	}] = useFetchMessageTopicDataMutation()

	useEffect(() => {
		if(context.length > 5){
			fetchTopicData(context)
		}
	}, [context])

	return (
		<>
			{ loadingTopicData && <span>...</span> }
			{ !loadingTopicData && topicData && (
				<span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
			        { topicData?.topic || '' }
				</span>
			)}
		</>
	);
}