import {openAgentAvailabilityStatusCommand} from "@/store/features/agentDashboard/AgentDashboardSlice";
import {useDispatch} from "react-redux";
import classNames from "@/utils/classNames";

export default function AgentAvailabilityStatusCommandButton({ workspaceId, agentId, className }){
	const dispatch = useDispatch()

	function handleCommand() {
		dispatch(openAgentAvailabilityStatusCommand())
	}

	const defaultClass = "rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"

	return (
		<button
			type="button"
			className={classNames(
				className,
				defaultClass,
			)}
			onClick={handleCommand}
		>
			Change Availability Status
		</button>
	)
}