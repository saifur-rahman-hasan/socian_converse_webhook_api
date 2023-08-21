import {LockClosedIcon, LockOpenIcon} from "@heroicons/react/20/solid";

export default function ThreadCloseStatus({ isClosed }) {
	let threadCloseStatusContent = null

	if(isClosed === true){
		threadCloseStatusContent = (
			<div className="flex items-center space-x-2">
				<LockClosedIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
				<span className="text-sm font-medium text-red-700">Thread Closed</span>
			</div>
		);
	}else{
		threadCloseStatusContent = (
			<div className="flex items-center space-x-2">
				<LockOpenIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
				<span className="text-sm font-medium text-green-700">Thread Open</span>
			</div>
		);
	}

	return threadCloseStatusContent
}