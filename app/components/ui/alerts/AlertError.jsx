import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";

export default function AlertError({ message, className }) {
	return (
		<div className={classNames(
			'bg-red-100 p-4',
			className
		)}>
			<div className="flex">
				<div className="text-sm text-red-700">
					{message}
				</div>
			</div>
		</div>
	)
}
