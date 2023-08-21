"use client"

import {useSelector} from "react-redux";
import React from "react";

import AgentAvailabilityStatusControlModal
	from "@/components/Agent/Dashboard/modals/AgentAvailabilityStatusControlModal";
import AgentDashboardDataStreamReceiver
	from "@/components/layouts/AgentDashboardLayout/AgentDashboardDataStreamReceiver";
import Head from "next/head";


export default function AgentDashboardLayoutProvider({ children, streamFunctions }){
	const agentDashboardProviderData = useSelector(state => state.agentDashboardProviderData)

	return (
		<div>
			<Head>
				<title>Agent Dashboard</title>
			</Head>

			<AgentDashboardDataStreamReceiver
				apiUrl={'/api/agent/agentDashboardProvider'}
				functions={streamFunctions}
			/>

			<AgentAvailabilityStatusControlModal />

			{
				agentDashboardProviderData.loading === false &&
				agentDashboardProviderData.loaded === true &&
				agentDashboardProviderData.percent_complete === 100 &&
				children
			}
		</div>
	)
}