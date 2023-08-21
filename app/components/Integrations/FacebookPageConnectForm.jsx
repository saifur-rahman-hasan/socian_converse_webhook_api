"use client"

import SelectedAccountChannelVerifications from "@/components/Converse/ConverseMessengerApp/MessengerChannelSelectedAccountVerifications";
import SelectMenu from "@/components/ui/forms/SelectMenu";
import {
	useFbExchangeTokenMutation,
	useGetFacebookPageConnectedAccountsQuery
} from "@/store/features/integration/IntegrationAPISlice";
import {
	useCreateWorkspaceChannelMutation
} from "@/store/features/workspace/WorkspaceAPISlice";
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import Dump from "../Dump";
import ChannelCreateForm from "@/components/Integrations/ChannelCreateForm";

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID; // Replace with your app ID

const FB_APP_PERMISSIONS = [
	'email',
	'pages_show_list',
	'pages_messaging',
	'read_page_mailboxes',
	'pages_messaging_subscriptions',
	'pages_manage_metadata',
	'pages_manage_engagement',

	// 'pages_manage_posts',
	// 'pages_read_user_content',
	// 'pages_user_gender',
	// 'pages_user_locale',
	// 'pages_user_timezone',
	// 'public_profile',
];


export default function FacebookPageConnectForm({ workspace }) {
	const router = useRouter()

	const [facebookResponse, setFacebookResponse] = useState(null)
	const [connectedUserAccessToken, setConnectedUserAccessToken] = useState(null)
	const [selectedAccount, setSelectedAccount] = useState(null)
	const [ fbExchangeToken ] = useFbExchangeTokenMutation()
	const [createdChannelData, setCreatedChannelData] = useState(null)

	useEffect(() => {
		if(facebookResponse?.accessToken){
			// Exchange the short-live token to get long-live token
			const shortLivedToken = facebookResponse.accessToken
			fbExchangeToken({ accessToken: shortLivedToken }).then(res => {
				const longLivedToken = res?.data?.data
				setConnectedUserAccessToken(longLivedToken || shortLivedToken)
			})

		}
	}, [facebookResponse])

	const {
		data: connectedAccounts,
		isLoading: connectedAccountsIsLoading,
		error: connectedAccountsFetchError,
	} = useGetFacebookPageConnectedAccountsQuery({
		userAccessToken: connectedUserAccessToken
	}, {
		skip: !connectedUserAccessToken
	})

	const [createWorkspaceChannel, {
		isLoading: channelIsCreating,
		error: channelCreateError
	}] = useCreateWorkspaceChannelMutation()

	async function handleSaveChannel(e) {
		e.preventDefault()

		if(!selectedAccount?.id || !selectedAccount?.access_token){
			alert('Invalid FB Page Connection Configuration')
			return false
		}

		const newChannelData = {
			workspaceId: workspace?.id,
			channelName: selectedAccount?.name,
			channelType: 'fb_page',
			isConnected: true,
			channelData: {
				accountId: selectedAccount?.id,
				...selectedAccount,
				accessToken:selectedAccount?.access_token,
				authorized: true
			},
		}

		const newChannelCreateResponse = await createWorkspaceChannel(newChannelData)

		if(newChannelCreateResponse?.data?.success === true){
			const newChannelData = newChannelCreateResponse?.data?.data

			await router.push({
				pathname: '/workspaces/[workspaceId]/converse',
				query: {
					workspaceId: workspace?.id,
					channelId: newChannelData?.id
				}
			})
		}

	}

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
			{ !connectedUserAccessToken && (
				<div className={`my-4`}>
					<FacebookLogin
						cssClass={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
						version={'17.0'}
						appId={FB_APP_ID}
						autoLoad={false}
						callback={setFacebookResponse}
						scope={`${FB_APP_PERMISSIONS.join(',')}`}
						returnScopes={true}
						textButton={'Connect with Facebook Page'}
					/>
				</div>
			)}

			{
				connectedUserAccessToken &&
				connectedAccountsIsLoading &&
				<div>Loading your business accounts</div>
			}

			{
				connectedUserAccessToken &&
				!connectedAccountsIsLoading &&
				connectedAccountsFetchError &&
				<Dump data={{connectedAccountsFetchError}} />
			}

			{
				connectedUserAccessToken &&
				!connectedAccountsIsLoading &&
				!connectedAccountsFetchError &&
				connectedAccounts?.length > 0 && (
					<form onSubmit={handleSaveChannel} className={`my-10`}>
						{/* Page Selection */}
						<div className={``}>
							<SelectMenu
								label={`Select Your Messenger Account`}
								options={connectedAccounts}
								onSelected={setSelectedAccount}
							/>
						</div>

						{
							selectedAccount?.id && selectedAccount?.access_token && (
							<SelectedAccountChannelVerifications />
						)}

						{
							channelCreateError &&
							<Dump data={{channelCreateError}} />
						}

						{
							channelIsCreating && (
								<div className={`flex items-center gap-x-4 mt-10`}>
									<button
										type="button"
										disabled={true}
										className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										Preparing your channel ....
									</button>
								</div>
							)
						}

						{
							selectedAccount?.id && (
								<div className={`flex items-center gap-x-4 mt-10`}>
									<button
										type="submit"
										className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										<CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
										Save & Access Chanel
									</button>

									<button
										type="submit"
										className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
									>
										<CheckCircleIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
										Cancel
									</button>
								</div>
							)
						}
					</form>
				)
			}

			<div className="mt-2 -space-y-px rounded-md">
				<ChannelCreateForm
					workspaceId={workspace.id}
					onChannelCreated={handleChannelCreated}
					channelType={`fb_page`}
				/>
			</div>

		</div>
	)
}
