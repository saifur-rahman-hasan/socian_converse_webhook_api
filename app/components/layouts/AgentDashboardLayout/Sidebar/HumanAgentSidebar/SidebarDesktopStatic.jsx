import {
	ArchiveBoxIcon,
	Bars4Icon, ClockIcon,
	HomeIcon, ListBulletIcon,
	UserCircleIcon as UserCircleIconOutline
} from "@heroicons/react/24/outline";
import SocianConverseLogo from "../../../../media/SocianConverseLogo";
import DefaultGravatar from "@/components/DefaultGravatar";
import {BiSolidAddToQueue} from "react-icons/bi";

const navigation = [
	{ name: 'Queue Tasks', href: '/agent/queue-tasks', icon: BiSolidAddToQueue, current: true },
	{ name: 'Closed Tasks', href: '#', icon: ArchiveBoxIcon, current: false },
	{ name: 'Recent Tasks', href: '#', icon: ClockIcon, current: false },
	{ name: 'Activity Log', href: '#', icon: ListBulletIcon, current: false },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function SidebarDesktopStatic(){
	return (
		<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex h-16 flex-shrink-0 items-center bg-gray-800 px-4">
					<DefaultGravatar className="h-8 w-auto" />
				</div>
				<div className="flex flex-1 flex-col overflow-y-auto bg-gray-800 pt-5">
					<p className="px-3 text-sm font-medium text-gray-400">Manage Tasks</p>

					<nav className="flex-1 px-2 py-4">
						<div className="space-y-1">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									<item.icon
										className={classNames(
											item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
											'mr-3 flex-shrink-0 h-6 w-6'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</a>
							))}
						</div>
					</nav>
				</div>
			</div>
		</div>
	)
}