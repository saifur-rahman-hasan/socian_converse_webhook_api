import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
	calculatePercentComplete, updateAgentActiveTask,
	updateAgentAuthorization, updateAgentAvailabilityStatus,
	updateAgentData, updateAgentOnlineStatus, updateAgentQueueTasks, updateAgentWorkspaces
} from "@/store/features/agentDashboard/AgentDashboardSlice";
import FixedCenteredLayout from "@/components/layouts/FixedCenteredLayout";
import axios from "axios";
import ConverseLogo from "@/components/global/ConverseLogo";

export default function AgentDashboardDataStreamReceiver({ apiUrl, functions }){
	const agentDashboardProviderData = useSelector(state => state.agentDashboardProviderData)

	const [streamData, setStreamData] = useState('');
	const [streamRecordsData, setStreamRecordsData] = useState([]);
	const [isStreaming, setIsStreaming] = useState(true);
	const dispatch = useDispatch();

	const startStream = () => {
		setStreamRecordsData([]);
		setStreamData('')
		setIsStreaming(true);
	};

	const stopStream = () => {
		setIsStreaming(false);
	};

	useEffect(() => {
		let eventSource;

		if (apiUrl && isStreaming) {
			const fetchData = async () => {

				const mergedArray = [];

				if(functions?.length > 0){
					for (const runFunc of functions) {
						const existingFuncIndex = mergedArray.findIndex(item => item.func === runFunc.func);
						if (existingFuncIndex === -1) {
							mergedArray.push(runFunc);
						}
					}
				}


				const uniqueFunctions = mergedArray
				const encryptedRes = await axios.post('/api/crypto/encrypt', { functions: uniqueFunctions })
				const encryptedData = await encryptedRes?.data?.data?.encryptedData || null

				const buildApiUrl = apiUrl + `?encryptedData=${encryptedData}`;

				eventSource = new EventSource(buildApiUrl);
				eventSource.addEventListener('message', async (event) => {
					const eventData = JSON.parse(event.data);

					if (eventData.agent) {
						try {
							await dispatch(updateAgentData(eventData.agent));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent data:', error);
						}
					}

					if (eventData.agentAuthorization) {
						try {
							dispatch(updateAgentAuthorization(eventData.agentAuthorization));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent authorization:', error);
						}
					}

					if (eventData.agentAvailabilityStatus) {
						try {
							dispatch(updateAgentAvailabilityStatus(eventData.agentAvailabilityStatus));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent availability status:', error);
						}
					}

					if (eventData.agentOnlineStatus) {
						try {
							dispatch(updateAgentOnlineStatus(eventData.agentOnlineStatus));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent online status:', error);
						}
					}

					if (eventData?.agentWorkspaces) {
						try {
							dispatch(updateAgentWorkspaces(eventData.agentWorkspaces));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent workspaces:', error);
						}
					}

					if(eventData?.agentActiveTask){
						try {
							dispatch(updateAgentActiveTask(eventData.agentActiveTask));
							dispatch(calculatePercentComplete());
						} catch (error) {
							console.error('Error updating agent active task:', error);
						}
					}

					setStreamRecordsData((prevData) => [...prevData, event.data]);
					setStreamData(eventData);
				});

				eventSource.addEventListener('error', (error) => {
					console.error('Stream error:', error);
					eventSource.close();
				});
			};

			fetchData();
		}

		return () => {
			eventSource?.close();
		};
	}, [apiUrl, functions, isStreaming, dispatch]);

	return (
		<div>
			{
				agentDashboardProviderData.loading === true &&
				agentDashboardProviderData.loaded === false &&
				(<FixedCenteredLayout>
					<div className={`w-1/4 mx-auto`}>

						<ConverseLogo className={`w-20 h-20 mx-auto my-10`} />

						<AgentDashboardSteamDataLoadingProgress percentComplete={agentDashboardProviderData?.percent_complete} />
					</div>
				</FixedCenteredLayout>)
			}
		</div>
	);
}


function AgentDashboardSteamDataLoadingProgress({ percentComplete }) {
	return (
		<div className="w-full bg-gray-400 rounded-full h-1.5 mb-4 dark:bg-gray-400">
			<div
				className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
				style={{ width: `${percentComplete}%`}}></div>
		</div>
	)
}