import DashboardSidebarMobile from "./DashboardSidebarMobile";
import DashboardSidebarDesktop from "./DashboardSidebarDesktop";

export default function DashboardSidebar(){
	return (
		<>
			{/* Sidebar for Mobile */}
			<DashboardSidebarMobile />

			{/* Static sidebar for desktop */}
			<DashboardSidebarDesktop />
		</>
	)
}