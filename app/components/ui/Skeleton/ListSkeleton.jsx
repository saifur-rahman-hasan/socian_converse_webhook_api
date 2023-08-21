import classNames from "../../../utils/classNames";

export default function ListSkeleton({ count = 4, className }){
	const items = Array.from({length: count}, (_, i) => i)

	return (
		<div className={className}>
			<div role="status" className="p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 shadow animate-pulse">

				{
					items.map((item) => (
						<div
							key={`default_skeleton_bar_${item+1}`}
							className={classNames(
								item === 0 ? 'pt-0' : 'pt-4',
								'flex items-center justify-between'
							)}>
							<div>
								<div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
								<div className="w-32 h-2 bg-gray-200 rounded-full"></div>
							</div>
							<div className="h-2.5 bg-gray-300 rounded-full w-12"></div>
						</div>
					))
				}

				<span className="sr-only">Loading...</span>
			</div>
		</div>
	)
}