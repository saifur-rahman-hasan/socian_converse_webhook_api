import {
    useFetchMessageSentimentDataMutation,
    useFetchMessageTopicDataMutation,
} from "@/store/features/messenger/MessengerAPISlice";
import { useEffect } from "react";
import classNames from "@/utils/classNames";
import {ConversationParticipantUserInterface} from "@/actions/interface/ConversationInterface";

interface MessengerChatMessageSentimentAndTopicContentProps {
    message: {
        from: ConversationParticipantUserInterface,
        messageType: string,
        content: string | null,
        isAgentReplied: boolean,
    };
}

export default function MessengerChatMessageSentimentAndTopicContent({ message }: MessengerChatMessageSentimentAndTopicContentProps) {
    if (
        message.isAgentReplied === true &&
        message.messageType !== "text" ||
        (message.messageType === "text" && !message.content)
    ) {
        return null;
    }

    const messageText = message.content;

    return (
        <div className={`my-2 flex items-center gap-x-2`}>
            <MessageTopic messageText={messageText} />
            <MessageSentiment messageText={messageText} />
        </div>
    );
}

interface MessageTopicProps {
    messageText: string; // Replace 'string' with the appropriate type for 'messageText'
}

export function MessageTopic({ messageText }: MessageTopicProps) {
    const [fetchTopicData, { isLoading: loadingTopicData, data: topicData }] =
        useFetchMessageTopicDataMutation();

    useEffect(() => {
        fetchTopicData(messageText);
    }, [messageText]);

    return (
        <>
            {loadingTopicData && <span>...</span>}
            {!loadingTopicData && topicData && (
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {topicData?.topic || ""}
        </span>
            )}
        </>
    );
}

interface MessageSentimentProps {
    messageText: string; // Replace 'string' with the appropriate type for 'messageText'
}

export function MessageSentiment({ messageText }: MessageSentimentProps) {
    const [fetchSentimentData, { isLoading: loadingSentimentData, data: sentimentData }] =
        useFetchMessageSentimentDataMutation();

    useEffect(() => {
        fetchSentimentData(messageText);
    }, [messageText]);

    const sentimentText = sentimentData?.sentiment?.sentiment_class || "";

    const sentimentClasses = {
        Neutral: "text-gray-600 ring-1 ring-inset ring-gray-500/10",
        Positive: "bg-green-50 text-green-600 ring-1 ring-inset ring-green-500/10",
        Negative: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/10",
    };

    return (
        <>
            {loadingSentimentData && <span>...</span>}

            {!loadingSentimentData && sentimentData && (
                <span
                    className={classNames(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        sentimentClasses[sentimentText]
                    )}
                >
          {sentimentData?.sentiment?.sentiment_class || ""}
        </span>
            )}
        </>
    );
}
