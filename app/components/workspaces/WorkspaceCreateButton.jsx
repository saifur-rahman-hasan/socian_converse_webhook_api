import {PlusIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function WorkspaceCreateButton({ permissionId }){

	if(!permissionId){
		return null
	}

	return (
		<Link
			href="/workspaces/create"
			className="inline-flex items-center gap-x-2 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
		>
			<PlusIcon className={`w-6 h-6`} />
			<span>Add New Workspace</span>
		</Link>
	)
}