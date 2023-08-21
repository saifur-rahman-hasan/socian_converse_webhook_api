import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type UserActivityType = 'preview_single_thread' | 'preview_all_threads' | 'chat_on_thread' | 'chat';

const useMessengerUserActivity = (): UserActivityType => {
    const router = useRouter();
    const { query: routerQuery } = router;

    const {
        workspaceId,
        channelId,
        conversationId,
        threadId,
        activityTab
    } = routerQuery;

    const [userActivityType, setUserActivityType] = useState<UserActivityType>('chat');

    useEffect(() => {
        if (workspaceId && channelId && conversationId) {
            if (activityTab === 'threads') {
                if (threadId) {
                    setUserActivityType('preview_single_thread');
                } else {
                    setUserActivityType('preview_all_threads');
                }
            } else if (activityTab === 'chat') {
                if (threadId) {
                    setUserActivityType('chat_on_thread');
                } else {
                    setUserActivityType('chat');
                }
            }
        } else {
            setUserActivityType('chat');
        }
    }, [workspaceId, channelId, conversationId, threadId, activityTab]);

    return userActivityType;
};

export default useMessengerUserActivity;
