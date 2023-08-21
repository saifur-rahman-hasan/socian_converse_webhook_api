import {
	HomeIcon,
	InboxIcon,
	FolderIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useRouter} from "next/router";
import classNames from "@/utils/classNames";
import SidebarUserAccountDropdown from "@/components/dashboard/sidebar/SidebarUserAccountDropdown";
import {ArrowLeftIcon, QueueListIcon, UserCircleIcon} from "@heroicons/react/24/solid";


function getDefaultNavigations() {
	return [
		{ id: 1, name: 'Back to Dashboard', href: '/dashboard', icon: ArrowLeftIcon, current: false },
	]
}

function getWorkspaceNavigations() {
	return [
		{ id: 2, name: 'Inbox', href: `/agent/dashboard/inbox`, icon: InboxIcon, current: false },
		{ id: 3, name: 'Activity Log', href: `/agent/dashboard/activityLogs`, icon: QueueListIcon, current: false },
	]
}

export default function AgentDashboardSidebarDesktop(){
	const router = useRouter();

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

						{
							getWorkspaceNavigations().map((item) => (
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