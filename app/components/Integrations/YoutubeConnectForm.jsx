"use client"

import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {
	useGetYoutubeAuthLinkQuery,
	useGetYoutubeChannelInfoQuery
} from "@/store/features/dataSynchronizerPlatform/dataSynchronizerAPISlice";
import {useCreateWorkspaceChannelMutation} from "@/store/features/workspace/WorkspaceAPISlice";
import {generateSHA256Hash} from "@/utils/helperFunctions";

export default function YoutubeConnectForm({ workspace }) {
	const {data: sessionData} = useSession()
	const router = useRouter()
	const [error, setError] = useState('')
	const [channelCreateErrorState, setChannelCreateErrorState] = useState('')

	const [uniqueSessionId, setUniqueSessionId] = useState(generateSHA256Hash())
	const [youtubeAuthLink, setYoutubeAuthLink] = useState('')
	const {
		data: youtubeLinkData,
		isLoading: youtubeLinkDataIsLoading,
		refetch: refetchYoutubeLinkData,
		error: youtubeLinkDataFetchError,
	} = useGetYoutubeAuthLinkQuery({
		user: uniqueSessionId
	}, {
		skip: !uniqueSessionId
	})

	useEffect(() => {
		if(youtubeLinkData?.code === 200){
			setYoutubeAuthLink(youtubeLinkData?.data)
		}
	}, [youtubeLinkData])


	const [youtubeChannelInfo, setYoutubeChannelInfo] = useState({})
	const {
		data: youtubeChannelInfoData,
		isLoading: youtubeChannelInfoIsLoading,
		refetch: refetchYoutubeChannelInfo,
		error: youtubeChannelInfoFetchError,
	} = useGetYoutubeChannelInfoQuery({
		user: uniqueSessionId
	}, {
		skip: !uniqueSessionId
	})
	useEffect(() => {
		if(youtubeChannelInfoData?.code === 200 && typeof youtubeChannelInfoData?.data !== 'string'){
			setYoutubeChannelInfo(youtubeChannelInfoData?.data)
		}
	}, [youtubeChannelInfoData])


	const [createWorkspaceChannel, {
		isLoading: channelIsCreating,
		error: channelCreateError
	}] = useCreateWorkspaceChannelMutation()

	async function handleSaveChannel(e) {
		e.preventDefault()

		const newChannelData = {
			workspaceId: workspace?.id,
			channelName: youtubeChannelInfo?.name,
			channelType: 'youtube',
			isConnected: true,
			channelData: {
				id: youtubeChannelInfo?.id,
				accountId: youtubeChannelInfo?.id,
				name:youtubeChannelInfo?.name,
				accessToken:youtubeChannelInfo?.access_token,
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
		}else {
			setChannelCreateErrorState(newChannelCreateResponse?.error?.data?.message)
		}

	}

	async function handleOpenAuthLink(){
		setError('')
		if (youtubeAuthLink) {
			const popupWindow = window.open(youtubeAuthLink, '_blank', 'height=600,width=800');
			// Check the popup window URL every 500 milliseconds
			const intervalId = setInterval(checkPopupUrl, 500);
			async function checkPopupUrl() {
				try {
					// Check if the popup window is closed or the cross-origin security prevents accessing the URL
					if (popupWindow.closed || !popupWindow.location.href) {
						clearInterval(intervalId); // Stop checking the URL
						console.log("Popup window closed or blocked by cross-origin security.");
						const data = await refetchYoutubeChannelInfo({
							user: uniqueSessionId
						})
						console.log("response", data?.data)
						if (data?.data?.code !== 200) {
							setError("Authentication field, please try again")
						}
					}
				} catch (error) {
					// Cross-origin security may prevent accessing the popup window URL
					console.error(error);
				}
			}
		}
	};


	async function handleGetAuthLinkClick(){
		refetchYoutubeLinkData({
			user: uniqueSessionId
		})
	}
	const [createdChannelData, setCreatedChannelData] = useState(null)

	return (
		<div className="mt-2 -space-y-px rounded-md">
			{ !youtubeAuthLink && (
				<div className={`my-4`}>
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
						onClick={()=>handleGetAuthLinkClick()}
					>
						Generate authentication Link
					</button>
				</div>
			)}
			{
				youtubeAuthLink && Object.keys(youtubeChannelInfo).length <= 0 && (
					<div className={`my-4`}>
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
							onClick={()=> handleOpenAuthLink()}
						>
							Authenticate with YouTube
						</button>
						{error !== "" ? (
							<p className="text-red-500 text-sm mt-2 sm:flex sm:flex-row">{error}</p>) : (
							<p></p>)}

					</div>
				)
			}
			{/*<Dump data={youtubeChannelInfo }/>*/}
			{
				youtubeAuthLink && Object.keys(youtubeChannelInfo).length > 0 && (
					<>
						<h2 className="text-base font-semibold leading-7 text-gray-900">Authenticated Channel : </h2>
						<div className="flex flex-row justify-start">
							<div className="h-11 w-11 flex-shrink-0 mr-4 mt-2">
								<img className="h-11 w-11 rounded-full"
									 src={ youtubeChannelInfo?.thumbnails?.medium?.url }
									 alt="Channel Icon"/>

							</div>
							<span className="mt-2 block truncate font-semibold"
							>
								{youtubeChannelInfo?.name}
								<p className="text-sm leading-6 text-gray-600">
								{youtubeChannelInfo?.id}
							</p>
							</span>

						</div>

						<div
							className="mt-8"
						>
							{channelCreateErrorState && (
								<p className="text-red-500 text-sm mt-2 sm:flex sm:flex-row">{channelCreateErrorState}</p>)
							}
							<button
								type="button"
								className="mt-4 inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
								onClick={(event)=> handleSaveChannel(event)}
							>
								Save & Continue
							</button>
						</div>
					</>

				)
			}

		</div>
	)
}
