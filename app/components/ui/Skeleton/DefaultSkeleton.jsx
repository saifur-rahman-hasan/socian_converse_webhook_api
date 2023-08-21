import classNames from "../../../utils/classNames";

export default function DefaultSkeleton({ className }){
	return (
		<div role="status" className={classNames(
			className || '',
			'max-w-sm animate-pulse'
		)}>
			<div className="h-2.5 bg-gray-400 rounded-full w-32 mb-4"></div>
			<div className="h-2 bg-gray-300 rounded-full min-w-full mb-2"></div>
			<div className="h-2 bg-gray-300 rounded-full min-w-full mb-2"></div>
			<span className="sr-only">Loading...</span>
		</div>
	)
}