import {
	HomeIcon,
	InboxIcon,
	UsersIcon,
	FolderIcon,
	CpuChipIcon,
	ChartBarIcon,
	CalendarIcon,
	Cog6ToothIcon,
	ChatBubbleBottomCenterIcon,
	PresentationChartLineIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useRouter} from "next/router";
import classNames from "@/utils/classNames";
import {useGetWorkspaceByIdQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import SidebarUserAccountDropdown from "@/components/dashboard/sidebar/SidebarUserAccountDropdown";
import {BriefcaseIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {useEffect, useState} from "react";
import {TbMessageSearch} from "react-icons/tb";
import {GiAquarium} from "react-icons/gi";
import {PuzzlePieceIcon} from "@heroicons/react/20/solid";


function getDefaultNavigations() {
	return [
		{ id: 1, name: 'Home', href: '/dashboard', icon: HomeIcon, current: false },
		{ id: 2, name: 'Workspaces', href: '/workspaces', icon: FolderIcon, current: false },
	]
}

function getWorkspaceNavigations(workspaceId) {
	return [
		{ id: 3, name: 'Agent Dashboard', href: `/workspaces/${workspaceId}/agent/dashboard`, icon: BriefcaseIcon },
		{ id: 4, name: 'QC Manager Dashboard', href: `/workspaces/${workspaceId}/QCManager/dashboard`, icon: TbMessageSearch },
		{ id: 5, name: 'Channels', href: `/workspaces/${workspaceId}/channels`, icon: CpuChipIcon, current: false },
		{ id: 6, name: 'Integrations', href: `/workspaces/${workspaceId}/integrations`, icon: PuzzlePieceIcon, current: false },
		{ id: 7, name: 'Teams & Members', href: `/workspaces/${workspaceId}/teams`, icon: UsersIcon, current: false },
		{ id: 8, name: 'Calendar', href: `/workspaces/${workspaceId}/calendar`, icon: CalendarIcon, current: false },
		{ id: 9, name: 'Reports', href: `/workspaces/${workspaceId}/reports`, icon: PresentationChartLineIcon, current: false },
		{ id: 10, name: 'Settings', href: `/workspaces/${workspaceId}/tagsAndTemplates`, icon: Cog6ToothIcon, current: false },
	]
}

export default function WorkspaceDashboardSidebarDesktop(){
	const router = useRouter();
	const {workspaceId} = router.query

	// Define your RTK query hook
	const {
		data: workspaceData,
		isLoading: workspaceIsLoading,
		isError: workspaceFetchError
	} = useGetWorkspaceByIdQuery(workspaceId)

	const [activeNavItem, setActiveNavItem] = useState(getWorkspaceNavigations(workspaceData?.id));
	useEffect(() => {
		let updatedNavigation = getWorkspaceNavigations(workspaceData?.id).map((item) => {
			return {
				...item,
				current: item.href === router.asPath
			};
		});
		setActiveNavItem(updatedNavigation);
	}, [workspaceData,router.pathname]);

	return (
		<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex min-h-0 flex-1 flex-col bg-gray-800">
				<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
					<div className="flex flex-shrink-0 items-center px-4">
						<img
							className="h-8 w-auto"
							src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
							alt="Your Company"
						/>
					</div>

					<nav className="mt-5 flex-1 space-y-2 px-2">
						{
							(! workspaceIsLoading && !workspaceFetchError && workspaceData?.id !== undefined) &&
							getDefaultNavigations().map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
									)}
								>
									<item.icon
										className={classNames(
											item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
											'mr-3 h-6 w-6 flex-shrink-0'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							))
						}

						<div className="text-xs font-bold text-gray-400 pt-6 pb-1 px-2">
							{ workspaceData?.name }
						</div>

						{
							(! workspaceIsLoading && !workspaceFetchError && workspaceData?.id !== undefined) &&
							activeNavItem?.length>0 && activeNavItem.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
									)}
								>
									<item.icon
										className={classNames(
											item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
											'mr-3 h-6 w-6 flex-shrink-0'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</Link>
							))
						}
					</nav>
				</div>

				<SidebarUserAccountDropdown />
			</div>
		</div>
	)
}