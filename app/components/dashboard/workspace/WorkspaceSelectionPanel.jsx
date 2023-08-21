import {Bars3BottomLeftIcon, BellIcon} from "@heroicons/react/24/outline";
import WorkspaceSelectionCommandPallet from "./WorkspaceSelectionCommandPallet";
import {PlusIcon} from "@heroicons/react/24/solid";
import {useDispatch} from "react-redux";
import {setSidebarOpenState} from "@/store/features/theme/themeSlice";
import Link from "next/link";

export default function WorkspaceSelectionPanel(){
	const dispatch = useDispatch()

	return (
		<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
			<button
				type="button"
				className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
				onClick={() => dispatch(setSidebarOpenState(true))}
			>
				<span className="sr-only">Open sidebar</span>
				<Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
			</button>

			<div className="flex flex-1 justify-between px-4">
				<div className="flex flex-1 gap-x-4">
					<div className="flex w-full lg:ml-0">
						<WorkspaceSelectionCommandPallet />
					</div>
				</div>

				<div className="ml-4 flex items-center gap-x-4 lg:ml-6">
					<button
						type="button"
						className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						<span className="sr-only">View notifications</span>
						<BellIcon className="h-6 w-6" aria-hidden="true" />
					</button>

					<Link
						href={`/workspaces/create?step=about_workspace`}
						className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
					>
						<PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						<span>New Workspace</span>
					</Link>
				</div>
			</div>
		</div>
	)
}