import React, { useState, useEffect } from 'react';
import AlertWarning from "../ui/alerts/AlertWarning";

export default function AgentInactivityAlert() {
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		let timeoutId;
		function handleUserActivity() {
			setIsActive(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setIsActive(false), 10000);
		}

		document.addEventListener('mousemove', handleUserActivity);
		document.addEventListener('keypress', handleUserActivity);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('mousemove', handleUserActivity);
			document.removeEventListener('keypress', handleUserActivity);
		};
	}, []);

	if (!isActive) {
		return <AlertWarning title={`Attention needed`} message={'You are inactive for while. You have to login again to access your agent dashboard'} />
	}

	return null;
}
