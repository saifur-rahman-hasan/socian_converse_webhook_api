import SocianContextSentiment from "@/components/SocianAI/SocianContextSentiment";
import SocianContextTopic from "@/components/SocianAI/SocianContextTopic";

export default function ConversationThreadPreviewSentimentAndTopic({ threadContext }){
    if(!threadContext?.length){
        return null
    }

    return (
        <div className={`my-4 flex flex-col gap-y-4`}>
            <div>
                <h2 className="text-sm font-medium text-gray-500">Sentiment</h2>
                <ul role="list" className="mt-2 leading-8">
                    <li className="inline">
                        <SocianContextSentiment context={threadContext} />
                    </li>
                </ul>
            </div>

            <div>
                <h2 className="text-sm font-medium text-gray-500">Topics</h2>
                <ul role="list" className="mt-2 leading-8">
                    <li className="inline">
                        <SocianContextTopic context={threadContext} />
                    </li>
                </ul>
            </div>
        </div>
    )
}