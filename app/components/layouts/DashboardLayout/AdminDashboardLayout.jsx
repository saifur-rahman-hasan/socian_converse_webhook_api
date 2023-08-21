import AdminDashboardSidebar from "./Sidebar/AdminDashboardSidebar";
import Head from "next/head";
import DashboardSearchHeader from "./DashboardSearchHeader";

export default function AdminDashboardLayout({ children }) {
	return (
		<div className={`min-h-full`}>
			<Head>
				<title>Admin Dashboard - Converse</title>
			</Head>

			{/* Sidebar */}
			<AdminDashboardSidebar />

			{/* Main column */}
			<div className="flex flex-col lg:pl-64 md:pl-64">
				{/* Search header */}
				<DashboardSearchHeader />

				<main className="flex-1">
					{ children }
				</main>
			</div>
		</div>
	)
}
