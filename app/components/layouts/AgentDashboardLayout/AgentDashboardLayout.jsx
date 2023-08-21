import { useState } from 'react'
import { useSelector} from "react-redux";
import AgentDashboardSidebar from "@/components/Agent/Dashboard/Sidebar/AgentDashboardSidebar";
import CenteredContentLayout from "@/components/dashboard/layouts/CenteredContentLayout";
import Head from "next/head";
import useAuthUserSlice from "@/hooks/useAuthUserSlice";

export default function AgentDashboardLayout({ workspaceId, agentId, children }) {
	const { isAdmin, isAgent } = useAuthUserSlice()


	return (
		<>
			<Head>
				<title>Agent Dashboard</title>
			</Head>

			<div className="min-h-full">


				<AgentDashboardSidebar
					workspaceId={workspaceId}
					agentId={agentId}
				/>

				{/* Main column */}
				<div className="flex flex-col lg:pl-64">
					<main className="flex-1">
						{ children }
					</main>
				</div>
			</div>

		</>
	)
}
