import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
	updateWorkspaceCreateActiveStep
} from "../../../store/features/workspace/WorkspaceSlice";
import {
	useCreateDraftWorkspaceMutation,
	useGetDraftWorkspaceQuery,
	useUpdateDraftWorkspaceMutation
} from "../../../store/features/workspace/WorkspaceAPISlice";
import {useSession} from "next-auth/react";
import Dump from "../../Dump";
import {useRouter} from "next/router";

export default function WorkspaceCreateStepsWorkspaceInformationForm({ draftWorkspaceData }){
	const router = useRouter();
	const [workspaceName, setWorkspaceName] = useState('')
	const [workspaceAbout, setWorkspaceAbout] = useState('')

	const dispatch = useDispatch()

	const [
		createDraftWorkspace,
		{
			isLoading: isDraftWorkspaceCreating,
			error: draftWorkspaceCreateError
		}
	] = useCreateDraftWorkspaceMutation();

	useEffect(() => {
		if(draftWorkspaceData?.id){
			setWorkspaceName(draftWorkspaceData?.name)
			setWorkspaceAbout(draftWorkspaceData?.about || '')
		}
	}, [draftWorkspaceData])


	/**
	 * handleWorkspaceInformationSubmit
	 *
	 * @param e
	 * @returns {Promise<void>}
	 */
	const handleWorkspaceInformationSubmit = async (e) => {
		e.preventDefault()

		const draftWorkspace = await createDraftWorkspace({
			name: workspaceName,
			about: workspaceAbout
		});

		if(draftWorkspace?.data?.success === true && draftWorkspace?.data?.data?.id !== undefined){
			await dispatch(updateWorkspaceCreateActiveStep({
				current_step_status: 'complete',
				next_active_step: 'plan_and_billing'
			}))

			await router.push({
				pathname: `/workspaces/create`,
				query: {
					step: 'plan_and_billing'
				}
			})
		}

	}

	return (
		<form onSubmit={handleWorkspaceInformationSubmit}>
			<div className="shadow sm:overflow-hidden sm:rounded-md">
				<div className="space-y-6 bg-white py-6 px-4 sm:p-6">
					<div>
						<h3 className="text-base font-semibold leading-6 text-gray-900">Workspace Information</h3>
						<p className="mt-1 text-sm text-gray-500">
							This information will be displayed publicly so be careful what you share.
						</p>
					</div>

					<div className="grid grid-cols-3 gap-6">
						<div className="col-span-3">
							<label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
								Workspace Name
							</label>
							<div className="mt-1 flex rounded-md shadow-sm">
			                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
			                      workspaces/
			                    </span>
								<input
									type="text"
									name="workspaceName"
									id="workspaceName"
									placeholder={`My Workspace`}
									onChange={(e) => setWorkspaceName(e.target.value)}
									required
									value={workspaceName}
									className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>

						<div className="col-span-3">
							<label htmlFor="about" className="block text-sm font-medium text-gray-700">
								About
							</label>

							<div className="mt-1">
			                    <textarea
				                    id="about"
				                    name="about"
				                    rows={3}
				                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				                    placeholder="Write something about your workspace."
				                    defaultValue={workspaceAbout || ''}
				                    required
				                    onChange={(e) => setWorkspaceAbout(e.target.value)}
			                    />
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
					<button
						type="submit"
						disabled={isDraftWorkspaceCreating}
						className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						{isDraftWorkspaceCreating ? 'Please wait...' : 'Next'}
					</button>
				</div>
			</div>
		</form>
	)
}