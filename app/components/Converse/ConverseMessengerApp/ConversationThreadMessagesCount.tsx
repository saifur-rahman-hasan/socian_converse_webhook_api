import { FC } from "react"; // Import FC (Functional Component) type
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/20/solid";

// Define the type for the props
interface ConversationThreadMessagesCountProps {
    messageCount?: number;
    text: string | false | null
}

// Use FC type with the props
const ConversationThreadMessagesCount: FC<ConversationThreadMessagesCountProps> = ({ messageCount, text }) => {
    return (
        <div className="flex items-center space-x-2">
            <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">
                {messageCount || 0}
                { text === false || !text && (messageCount === 1 ? 'Message' : 'Messages') }
            </span>
        </div>
    );
}

export default ConversationThreadMessagesCount;
