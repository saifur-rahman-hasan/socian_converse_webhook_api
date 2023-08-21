import Dump from "@/components/Dump";
import { useGetWorkspacesQuery } from "@/store/features/workspace/WorkspaceAPISlice";
import { ChevronRightIcon, PlusIcon, FolderIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import collect from 'collect.js'
import moment from 'moment'
import ListSkeleton from "@/components/ui/Skeleton/ListSkeleton";
import EmptyStates from "@/components/ui/EmptyStates";
import WorkspaceCreateButton from "@/components/workspaces/WorkspaceCreateButton";

function WorkspacesDataTableContent({ workspaces }) {
  return (
	<table className="min-w-full">
		<thead>
		<tr className="border-t border-gray-200">
			<th
				className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
				scope="col"
			>
				<span className="lg:pl-2">Workspace</span>
			</th>
			<th
				className="columns-2 border-b border-gray-200 bg-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-900"
				scope="col"
			>
				Teams or Members
			</th>
			<th
				className="columns-2 border-b border-gray-200 bg-green-200 px-6 py-3 text-left text-sm font-semibold text-gray-900"
				scope="col"
			>
				Connected Channels
			</th>
			<th
				className="columns-2 hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:table-cell"
				scope="col"
			>
				Last updated
			</th>
			<th
				className="columns-2 border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
				scope="col"
			/>
		</tr>
		</thead>
		<tbody className="divide-y divide-gray-100 bg-white">
		{workspaces.map((workspace) => (
			<tr key={`workspaces_${workspace?.id}`}>
				<td className="w-full max-w-0 whitespace-nowrap px-6 py-3 text-sm font-medium text-gray-900">
					<div className="flex items-center space-x-3 lg:pl-2">
						<FolderIcon className={`w-6 h-6 text-gray-400`} />
						<Link href={`/workspaces/${workspace?.id}`} className="truncate hover:text-gray-600">
							<span>{workspace?.name}</span>
						</Link>
					</div>
				</td>

				<td className="columns-2 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-500">
					<div className="flex items-center space-x-2">
						<div className="flex flex-shrink-0 -space-x-1">
							{ collect(workspace.teams).pluck('members').collapse().count() + ` members` }
						</div>
					</div>
				</td>

				<td className="columns-2 bg-green-50 px-6 py-3 text-sm font-medium text-gray-500">
					<div className="flex items-center space-x-2">
						<div className="flex flex-shrink-0 -space-x-1">
							{ workspace?.channels?.length || 'No Channel' }
							{` `}
							{ workspace?.channels?.length === 1 && `source` }
							{ workspace?.channels?.length > 1 && ` sources` }
						</div>
					</div>
				</td>

				<td className="hidden whitespace-nowrap px-6 py-3 text-sm text-gray-500 md:table-cell">
					{moment(workspace.updatedAt).fromNow()}
				</td>

				<td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
					<Link href={{
						pathname: `/workspaces/${workspace?.id}/channels`,
						query: {tab: 'telegram'}
					}} className="text-indigo-600 hover:text-indigo-900">
						Explore
					</Link>
				</td>
			</tr>
		))}
		</tbody>
	</table>
  )
}


export default function WorkspacesDataTable(){
	const { 
		data: workspacesData, 
		isLoading: workspacesDataIsLoading, 
		error: workspacesDataFetchError
	} = useGetWorkspacesQuery()

	return (
		<div>
			{/* Projects list (only on smallest breakpoint) */}
			<div className="mt-10 sm:hidden">
				<div className="px-4 sm:px-6">
					<h2 className="text-sm font-medium text-gray-900">Workspaces</h2>
				</div>

				{
					workspacesData?.length > 0 && (
						<ul role="list" className="mt-3 divide-y divide-gray-100 border-t border-gray-200">
							{workspacesData.map((workspace) => (
								<li key={`workspace_id_${workspace.id}`}>
									<Link href={`/workspaces/${workspace.id}`} className="group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6">
										<span className="flex items-center space-x-3 truncate">
											<span className="truncate text-sm font-medium leading-6">
												{workspace.name}
											</span>
										</span>

										<ChevronRightIcon
											className="ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500"
											aria-hidden="true"
										/>
									</Link>
								</li>
							))}
						</ul>
					)
				}
			</div>

			{/* Projects table (small breakpoint and up) */}
			<div className="mt-8 hidden sm:block">
				<div className="md:flex md:items-center md:justify-between md:space-x-5 px-8 py-4">
					<div className="flex items-start space-x-5">
						<div className="pt-1.5">
							<h2 className="text-md font-bold text-gray-900">Your Workspaces</h2>
							<div className="text-sm font-medium text-gray-500 mt-1">
								Here is the available list of your workspaces to explore the converse journey. Explore your workspaces.
							</div>
						</div>
					</div>

					<div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
						<WorkspaceCreateButton permissionId={1} />
					</div>
				</div>

				<div className="inline-block min-w-full border-b border-gray-200 align-middle">
					{ workspacesDataIsLoading && (<ListSkeleton count={2} className={`my-2`}>Loading ...</ListSkeleton>)}

					{ !workspacesDataIsLoading && workspacesDataFetchError && (<Dump data={{ workspacesDataFetchError }} />)}

					{ !workspacesDataIsLoading && !workspacesDataFetchError && !workspacesData?.length && (<EmptyStates className={`my-4`} title={'You have no workspaces'} action={false} />)}

					{ !workspacesDataIsLoading && !workspacesDataFetchError && workspacesData?.length > 0 && (<WorkspacesDataTableContent workspaces={workspacesData} />)}
					
				</div>
			</div>
		</div>
	)

}