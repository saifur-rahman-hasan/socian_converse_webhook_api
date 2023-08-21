import classNames from "../../utils/classNames";
import Link from "next/link";
import {useRouter} from "next/router";
import collect from "collect.js";
import ConverseTelegramIntegrationsList from "./Integrations/ConverseTelegramIntegrationsList";
import ConverseMessengerIntegrationsList from "./Integrations/ConverseMessengerIntegrationsList";
import {useGetWorkspaceChannelsQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {useEffect, useState} from "react";

const availableIntegrations = [
	{ id: 'telegram', name: 'Telegram' },
	{ id: 'messenger', name: 'Messenger'},
	{ id: 'facebook', name: 'Facebook' },
	{ id: 'instagram', name: 'Instagram' }
]


export default function ConverseConversationChannels({ workspace }) {
	const router = useRouter()
	const { workspaceId, tab: activeTab } = router?.query
	const [tabs, setTabs] = useState([])
	const [selectedIntegration, setSelectedIntegration]  = useState(null)

	useEffect(() => {
		const tabs = collect(availableIntegrations)
			.map((integration, idx) => {
				return {
					...integration,
					href: `/workspaces/${workspaceId}/converse?tab=${integration.id}`,
					current: integration.id === activeTab
				}
			}).toArray()

		setTabs(tabs)
		setSelectedIntegration(collect(tabs).firstWhere('id', activeTab))

	}, [activeTab, availableIntegrations])

	const {
		data: channelsData,
		isLoading: channelsDataIsLoading,
		error: channelsDataFetchError
	} = useGetWorkspaceChannelsQuery({workspaceId})

	return (
		<div className="relative pb-5 sm:pb-0">
			<div className="md:flex md:items-center md:justify-between">
				<h3 className="text-base font-semibold leading-6 text-gray-900">Your Converse Channels</h3>
				<div className="mt-3 flex md:absolute md:top-3 md:right-0 md:mt-0">
					<Link
						href={`/workspaces/${workspaceId}/integrations`}
						className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add New Channel
					</Link>
				</div>
			</div>

			<div className="mt-8">
				<div className="sm:hidden">
					<label htmlFor="current-tab" className="sr-only">
						Select a tab
					</label>
					<select
						id="current-tab"
						name="current-tab"
						className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						defaultValue={tabs.find((tab) => tab.current)?.name}
					>
						{tabs.map((tab) => (
							<option key={tab.name}>{tab.name}</option>
						))}
					</select>
				</div>

				<div className="hidden sm:block">
					<nav className="-mb-px flex space-x-8">
						{tabs.map((tab) => (
							<Link
								key={tab.name}
								href={tab.href}
								className={classNames(
									tab.id === selectedIntegration?.id
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
									'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
								)}
								aria-current={tab.current ? 'page' : undefined}
								onClick={() => setSelectedIntegration(tab)}
							>
								{tab.name}
							</Link>
						))}
					</nav>
				</div>
			</div>

			<div className={`mt-8 px-8`}>
				{/* Active Tab Content for Telegram */}
				{
					!activeTab || activeTab === 'telegram' && !channelsDataIsLoading && channelsData && (<ConverseTelegramIntegrationsList channels={channelsData}/>)
				}

				{/* Active Tab Content for Messenger */}
				{
					!activeTab || activeTab === 'messenger' && !channelsDataIsLoading && channelsData && (<ConverseMessengerIntegrationsList channels={channelsData}/>)
				}

				{/* Active Tab Content for Facebook */}
				{
					!activeTab || activeTab === 'facebook' && !channelsDataIsLoading && channelsData && (<ConverseTelegramIntegrationsList channels={channelsData}/>)
				}

				{/* Active Tab Content for Instagram */}
				{
					!activeTab || activeTab === 'instagram' && !channelsDataIsLoading && channelsData && (<ConverseTelegramIntegrationsList channels={channelsData}/>)
				}
			</div>

		</div>
	)
}
