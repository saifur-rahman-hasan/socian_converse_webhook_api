import Dump from "@/components/Dump";
import { useCreateWorkspaceChannelMutation } from "@/store/features/workspace/WorkspaceAPISlice";
import React, { useEffect, useState } from "react";
import FacebookLogin from "react-facebook-login";
import {useRouter} from "next/router";
import ChannelCreateForm from "@/components/Integrations/ChannelCreateForm";

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID; // Replace with your app ID


export default function YoutubeChannelConnectForm({ workspace }) {
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