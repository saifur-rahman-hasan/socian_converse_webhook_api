import { PlusIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";

interface EmptyStatesProps {
	title?: string;
	message?: string;
	action?: boolean | JSX.Element;
	className?: string;
}

export default function EmptyStates({ title, message = null, action = null, className = null }: EmptyStatesProps) {
	return (
		<div className={classNames(
			"text-center",
			className
		)}>
			<h3 className="mt-2 text-sm font-semibold text-gray-900">{title || 'Undefined'}</h3>

			{ message && (
				<p className="mt-1 text-sm text-gray-500">{message}</p>
			)}


			<div className="mt-6">
				{
					action === false
						? ''
						: action ||
						(
							<button
								type="button"
								className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								<PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
								New {title}
							</button>
						)
				}
			</div>
		</div>
	)
}
