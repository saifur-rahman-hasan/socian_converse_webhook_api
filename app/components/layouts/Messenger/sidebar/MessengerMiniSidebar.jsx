import classNames from "../../../../utils/classNames";
import {
	ArchiveBoxIcon as ArchiveBoxIconOutline,
	FlagIcon,
	InboxIcon, NoSymbolIcon, PencilSquareIcon,
	UserCircleIcon
} from "@heroicons/react/24/outline";

const sidebarNavigation = [
	{ name: 'Open', href: '#', icon: InboxIcon, current: true },
	{ name: 'Archive', href: '#', icon: ArchiveBoxIconOutline, current: false },
	{ name: 'Customers', href: '#', icon: UserCircleIcon, current: false },
	{ name: 'Flagged', href: '#', icon: FlagIcon, current: false },
	{ name: 'Spam', href: '#', icon: NoSymbolIcon, current: false },
	{ name: 'Drafts', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Drafts', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftss', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftsss', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftssss', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftsssss', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftssssss', href: '#', icon: PencilSquareIcon, current: false },
	{ name: 'Draftsssssss', href: '#', icon: PencilSquareIcon, current: false },
]

export default function MessengerMiniSidebar(){
	return (
		<nav aria-label="Sidebar" className="hidden lg:block lg:flex-shrink-0 lg:overflow-y-auto lg:bg-gray-800">
			<div className="relative flex w-20 flex-col space-y-3 p-3">
				{sidebarNavigation.map((item) => (
					<a
						key={item.name}
						href={item.href}
						className={classNames(
							item.current ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700',
							'inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg'
						)}
					>
						<span className="sr-only">{item.name}</span>
						<item.icon className="h-6 w-6" aria-hidden="true" />
					</a>
				))}
			</div>
		</nav>
	)
}