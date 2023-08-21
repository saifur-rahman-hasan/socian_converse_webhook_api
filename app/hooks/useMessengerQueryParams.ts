import { useRouter } from 'next/router';

interface MessengerQueryParams {
    workspaceId: number | string | '';
    channelId: number | string | '';
    conversationId: string | '';
    threadId: number | string | '';
    activityTab: string | '';
}

const useMessengerQueryParams = (): MessengerQueryParams => {
    const router = useRouter();
    const { query: routerQuery } = router;

    const {
        workspaceId,
        channelId,
        conversationId,
        threadId,
        activityTab
    } = routerQuery;

    return {
        workspaceId: workspaceId as number | '',
        channelId: channelId as number | '',
        conversationId: conversationId as string | '',
        threadId: threadId as number | '',
        activityTab: activityTab as string | ''
    };
};

export default useMessengerQueryParams;
