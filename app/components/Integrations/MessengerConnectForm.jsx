"use client"

import SelectedAccountChannelVerifications from "@/components/Converse/ConverseMessengerApp/MessengerChannelSelectedAccountVerifications";
import SelectMenu from "@/components/ui/forms/SelectMenu";
import {
	useFbExchangeTokenMutation,
	useGetMessengerConnectedAccountsQuery, useImportMessengerConversationsMutation
} from "@/store/features/integration/IntegrationAPISlice";
import {
	useCreateWorkspaceChannelMutation
} from "@/store/features/workspace/WorkspaceAPISlice";
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import Dump from "../Dump";

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID; // Replace with your app ID

const FB_MESSENGER_PERMISSIONS = [
	'email',
	'pages_show_list',
	'pages_messaging',
	'read_page_mailboxes',
	'pages_manage_metadata',
	'pages_messaging_subscriptions'
];
const FB_PAGE_PERMISSION = [
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

export default function MessengerConnectForm({ workspace ,authType="messenger"}) {

	const router = useRouter()

	const [facebookResponse, setFacebookResponse] = useState(null)
	const [connectedUserAccessToken, setConnectedUserAccessToken] = useState(null)
	const [selectedAccount, setSelectedAccount] = useState(null)
	const [permissions, setPermissions] = useState([])
	const [button_title, setButtonTitle] = useState('')
	const [selection_title, setSelectionTitle] = useState('')
	const [ fbExchangeToken ] = useFbExchangeTokenMutation()

	useEffect(() => {
		if (authType === "messenger"){
			setPermissions(FB_MESSENGER_PERMISSIONS)
			setButtonTitle("Login with Facebook Messenger")
			setSelectionTitle("Select Your Messenger Account")
		}else if (authType === "fb_page"){
			setPermissions(FB_PAGE_PERMISSION)
			setButtonTitle("Login with Facebook Page")
			setSelectionTitle("Select Your Page Account")
		}
	}, [authType])

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
	} = useGetMessengerConnectedAccountsQuery({
		userAccessToken: connectedUserAccessToken
	}, {
		skip: !connectedUserAccessToken
	})

	const [createWorkspaceChannel, {
		isLoading: channelIsCreating,
		error: channelCreateError
	}] = useCreateWorkspaceChannelMutation()

	const [
		importChannelConversations,
		{ isLoading: importingChannelConversations }
	] = useImportMessengerConversationsMutation()

	async function handleSaveChannel(e) {
		e.preventDefault()

		if(!selectedAccount?.id || !selectedAccount?.access_token){
			alert('Invalid FB Connection Configuration')
			return false
		}

		const newChannelData = {
			workspaceId: workspace?.id,
			channelName: selectedAccount?.name,
			channelType: authType,
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
			// const importedConversations = await importChannelConversations({
			// 	workspaceId: workspace?.id,
			// 	channelId: newChannelData?.id,
			// })

			await router.push({
				pathname: '/workspaces/[workspaceId]/converse',
				query: {
					workspaceId: workspace?.id,
					channelId: newChannelData?.id
				}
			})
		}
	}

	return (
		<div className="mt-2 -space-y-px rounded-md">
			{ !connectedUserAccessToken && (
				<div className={`my-4`}>
					{permissions.length>0 && (
						<FacebookLogin
							cssClass={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
							version={'17.0'}
							appId={FB_APP_ID}
							autoLoad={false}
							callback={setFacebookResponse}
							scope={`${permissions.join(',')}`}
							returnScopes={true}
							textButton={button_title}
						/>
					)}

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
								label={selection_title}
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


			{
				importingChannelConversations && (<div>Importing Channel Data</div>)
			}

		</div>
	)
}
