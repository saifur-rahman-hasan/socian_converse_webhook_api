import Link from "next/link";
import {signOut} from "next-auth/react";
import axios from "axios";

export default function DashboardLogout({ children }){
	async function handleDashboardLogout(e) {
		e.preventDefault()

		await signOut({
			redirect: true,
			callbackUrl: process.env.NEXT_PUBLIC_APP_URL || '/'
		})
	}

	return (
		<Link href={'/auth/logout'} onClick={(e) => handleDashboardLogout(e)}>
			{ children || 'Logout'}
		</Link>
	)
}