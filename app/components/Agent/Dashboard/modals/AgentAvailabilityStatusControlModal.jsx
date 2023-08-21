import {Fragment, useEffect, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {useDispatch, useSelector} from "react-redux";
import {
	updateAgentAvailabilityStatus,
} from "@/store/features/agentDashboard/AgentDashboardSlice";
import {useCreateAgentActivityMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {FaUserCog} from "react-icons/fa";
import AgentAvailabilityStatusForm from "@/components/Agent/Dashboard/modals/AgentAvailabilityStatusForm";
import Dump from "@/components/Dump";
import {useGetWorkspaceByIdQuery} from "@/store/features/workspace/WorkspaceAPISlice";

const availabilityList = [
	{ id: 'available', title: 'Available', description: 'Available to receive task' },
	{ id: 'unavailable', title: 'Unavailable', description: 'Unavailable to receive task' },
	{ id: 'break', title: 'Break', description: 'Lets take a break' },
]

export default function AgentAvailabilityStatusControlModal() {
	const router = useRouter()
	const session = useSession()

	const workspaceId = parseInt(router?.query?.workspaceId || 0)
	const agentId = parseInt(session?.data?.user?.id)
	const dispatch = useDispatch()
	const agentDashboardProviderData = useSelector(state => state.agentDashboardProviderData)
	const open_command_modal = agentDashboardProviderData.data?.agentAvailabilityStatus?.open_command_modal || false
	const agentLoadedAvailabilityStatus = agentDashboardProviderData.data?.agentAvailabilityStatus || null
	const [open, setOpen] = useState(false)
	const [selectedAvailabilityStatus, setSelectedAvailabilityStatus] = useState(null)
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


	useEffect(() => {
		setOpen(open_command_modal === true)
		setSelectedAvailabilityStatus(agentLoadedAvailabilityStatus?.data)
	}, [agentLoadedAvailabilityStatus])


	const handleCommandClose = async () => {
		await dispatch(updateAgentAvailabilityStatus({
			...agentLoadedAvailabilityStatus,
			open_command_modal: false,
			data: selectedAvailabilityStatus
		}))

		setOpen(false)
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-30" onClose={handleCommandClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-filter backdrop-blur-sm transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">

								<div>
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<FaUserCog className="h-6 w-6 text-green-600" aria-hidden="true" />
									</div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
											Control your availability status
										</Dialog.Title>
									</div>
								</div>

								<AgentAvailabilityStatusForm
									workspaceId={workspaceId}
									agentId={agentId}
									loadedAvailabilityStatus={agentLoadedAvailabilityStatus.data}
									channels={channels}
								/>

							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
