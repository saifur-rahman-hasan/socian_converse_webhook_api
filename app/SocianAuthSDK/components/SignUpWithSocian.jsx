import SocianAuthClient from "@socian/socian-auth-client";
import SOCIAN_AUTH_CLIENT_CONFIG from "../SocianAuthClientConfig";
import {
	SOCIAN_AUTH_SERVER_FRONTEND_BASE_URL
} from '@socian/socian-auth-client/dist/SocianAuthClientConfig'
import { build_url } from '@socian/socian-auth-client/dist/SocianAuthHelper'

function SignUpWithSocian({ text, callback_url, className }){
	const authClient = new SocianAuthClient(SOCIAN_AUTH_CLIENT_CONFIG);

	if(!authClient){
		alert('Auth Client is not defined.');
		return null;
	}

	const handleLinkClick = async (e) => {
		e.preventDefault()
		if (!authClient) return false;

		try {
			// Create intent
			const newIntent = await authClient.create_intent(
				"auth.signUp",
				callback_url,
				"json",
				"users.find,users.create"
			)

			const newIntentId = newIntent?.intent_id

			if (!newIntentId) throw new Error("Intent Id is not found in the intent object.")

			let signUpLink = `${SOCIAN_AUTH_SERVER_FRONTEND_BASE_URL}/auth/signUp`

			if(callback_url){
				signUpLink = build_url({
					url: signUpLink,
					query_object: {
						intent_id: newIntentId,
						callback: callback_url
					}
				})
			}

			window.location.href = signUpLink

		}catch (e) {
			alert(e.message)
		}
	}

	return (
		<button
			type={`button`}
			className={`${className}`}
			onClick={handleLinkClick}
		>
			{ text || 'Sign Up' }
		</button>
	)
}

export default SignUpWithSocian