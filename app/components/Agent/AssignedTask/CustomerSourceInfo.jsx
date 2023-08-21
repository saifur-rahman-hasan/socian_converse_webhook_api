import Image from "next/image";
import MediaBasic from "../../ui/media/MediaBasic";
import Link from "next/link";
import DefaultGravatar from "@/components/DefaultGravatar";

export default function CustomerSourceInfo({ taskId, customer }){
	return (
		<div className="flex">
			<div className="mr-4 flex-shrink-0">
				<DefaultGravatar className={`h-10 w-10 flex-shrink-0 rounded-full bg-gray-300`} />
			</div>

			<div>
				<h3 className="truncate text-xl font-medium text-gray-900">{ customer?.name }</h3>

				<p className="mt-2 text-sm text-gray-500">
					<Link
						href={`/dashboard/agent/my-tasks/${taskId}`}
						className="font-medium text-blue-700">{`#${taskId}`}</Link>

					{' opened from '}

					<Link
						href="/"
						className="font-medium text-blue-700">
						{ customer?.name }
					</Link>

					{' at '}

					<a
						href={`https://www.google.com/search?q=${customer?.type}`}
						className="font-medium text-gray-900"
						target={`_blank`}
					>
						{ customer?.type }
					</a>
				</p>

				<p className="mt-1">{ customer?.message }</p>
			</div>
		</div>
	)
}