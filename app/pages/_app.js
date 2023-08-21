import '@/styles/globals.css'
import { SessionProvider, useSession } from "next-auth/react"
import {useEffect} from "react";
import {useRouter} from "next/router";
import store from '../store'
import { Provider } from 'react-redux'
import useOnlineStatus from "../hooks/useOnlineStatus";
import OfflinePage from "../components/OfflinePage";
import DashboardDataProvider from "@/components/dashboard/DashboardDataProvider";

export default function App({ Component, pageProps: pageProps }) {
	// const isOnline = useOnlineStatus()
	//
	// if(isOnline === false){
	// 	return (
	// 		<OfflinePage />
	// 	)
	// }

	return (
		<SessionProvider session={pageProps.session}>
			<Provider store={store}>
				{Component?.auth === true ? (
					<Auth>
						<DashboardDataProvider>
							<Component {...pageProps} />
						</DashboardDataProvider>
					</Auth>
				) : (
					<Component {...pageProps} />
				)}
			</Provider>
		</SessionProvider>
	)
}

function Auth({ children }) {
	const router = useRouter()
	const { data: session, status, token } = useSession()
	const hasUser = !!session?.user

	useEffect(() => {
		if (status === 'loading') return // Do nothing while loading
		if (!hasUser) router.push('/') //Redirect to signIn page
	}, [hasUser, router, status])

	if (hasUser) {
		return children
	}

	// Session is being fetched, or no user.
	// If no user, useEffect() will redirect.
	return <div>Loading...</div>
}