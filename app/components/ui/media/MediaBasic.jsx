export default function MediaBasic({ title, description, image }) {
	return (
		<div className="flex">
			{
				image && (
					<div className="mr-4 flex-shrink-0">
						{ image }
					</div>
				)
			}

			<div>
				<h3 className="truncate text-xl font-medium text-gray-900">{ title }</h3>

				<p className="mt-2 text-sm text-gray-500">
					<a href="#" className="font-medium text-blue-700">#400</a>

					{' opened from '}

					<a href="#" className="font-medium text-blue-700">
						#Grameenphone
					</a>

					{' '}

					<a href="#" className="font-medium text-gray-900">
						facebook page
					</a>
				</p>

				<p className="mt-1">{ description }</p>
			</div>
		</div>
	)
}
