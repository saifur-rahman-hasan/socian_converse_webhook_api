import { Fragment, useState } from 'react'
import AgentInboxMiniSidebar from "@/components/Agent/AgentInbox/AgentInboxMiniSidebar";
import AgentInboxMessagesSidebar from "@/components/Agent/AgentInbox/AgentInboxMessagesSidebar";

export default function AgentInboxLayout({ workspaceId, agentId, children  }) {
	const [open, setOpen] = useState(false)

	return (
		<div className={`absolute w-full h-screen overflow-hidden`}>
			<div className="flex flex-col">
				{/* Top nav*/}
				{/*<AgentInboxTopNavbar open={open} setOpen={setOpen} />*/}

				{/* Bottom section */}
				<div className="flex min-h-0 flex-1 overflow-hidden">
					{/* Narrow sidebar*/}
					<AgentInboxMiniSidebar
						workspaceId={workspaceId}
						agentId={agentId}
					/>

					{/* Main area */}
					<main className="min-w-0 flex-1 border-t border-gray-400 xl:flex min-h-screen max-h-screen overflow-hidden">

						{/* Message list*/}
						<AgentInboxMessagesSidebar
							workspaceId={workspaceId}
							agentId={agentId}
						/>

						<AgentInboxContentContainer>
							{ children }
						</AgentInboxContentContainer>
					</main>
				</div>
			</div>
		</div>
	)
}


function AgentInboxContentContainer({ children }) {
	return (
		<div className={`max-h-screen w-full overflow-y-scroll`}>
			{ children }
		</div>
	);
}