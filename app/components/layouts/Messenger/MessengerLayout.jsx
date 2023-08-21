import { useState } from 'react'
import MessengerSidebarMobile from "../../messenger/MessengerSidebarMobile";
import MessengerAppbarMobile from "../../messenger/MessengerAppbarMobile";
import MessengerBreadcrumbMobile from "../../messenger/MessengerBreadcrumbMobile";
import Head from "next/head";
import ConverseSocketListener from "@/components/Converse/ConverseMessengerApp/ConverseSocketListener";

export default function MessengerLayout({ children, sidebar }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<>
			<Head>
				<title>Converse Messenger</title>
			</Head>

			{/*<ConverseSocketListener />*/}

			<div className="flex h-screen overflow-hidden">

				{/* Messenger Sidebar for Mobile view */}
				<MessengerSidebarMobile
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">

					{/* Messenger Appbar for Mobile View */}
					<MessengerAppbarMobile />

					<div className="relative z-0 flex flex-1 overflow-hidden">
						<main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">

							{/* Messenger Breadcrumb for Mobile View */}
							<MessengerBreadcrumbMobile />

							{ children }
						</main>

						{ sidebar && (
							<aside className="hidden w-96 flex-shrink-0 border-r border-gray-400 xl:order-first xl:flex xl:flex-col">
								{sidebar}
							</aside>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
