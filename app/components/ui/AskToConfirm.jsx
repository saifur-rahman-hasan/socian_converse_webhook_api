import React from 'react';
import {ExclamationCircleIcon} from "@heroicons/react/24/solid";

export default function AskToConfirm({ message, onConfirm }){

	return (
		<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
			<div className="p-6 text-center">
				<ExclamationCircleIcon className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />

				<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{ message }
				</h3>

				<button
					data-modal-hide="popup-modal"
					type="button"
					className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
					onClick={() => onConfirm(true) }
				>
					Yes, I'm sure
				</button>
				<button
					data-modal-hide="popup-modal"
					type="button"
					className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
					onClick={() => onConfirm(false) }
				>
					No, cancel
				</button>
			</div>
		</div>
	);
}

