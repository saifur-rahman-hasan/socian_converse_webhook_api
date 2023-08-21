import Link from "next/link";
import classNames from "@/utils/classNames";
import {
	ArchiveBoxIcon as ArchiveBoxIconOutline, FlagIcon,
	HomeIcon,
	InboxIcon, NoSymbolIcon, PencilSquareIcon,
	UserCircleIcon
} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";


function getInboxNavigations(workspaceId) {
	return [
		{
			id: 1,
			name: 'Home',
			href: `/workspaces/${workspaceId}/agent/dashboard`,
			icon: HomeIcon,
			current: false
		},
		{
			id: 2,
			name: 'Open',
			href: `/workspaces/${workspaceId}/agent/dashboard/myTasks`,
			icon: InboxIcon,
			current: false
		},
	]
}

export default function AgentInboxMiniSidebar({ workspaceId, agentId }) {
	const [sidebarNavigations, setSidebarNavigations] = useState([])

	useEffect(() => {
		const sidebarNavigation = getInboxNavigations(workspaceId)

		setSidebarNavigations(sidebarNavigation)
	}, [workspaceId, agentId])

	return (
		<nav aria-label="Sidebar" className="hidden lg:block lg:flex-shrink-0 lg:overflow-y-auto lg:bg-gray-800">
			<div className="relative flex w-20 flex-col space-y-3 p-3">
				{sidebarNavigations.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						className={classNames(
							item.current ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700',
							'inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg'
						)}
					>
						<span className="sr-only">{item.name}</span>
						<item.icon className="h-6 w-6" aria-hidden="true" />
					</Link>
				))}
			</div>
		</nav>
	);
}