import Dump from '@/components/Dump';
import AlertError from "@/components/ui/alerts/AlertError";
import {
	useCreateWorkspaceChannelMutation,
	useUpdateWorkspaceChannelMutation,
	useUpdateWorkspaceTelegramIntegrationWebhookMutation
} from "@/store/features/workspace/WorkspaceAPISlice";
import { useRouter } from "next/router";
import { useState } from "react";
import TelegramLoginButton from "telegram-login-button";

export default function TelegramConnectForm({ workspace }) {
	const router = useRouter()

	const [botName, setBotName] = useState('')
	const [botToken, setBotToken] = useState('')

	const [createdChannel, setCreatedChannel] = useState(null)
	const [telegramError, setTelegramError] = useState(null)

	const [updateTelegramIntegrationWebhook] = useUpdateWorkspaceTelegramIntegrationWebhookMutation();

	const [createWorkspaceChannel, {
		isLoading: workspaceChannelIsCreating,
		error: workspaceChannelCreateError
	}] = useCreateWorkspaceChannelMutation();

	const [updateWorkspaceChannel, {
		isLoading: workspaceChannelIsUpdating
	}] = useUpdateWorkspaceChannelMutation();

	const [showTelegramLoginWidget, setShowTelegramLoginWidget] = useState(false)

	const handleTelegramResponse = async response => {
		const {
			id,
			hash,
			auth_date,
		} = response;

		if(!id || !hash || !auth_date || !createdChannel?.id){
			setShowTelegramLoginWidget(false)
			alert('Telegram auth response was not valid. please check log')
			console.log('telegram auth response: ', response)
			return false
		}

		const workspaceId = createdChannel?.workspaceId
		const channelId = createdChannel?.id

		if(!workspaceId || !channelId){
			alert("WorkspaceId or ChannelId is invalid")
			return false
		}

		const channelUpdatedData = {
			workspaceId: workspaceId,
			channelId: channelId,
			channelData: {
				authorized: true,
				author: {...response}
			}
		}

		const updatedChannel = await updateWorkspaceChannel(channelUpdatedData)

		if(updatedChannel?.data?.data?.id){
			const webhookUpdateResponse = await updateTelegramIntegrationWebhook({
				workspaceId: workspaceId,
				channelType: "telegram",
				channelId: botName,
				botToken,
				botName
			})

			console.log(`webhookUpdateResponse`)
			console.log(webhookUpdateResponse)

			if(webhookUpdateResponse?.data?.ok){
				setTelegramError(null)

				await router.push({
					pathname: `/workspaces/${workspaceId}/channels`,
					query: { workspaceId  }
				})
			}else{
				setTelegramError(webhookUpdateResponse)
			}

		}
	};

	const handleSubmitConnectionForm = async (e) => {
		e.preventDefault()

		const newChannelData = {
			workspaceId: workspace.id,
			channelType: 'telegram',
			channelName: botName,
			isConnected: false,
			channelData: {
				accountId: botName,
				botName: botName,
				botToken: botToken,
				authorized: false,
				author: null,
				accessToken:botToken
			},
		}

		const newChannel = await createWorkspaceChannel(newChannelData)

		if(newChannel?.data?.data?.id){
			setCreatedChannel(newChannel?.data?.data)
			setShowTelegramLoginWidget(true)
		}
	}

	return (
		<form onSubmit={handleSubmitConnectionForm}>
			{workspace?.id && (
				<fieldset>
					<legend className="block text-sm font-medium leading-6 text-gray-900">Bot Information</legend>
					<div className="mt-2 -space-y-px rounded-md">
						<div>
							<input
								type="text"
								name="bot_name"
								id="bot_name"
								className="relative block w-full rounded-none rounded-t-md border-0 bg-gray-100 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								placeholder="Your Bot Name"
								onChange={e => setBotName(e.target.value) }
								value={botName}
							/>
						</div>
						<div>
							<input
								type="text"
								name="bot_token"
								id="bot_token"
								className="relative block w-full rounded-none border-0 bg-gray-100 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								placeholder="Your Bot Token"
								onChange={e => setBotToken(e.target.value) }
								value={botToken}
							/>
						</div>

						<div>
							{
								workspaceChannelIsCreating ? (
									<button
										type="button"
										className="relative bg-gray-100 block w-full rounded-none rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										disabled
									>
										Please wait ...
									</button>
								) : (
									<button
										type="submit"
										className="relative bg-transparent block w-full rounded-none rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									>
										Verify Connection
									</button>
								)
							}

						</div>
					</div>
				</fieldset>
			)}

			{
				workspaceChannelCreateError && <AlertError
					title={`Channel Create Error`}
					message={workspaceChannelCreateError?.data?.message}
					className={`my-5 rounded`}
				/>
			}


			{
				(showTelegramLoginWidget && botName) && (
					<div className={`py-2`}>
						<TelegramLoginButton
							botName={botName}
							dataOnauth={handleTelegramResponse}
							dataRequestAccess="write"
							dataSize="large"
						/>
					</div>
				)
			}


			{ telegramError && <Dump data={telegramError} /> }
		</form>
	)
}
