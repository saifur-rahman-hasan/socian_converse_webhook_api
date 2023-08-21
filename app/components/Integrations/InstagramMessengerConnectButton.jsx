import React, {useEffect, useState} from 'react';
import Dump from '@/components/Dump';

export default function InstagramMessengerConnectButton({ onConnectResponse, appId, appPermissions }){
	const [authResponse, setAuthResponse] = useState(null);

	useEffect(() => {
		onConnectResponse(authResponse)
	}, [authResponse])

	const handleClick = () => {
		const permissionsQueryParam = appPermissions.join(',');
		const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/integrations/instagramMessenger/account-connect-callback`);

		const instagramAuthDialogUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&display=page&extras=%7B%22setup%22%3A%7B%22channel%22%3A%22IG_API_ONBOARDING%22%7D%7D&redirect_uri=${redirectUri}&response_type=token&scope=${permissionsQueryParam}`;
		// Open the dialog window
		const authWindow = window.open(instagramAuthDialogUrl, '_blank', 'width=fit,height=fit');
		// const authWindow = window.open('/dialog', '_blank', 'width=auto,height=auto');

		// Track the response of the window
		const handleAuthResponse = (event) => {
			// Check if the event origin matches your redirect_uri
			if (event.origin === window.location.origin) {
				// Display the response in the component
				setAuthResponse(event.data);

				// Remove the event listener
				window.removeEventListener('message', handleAuthResponse);
			}
		};

		// Listen for messages from the dialog window
		window.addEventListener('message', handleAuthResponse);
	};

	return (
		<button
			className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded"
			onClick={handleClick}
		>
			Connect with Instagram Account
		</button>
	);
}
