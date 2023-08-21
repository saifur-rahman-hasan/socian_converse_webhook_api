import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Link from "next/link";
import classNames from "@/utils/classNames";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import DefaultGravatar from "@/components/DefaultGravatar";
import moment from "moment";
import AlertError from "@/components/ui/alerts/AlertError";
import Dump from "@/components/Dump";
import ConversationThreadMessagesCount
    from "@/components/Converse/ConverseMessengerApp/ConversationThreadMessagesCount";

function ConsumerCommentContent({ activityItem }) {
    return (
        <>
            <DefaultGravatar className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50" />
            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500">
                        <span className="font-medium text-gray-900">{activityItem.person.name}</span> commented
                    </div>
                    <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                        {activityItem.date}
                    </time>
                </div>
                <p className="text-sm leading-6 text-gray-500">{activityItem.comment}</p>
            </div>
        </>
    );
}

function ConsumerThreadCreatedContent({ activity }) {
    return (
        <div
            className={classNames(
                'absolute left-0 top-0 flex w-6 justify-center'
            )}
        >
            <div className="w-px bg-gray-200" />
        </div>
    );
}

function ActivityListItem({ activityItem }) {
    let content = null

    switch (activityItem?.type){
        case "commented":
            content = <ConsumerCommentContent activityItem={activityItem} />
            break

        case "messages_count":
            content = <ConversationThreadMessagesCount messageCount={activityItem?.value || 0} />
            break

        case "created":
            content = <ConsumerThreadCreatedContent activity={activityItem?.activity} />
            break

        default:
            content = (
                <>
                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                        {activityItem?.type === 'paid' || activityItem?.type === 'replay' ? (
                            <CheckCircleIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                        ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                        )}
                    </div>
                    <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                    <span className="font-medium text-gray-900">
                        {activityItem?.person?.name}
                    </span> {activityItem?.type} the thread.
                    </p>
                    <time dateTime={activityItem?.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                        {activityItem?.date}
                    </time>
                </>
            )
    }


    return (
        <li key={activityItem?.id} className="relative flex gap-x-4">
            {content}
        </li>
    );
}

export default function ConversationThreadActivityFeeds({ chatWindowData, thread }) {
    const [activity, setActivity] = useState([])

    function prepareTheThreadActivities() {
        const threadActivities = [
            {
                id: 1,
                type: 'created',
                person: { name: thread.author.name },
                date: moment(thread.createdAt).fromNow(),
                dateTime: thread.createdAt
            },
            {
                id: 2,
                type: 'commented',
                person: { name: thread.author.name },
                comment: thread.threadContext,
                date: moment(thread.createdAt).fromNow(),
                dateTime: thread.createdAt
            },
            {
                id: 5,
                type: ` have been assigned for`,
                person: { name: thread?.agent?.name },
                date: moment(thread?.task?.createdAt).fromNow(),
                dateTime: thread?.task?.createdAt
            },
            {
                id: 6,
                type: ` has accepted & opened`,
                person: { name: thread?.agent?.name },
                date: moment(thread?.task?.createdAt).fromNow(),
                dateTime: thread?.task?.createdAt
            }
        ];

        return threadActivities
    }

    useEffect(() => {
        const activities = prepareTheThreadActivities()

        setActivity(activities)
    }, [thread])

    return (
        <>
            <ul role="list" className="space-y-6">
                {activity.map((activityItem, activityItemIdx) => (
                    <ActivityListItem activityItem={activityItem} />
                ))}
            </ul>



        </>
    )
}
