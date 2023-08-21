import {CalendarIcon} from "@heroicons/react/20/solid";

export default function ConversationThreadIssueCreatedTime(timestamp){
    return (
        <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">
                Created on <time dateTime="2020-12-02">Dec 2, 2020</time>
            </span>
        </div>
    )
}