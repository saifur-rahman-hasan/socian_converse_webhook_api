import React from 'react';
import {PlusIcon, WifiIcon} from "@heroicons/react/24/solid";

const OfflinePage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

			<div className="text-center">
				<WifiIcon className={`mx-auto h-24 w-24 text-red-300`} />

				<h3 className="mt-4 text-4xl font-bold text-gray-900">Offline</h3>
				<p className="mt-4 text-xl text-gray-700 mb-8">You are currently offline. Please check your internet connection and try again.</p>

				<div className="mt-6">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={() => window.location.reload()}
					>
						Try again
					</button>
				</div>
			</div>

		</div>
	);
};

export default OfflinePage;
