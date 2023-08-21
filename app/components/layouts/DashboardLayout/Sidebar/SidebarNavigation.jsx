import {Bars4Icon, ClockIcon, HomeIcon} from "@heroicons/react/24/outline";

const navigation = [
	{ name: 'Home', href: '#', icon: HomeIcon, current: true },
	{ name: 'My tasks', href: '#', icon: Bars4Icon, current: false },
	{ name: 'Recent', href: '#', icon: ClockIcon, current: false },
]



const teams = [
	{ name: 'Engineering', href: '#', bgColorClass: 'bg-indigo-500' },
	{ name: 'Human Resources', href: '#', bgColorClass: 'bg-green-500' },
	{ name: 'Customer Success', href: '#', bgColorClass: 'bg-yellow-500' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function SidebarPrimaryNavigation() {
	return (
		<div className="my-4 space-y-1">
			{navigation.map((item) => (
				<a
					key={item.name}
					href={item.href}
					className={classNames(
						item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
						'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
					)}
					aria-current={item.current ? 'page' : undefined}
				>
					<item.icon
						className={classNames(
							item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
							'mr-3 flex-shrink-0 h-6 w-6'
						)}
						aria-hidden="true"
					/>
					{item.name}
				</a>
			))}
		</div>
	)
}

function SidebarSecondaryNavigation() {
	return (
		<div className="mt-4">
			{/* Secondary navigation */}
			<h3 className="px-3 text-sm font-medium text-gray-500" id="desktop-teams-headline">
				Teams
			</h3>

			<div className="mt-1 space-y-1" role="group" aria-labelledby="desktop-teams-headline">
				{teams.map((team) => (
					<a
						key={team.name}
						href={team.href}
						className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
					>
                      <span
	                      className={classNames(team.bgColorClass, 'w-2.5 h-2.5 mr-4 rounded-full')}
	                      aria-hidden="true"
                      />
						<span className="truncate">{team.name}</span>
					</a>
				))}
			</div>
		</div>
	)
}

export default function SidebarNavigation() {
	return (
		<nav className="mt-6 px-3">
			<SidebarPrimaryNavigation />

			<SidebarSecondaryNavigation />
		</nav>
	)
}