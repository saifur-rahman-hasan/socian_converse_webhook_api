import {useFetchMessageSentimentDataMutation} from "@/store/features/messenger/MessengerAPISlice";
import {useEffect} from "react";
import classNames from "@/utils/classNames";
export default function SocianContextSentiment({ context }) {

	const [fetchSentimentData, {
		isLoading: loadingSentimentData,
		data: sentimentData
	}] = useFetchMessageSentimentDataMutation()

	useEffect(() => {
		if(context.length > 5){
			fetchSentimentData(context)
		}
	}, [context])

	const sentimentText = sentimentData?.sentiment?.sentiment_class || ""

	const sentimentClasses = {
		"Neutral": "text-gray-600 ring-1 ring-inset ring-gray-600/30",
		"Positive": "bg-green-50 text-green-600 ring-1 ring-inset ring-green-600/30",
		"Negative": "bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/30"
	}

	return (
		<>
			{ loadingSentimentData && <span>...</span> }

			{ !loadingSentimentData && sentimentData && (
				<span className={classNames(
					"inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
					sentimentClasses[sentimentText]
				)}>
			        { sentimentData?.sentiment?.sentiment_class || '' }
				</span>
			)}
		</>
	);
}