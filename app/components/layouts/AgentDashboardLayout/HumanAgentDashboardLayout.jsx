import { useState } from 'react'
import {
	Bars3BottomLeftIcon,
	MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import SidebarNavigationDrawer from "./Sidebar/HumanAgentSidebar/SidebarNavigationDrawer";
import SidebarDesktopStatic from "./Sidebar/HumanAgentSidebar/SidebarDesktopStatic";


export default function HumanAgentDashboardLayout({ children, header }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<>
			<div className="flex min-h-full">

				{/* Human Agent Sidebar sidebar for desktop */}
				<SidebarNavigationDrawer />

				{/* Static sidebar for desktop */}
				<SidebarDesktopStatic />


				<div className="flex w-0 flex-1 flex-col lg:pl-64">
					{ header }

					{/* Main */}
					<main>
						{ children }
					</main>
				</div>
			</div>
		</>
	)
}
