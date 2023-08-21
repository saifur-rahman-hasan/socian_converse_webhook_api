import AppbarMobile from "../appbar/AppbarMobile";
import AdminSidebarDesktop from "../sidebar/AdminSidebarDesktop";
import AdminSidebarMobile from "../sidebar/AdminSidebarMobile";
import {useSession} from "next-auth/react";

export default function AdminDashboardLayout({ children }) {
	const { status, data } = useSession({
		required: true,
		onUnauthenticated() {
			// The user is not authenticated, handle it here.
			alert(`The user is not authenticated, handle it here.`)
		},
	})

	if (status === "loading") {
		return "Loading or not authenticated..."
	}

	return (
		<>
			<div className="min-h-full">
				{/* Sidebar for Mobile */}
				<AdminSidebarMobile />

				{/* Sidebar for desktop */}
				<AdminSidebarDesktop />

				{/* Appbar */}
				<div className="flex flex-col lg:pl-64">
					<AppbarMobile />
				</div>
				{/* End Appbar */}

				{/* Main Section */}
				<main>
					<div className="flex flex-col lg:pl-64">
						<div className="flex-1">
							{ children }
						</div>
					</div>
				</main>
				{/*	 End Main Section */}

			</div>
		</>
	)
}
