import {useRouter} from "next/router";
import {
	useDeleteWorkspaceChannelMutation,
	useGetWorkspaceByIdQuery
} from "@/store/features/workspace/WorkspaceAPISlice";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import ListSkeleton from "@/components/ui/Skeleton/ListSkeleton";
import EmptyStates from "@/components/ui/EmptyStates";
import {PlusIcon, UserIcon} from "@heroicons/react/20/solid";
import {ChatBubbleBottomCenterTextIcon, ExclamationTriangleIcon, TrashIcon} from "@heroicons/react/24/outline";
import ChannelIcon from "@/components/Converse/ConverseMessengerApp/ChannelIcon";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import {GoInfo} from "react-icons/go";
import useAuthUserSlice from "@/hooks/useAuthUserSlice";

export default function WorkspaceChannelExplorer({ className }) {
	const router = useRouter()
	const {workspaceId} = router.query
	const [ channels, setChannels ] = useState([])

	// Define your RTK query hook
	const {
		data: workspaceData,
		isLoading: workspaceDataIsLoading,
		error: workspaceDataFetchError
	} = useGetWorkspaceByIdQuery(workspaceId, { skip: !workspaceId})

	useEffect(() => {
		const workspaceChannels = workspaceData?.channels || []
		setChannels(workspaceChannels)
	}, [workspaceData])

	return (
		<div className={className}>
			<div className="px-4">
				<div className="sm:flex sm:items-center">

					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">Channel Explorer</h1>
						<p className="mt-2 text-sm text-gray-700">
							Discover Integrated Channels for Your Workspace
						</p>
					</div>

					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						{channels?.length > 0 && (
							<Link
								href={`/workspaces/${workspaceId}/integrations`}
								className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Add New Channel
							</Link>
						)}
					</div>

				</div>

				{ workspaceDataIsLoading && <ListSkeleton count={3} /> }

				{ !workspaceDataIsLoading && channels?.length === 0 && (
					<EmptyStates
						className={`my-20`}
						title={'Channel Not Found'}
						message={'You have not added any channels for this workspace.'}
						action={(
							<Link
								href={`/workspaces/${workspaceId}/integrations`}
								className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								<PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
								Add New Channel
							</Link>
						)}
					/>
				)}

				{ channels?.length > 0 && (
					<div className="mt-8 flow-root">
						<div className="overflow-x-auto">
							<div className="inline-block min-w-full py-2 align-middle">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
									<tr>
										<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
											Channel Info
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Title
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Status
										</th>
										<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
											Last Update
										</th>
										<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
											<span className="sr-only">Edit</span>
										</th>
									</tr>
									</thead>

									<tbody className="divide-y divide-gray-200 bg-white">
										{channels.map((channel) => (
											<ChannelListItem
												key={`channelListItem_${channel.id}`}
												channel={channel}
												workspaceId={workspaceId}
											/>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}


function ChannelInboxAccessLink({ authorized = false, workspaceId, channelId}) {

	const {
		isAdmin,
		isAgent,
		isSupervisor,
		isQCManager
	} = useAuthUserSlice()

	const router = useRouter()
	const [loading, setLoading] = useState(false)

	if(!authorized){
		return <GoInfo className={`h-5 w-5`} />
	}

	async function handleClick(e){
		e.preventDefault()

		setLoading(true)

		let pathname = `/workspaces/[workspaceId]/converse`
		const hasQCManagerRoleOnly =  isQCManager && !isAdmin && !isAgent && !isSupervisor
		const hasAgentRoleOnly =  isAgent && !isAdmin && !isQCManager && !isSupervisor

		if(hasQCManagerRoleOnly){
			pathname = `/workspaces/[workspaceId]/QCManager/dashboard`
		} else if(hasAgentRoleOnly){
			pathname = `/workspaces/[workspaceId]/agent/dashboard`
		}

		await router.push({
			pathname: pathname,
			query: { workspaceId, channelId }
		})
	}

	let linkContent = (
		<button
			type={`button`}
			className="text-indigo-600 hover:text-indigo-900"
			onClick={handleClick}
		>
			<ChatBubbleBottomCenterTextIcon className={`h-5 w-5`} />
		</button>
	)

	if(loading){
		linkContent = (<LoadingCircle size={5} /> )
	}

	return linkContent
}

function ChannelListItem({ workspaceId, channel }) {
	async function handleDeleteChannel(channel) {
		const confirmText = "Confirm delete channel"
		const confirmValue = prompt(`Are you sure to delete the channel? Write here "${confirmText}"`)

		if(confirmValue !== confirmText){
			alert("Your Confirmation is not correct")
			return false
		}

		const { workspaceId, id: channelId } = channel
		await deleteChannel({ workspaceId, channelId })
	}

	const [deleteChannel, {
		isLoading: deletingChannel,
		error: deleteChannelError
	}] = useDeleteWorkspaceChannelMutation()

	return (
		<tr>
			<td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
				<div className="flex items-center">
					<div className="h-11 w-11 flex-shrink-0">
						<ChannelIcon
							channelType={channel.channelType}
							size={35}
						/>
					</div>
					<div className="ml-4 item">
						<div className="font-medium text-gray-900">{channel?.channelName}</div>
						<div className="mt-1 text-gray-500">{channel.channelId}</div>
					</div>
				</div>
			</td>
			<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
				<div className="text-gray-900">{channel.title}</div>
				<div className="mt-1 text-gray-500">{channel.department}</div>
			</td>
			<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                { channel?.isConnected ? 'Connected': 'Not Connected' }
              </span>
			</td>
			<td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{channel?.updatedAt}</td>
			<td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium">
				<div className={`flex items-center gap-x-4`}>

					<ChannelInboxAccessLink
						authorized={channel?.channelData?.authorized || false}
						workspaceId={workspaceId}
						channelId={channel.id}
					/>


					<button
						className="text-red-600 hover:text-red-900">
						{ deletingChannel && <LoadingCircle size={5} /> }
						{ !deletingChannel && <TrashIcon
							className={`w-5 h-5`}
							onClick={() => handleDeleteChannel(channel) }
						/>}

						<span className="sr-only">, {channel.channelName}</span>
					</button>
				</div>
			</td>
		</tr>
	);
}