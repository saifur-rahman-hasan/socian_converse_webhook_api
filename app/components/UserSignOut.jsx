import Link from "next/link";
import {signOut} from "next-auth/react";
import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/router";
import {useCreateAgentActivityMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";

export default function UserSignOut({ className, children }){
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const [createAgentActivity] = useCreateAgentActivityMutation()

	async function handleDashboardLogout(e) {
		e.preventDefault()

		setLoading(true)

		await createAgentActivity({
			"activityType": "loggedIn",
			"activityInfo":"User is logged out from the system",
			"activityState":"end"
		})

		const REDIRECT_TO_URL = process.env.NEXT_PUBLIC_APP_URL || '/'

		const data = await signOut({
			redirect: false,
			callbackUrl: REDIRECT_TO_URL
		})

		await router.push(data.url)

		setLoading(false)
	}

	return (
		<Link
			className={className}
			href={'/auth/logout'}
			onClick={(e) => handleDashboardLogout(e)}
		>
			{
				loading
				? <LoadingCircle size={4} />
				: children || 'Sign Out'
			}
		</Link>
	)
}