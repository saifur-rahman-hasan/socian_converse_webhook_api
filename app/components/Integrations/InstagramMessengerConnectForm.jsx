import Dump from "@/components/Dump";
import { useCreateWorkspaceChannelMutation } from "@/store/features/workspace/WorkspaceAPISlice";
import React, { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import {useRouter} from "next/router";
import ChannelCreateForm from "@/components/Integrations/ChannelCreateForm";

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID; // Replace with your app ID

const FB_APP_PERMISSIONS = [
	'email',
	'pages_show_list',
	'read_page_mailboxes',
	'pages_messaging',
	'pages_messaging_subscriptions',
	'instagram_basic',
	'instagram_manage_comments',
	'instagram_manage_insights',
	'instagram_content_publish',
	'instagram_manage_messages',
	'pages_read_engagement',
	'pages_manage_metadata',
	'pages_read_user_content',
	'pages_manage_posts',
	'pages_manage_engagement',
];



export default function InstagramMessengerConnectForm({ workspace }) {
	const router = useRouter()
	const [createdChannelData, setCreatedChannelData] = useState(null)

	async function handleChannelCreated(createdChannelData) {
		setCreatedChannelData(createdChannelData)
		const workspaceId = workspace.id

		await router.push({
			pathname: `/workspaces/[workspaceId]/channels`,
			query: {workspaceId}
		})
	}

	return (
		<div className="mt-2 -space-y-px rounded-md">
			<ChannelCreateForm
				workspaceId={workspace.id}
				onChannelCreated={handleChannelCreated}
				channelType={`instagram_messenger`}
			/>
		</div>
	);
}