import {useSession} from "next-auth/react";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import Head from "next/head";


export default function DashboardLayout({ children, sidebar }) {
	const { status, data } = useSession({
		required: true,
		onUnauthenticated() {
			// The user is not authenticated, handle it here.
			alert(`The user is not authenticated, handle it here.`)
		},
	})

	if (status === "loading") {
		return "Loading"
	}

	if(status === 'unauthenticated') {
		return "authenticated..."
	}

	return (
		<div>
			<Head>
				<title>Converse Dashboard</title>
			</Head>

			{ sidebar || <DashboardSidebar /> }

			<main>
				<div className="flex flex-1 flex-col lg:pl-64">
					<div className="flex-1 pb-20">
						{ children }
					</div>
				</div>
			</main>
		</div>
	)
}