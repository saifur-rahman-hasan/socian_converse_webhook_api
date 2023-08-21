import {useDispatch} from "react-redux";
import {
	resetWorkspaceCreateActiveStep,
} from "@/store/features/workspace/WorkspaceSlice";
import {useRouter} from "next/router";
import LoadingCircle from "../../ui/loading/LoadingCircle";
import {useState} from "react";
import SimpleActionPanel from "@/components/ui/ActionPanels/SimpleActionPanel";
import {useUpdateDraftWorkspaceMutation} from "@/store/features/workspace/WorkspaceAPISlice";

export default function WorkspaceCreateStepsIntegrationsSelectionForm({ draftWorkspace }){
	const router = useRouter()
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const workspaceId = draftWorkspace?.id

	const [updateDraftWorkspace, {
		isLoading: updatingDraftWorkspace,
		error: draftWorkspaceUpdateError
	}] = useUpdateDraftWorkspaceMutation()

	const handleNextStep = async (e) => {
		e.preventDefault()


		if(!workspaceId){
			alert("Your action is invalid.")
			return false
		}

		const updatedWorkspace = await updateDraftWorkspace({
			id: workspaceId,
			isDraft: false
		})

		if(updatedWorkspace?.data?.isDraft === false){
			await dispatch(resetWorkspaceCreateActiveStep())
			await router.push({
				pathname: `/workspaces/[workspaceId]/integrations`,
				query: { workspaceId }
			})
		}
	}

	return (
		<div>
			<SimpleActionPanel
				title={`Activate Your Workspace and Add Your Preferred Channels!`}
				description={`Activate your workspace, add preferred channels, and connect with your tribe. Integrate Messenger, Telegram, WhatsApp, Instagram Messenger, Facebook, and more. Customize, engage, and elevate your communication. Join now and activate your workspace.`}
			>
				<button
					className="inline-flex items-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					onClick={handleNextStep}
					disabled={ loading }
				>
					{
						loading && <>
							<LoadingCircle size={4} />
							<span>Preparing your workspace...</span>
						</>
					}

					{ !loading && 'Activate & Manage Channels' }
				</button>
			</SimpleActionPanel>
		</div>
	)
}