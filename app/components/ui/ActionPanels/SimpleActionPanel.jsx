export default function SimpleActionPanel({ title, description, children, action }) {
	return (
		<div className="bg-white shadow sm:rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<h3 className="text-base font-bold text-lg mb-4 leading-7 text-gray-900">{title || `Manage subscription`}</h3>

				{
					description || (
						<div className="mt-2 max-w-xl text-2xl text-gray-500">
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatibus corrupti atque repudiandae
								nam.
							</p>
						</div>
					)
				}

				<div className="mt-5">
					{ children }
				</div>
			</div>
		</div>
	)
}
