import classNames from "../../utils/classNames";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CursorArrowRaysIcon,
	EnvelopeOpenIcon,
	UsersIcon
} from "@heroicons/react/24/outline";

const stats = [
	{ id: 1, name: 'Nagad - Digital Market Research', stat: '380', change: '122', changeType: 'increase' },
	{ id: 2, name: 'Nagad - Business Development', stat: '512', change: '5.4%', changeType: 'increase' },
	{ id: 3, name: 'Nagad - Customer Support', stat: '27', change: '3.2%', changeType: 'decrease' },
]

export default function PinnedWorkspaceCards(){
	return (
		<div className={`px-8 mt-10`}>
			<h3 className="text-base font-semibold leading-6 text-gray-900">Pinned Workspaces</h3>

			<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((item) => (
					<div
						key={item.id}
						className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
					>
						<dt>
							<p className="truncate text-sm font-medium text-gray-500">{item.name}</p>
						</dt>
						<dd className="flex items-baseline pb-6 sm:pb-7">
							<p className="text-xl font-bold text-gray-800">{item.stat}</p>
							<p
								className={classNames(
									item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
									'ml-2 flex items-baseline text-sm font-semibold'
								)}
							>
								{item.changeType === 'increase' ? (
									<ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
								) : (
									<ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
								)}

								<span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
								{item.change}
							</p>
							<div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
								<div className="text-sm">
									<a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
										{' '}
										Explore <span className="sr-only"> {item.name} stats</span>
									</a>
								</div>
							</div>
						</dd>
					</div>
				))}
			</dl>
		</div>
	)
}