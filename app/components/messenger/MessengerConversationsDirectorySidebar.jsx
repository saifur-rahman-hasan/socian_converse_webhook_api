"use client"

import MessengerChannelSelection from "@/components/Converse/ConverseMessengerApp/MessengerChannelSelection";
import MessengerChatConversationSearchModal from "@/components/Converse/ConverseMessengerApp/MessengerChatConversationSearchModal";
import Dump from "@/components/Dump";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import { useGetConversationsQuery } from "@/store/features/messenger/MessengerAPISlice";
import {activateConversationSearch, inActivateChatWindow} from "@/store/features/messenger/MessengerInstanceSlice";
import { useGetWorkspaceByIdQuery } from "@/store/features/workspace/WorkspaceAPISlice";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import MessengerChatConversationsList from "./MessengerChatConversationsList";
import {GoReply} from "react-icons/go";

export default function MessengerConversationsDirectorySidebar({ workspaceId }){
	const router = useRouter()
	const [goBackLoading, setGoBackLoading] = useState(false)

	const dispatch = useDispatch()
	const [
		selectedChannel,
		setSelectedChannel
	] = useState(null)

	const {
		data: workspaceData,
		isLoading: workspaceDataIsLoading,
		error: workspaceDataFetchError,
	} = useGetWorkspaceByIdQuery(workspaceId, {
		skip: !workspaceId
	})

	useEffect(() => {
		if(workspaceId > 0 && selectedChannel?.id > 0){

			const redirect = async () => {
				await dispatch(inActivateChatWindow())

				await router.push({
					pathname: `/workspaces/[workspaceId]/converse`,
					query: {
						workspaceId,
						channelId: selectedChannel.id
					}
				})
			}

			redirect()
		}
	}, [selectedChannel])

	function handleSearchConversations() {
		dispatch( activateConversationSearch({ query: '' }) )
	}

	async function handleGoBack() {
		setGoBackLoading(true)
		await router.push({ pathname: '/dashboard' })
	}

	return (
		<aside className="hidden w-96 flex-shrink-0 border-r border-gray-400 xl:order-first xl:flex xl:flex-col h-full overflow-y-auto">

			<div className="bg-white px-6 py-3 flex items-center justify-between gap-x-2">
				{
					goBackLoading
						? <LoadingCircle size={6} />
						: <GoReply
							onClick={handleGoBack}
							className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer" aria-hidden="true"
						/>
				}

				{ workspaceDataIsLoading && (
					<MessengerChannelSelection
						channels={false}
						loading={true}
						onSelect={setSelectedChannel}
					/>
				)}

				{ ! workspaceDataIsLoading && workspaceDataFetchError && <Dump data={{workspaceDataFetchError}} /> }
				{ ! workspaceDataIsLoading && ! workspaceDataFetchError && workspaceData && (
					<div className={`flex-auto`}>
						<MessengerChannelSelection
							channels={workspaceData?.channels}
							onSelect={setSelectedChannel}
						/>
					</div>
				)}

				<MagnifyingGlassIcon
					onClick={handleSearchConversations}
					className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer" aria-hidden="true"
				/>
				<FunnelIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer" aria-hidden="true" />

			</div>

			{
				selectedChannel  && workspaceId && selectedChannel?.id &&
				(
					<MessengerChatConversationsList
						workspaceId={workspaceId}
						channelId={selectedChannel.id}
					/>
				)
			}

			<MessengerChatConversationSearchModal />
		</aside>
	)
}