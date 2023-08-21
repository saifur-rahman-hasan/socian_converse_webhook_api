import {FolderIcon, FolderOpenIcon, PlusIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

const people = [
	{
		name: 'Nagad - Influence Market Research - 2nd Quarter, 2022',
		title: 'Front-end Developer',
		department: 'Optimization',
		email: 'lindsay.walton@example.com',
		role: 'Member'
	},
	// More people...
]

export default function WorkspacesDataTable() {
	return (
		<div className="py-6 my-6">
			<div className="px-6 sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Your Workspaces</h1>
					<p className="mt-2 text-sm text-gray-700">
						A list of all the users in your account including their name, title, email and role.
					</p>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						type="button"
						className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						<PlusIcon className={`w-6 h-6`} />
						<span>Add New Workspace</span>
					</button>
				</div>
			</div>

			<div className="mt-8 flow-root bg-white px-6 shadow">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
									Name
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Title
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Status
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Role
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">

							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
