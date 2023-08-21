import React, { useEffect, useState } from 'react';
import {socket} from "@/socket/socket";
import {debugLog} from "@/utils/helperFunctions";

const SocketEventListener: React.FC = () => {
	const [logs, setLogs] = useState<string[]>([]);

	useEffect(() => {
		// Connect to the socket server
		// Listen to public events
		socket.on('events', (data: any) => {
			const newLog = `Public Event: ${JSON.stringify(data)}`;
			setLogs(prevLogs => [...prevLogs, newLog]);
		});

		// Listen to private events (assuming you have authentication)
		socket.on('__converseMessenger__2_3_13586__agent:task:closed', (data: any) => {
			alert(1)
			debugLog('__converseMessenger__2_3_13586__agent:task:closed Data', data)
			const newLog = `__converseMessenger__2_3_13586__agent:task:closed: ${JSON.stringify(data)}`;
			setLogs(prevLogs => [...prevLogs, newLog]);
		});

		// Clean up when the component unmounts
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div>
			<h2>Socket Event Logs</h2>
			<ul>
				{logs.map((log, index) => (
					<li key={index}>{log}</li>
				))}
			</ul>
		</div>
	);
};

export default SocketEventListener;
