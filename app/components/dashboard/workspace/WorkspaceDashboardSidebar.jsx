import WorkspaceDashboardSidebarDesktop from "./WorkspaceDashboardSidebarDesktop";
import WorkspaceDashboardSidebarMobile from "./WorkspaceDashboardSidebarMobile";

export default function WorkspaceDashboardSidebar(){
	return (
		<>
			{/* Sidebar for Mobile */}
			<WorkspaceDashboardSidebarMobile />

			{/* Static sidebar for desktop */}
			<WorkspaceDashboardSidebarDesktop />
		</>
	)
}