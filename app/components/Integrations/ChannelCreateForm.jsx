import React, {useEffect, useState} from "react";
import {useCreateWorkspaceChannelMutation} from "@/store/features/workspace/WorkspaceAPISlice";
import Dump from "@/components/Dump";

export default function ChannelCreateForm({ workspaceId, onChannelCreated, channelType }) {
	const [channelName, setChannelName] = useState('')
	const [channelAccountId, setChannelAccountId] = useState('')
	const [channelAccountAccessToken, setChannelAccountAccessToken] = useState('')

	const [channelFormData, setChannelFormData] = useState({
		workspaceId,
		channelName: '',
		channelAccountId: '',
		channelAccountAccessToken: ''
	})

	const [createWorkspaceChannel, {
		isLoading: channelIsCreating,
		error: channelCreateError,
		isSuccess: channelCreateSuccess
	}] = useCreateWorkspaceChannelMutation()

	useEffect(() => {
		setChannelFormData({
			channelName, channelAccountId, channelAccountAccessToken,
		})
	}, [channelName, channelAccountId, channelAccountAccessToken])

	async function handleFormSubmit(e) {
		e.preventDefault()

		if(!channelFormData?.channelName || !channelFormData?.channelAccountId || !channelFormData?.channelAccountAccessToken){
			alert('You must have to fill all of the fields.')
			return false
		}

		const authorized = false

		const newChannelData = {
			workspaceId,
			channelName,
			channelType,
			isConnected: authorized === true,
			channelData: {
				accountId: channelAccountId,
				accessToken: channelAccountAccessToken,
				authorized: authorized,
				id: channelAccountId,
				name: channelName,
				access_token: channelAccountAccessToken,
				// isThirdParty: false,
				// thirdPartyServiceName: ''
			},
		}

		const createResponse = await createWorkspaceChannel(newChannelData)
		const channelData = createResponse?.data?.data || null

		onChannelCreated(channelData)
	}

	return (
		<form onSubmit={handleFormSubmit} className={`flex flex-col gap-y-4 py-10`}>

			<div className="col-span-full">
				<label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
					Channel Name
				</label>
				<div className="mt-2">
					<input
						id="channelName"
						name="channelName"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						onChange={e => setChannelName(e.target.value)}
					/>
				</div>
			</div>

			<div className="col-span-full">
				<label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
					Account Id
				</label>
				<div className="mt-2">
					<input
						id="channelAccountId"
						name="channelAccountId"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						onChange={e => setChannelAccountId(e.target.value)}
					/>
				</div>
			</div>

			<div className="col-span-full">
				<label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
					Account Access Token
				</label>
				<div className="mt-2">
					<input
						id="channelAccountId"
						name="channelAccountId"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						onChange={e => setChannelAccountAccessToken(e.target.value)}
					/>
				</div>
			</div>

			{
				! channelIsCreating &&
				!channelCreateSuccess &&
				channelCreateError &&
				<Dump data={{channelCreateError}} className={`my-4`} />
			}

			<div className="col-span-full">
				{
					channelIsCreating && (
						<button
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Wait ...
						</button>
					)
				}

				{
					!channelIsCreating && channelCreateSuccess && (
						<button
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Channel Created
						</button>
					)
				}

				{
					!channelIsCreating && !channelCreateSuccess && (
						<button
							type={`submit`}
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Continue
						</button>
					)
				}
			</div>

		</form>
	);
}