import {BuildingOfficeIcon, CheckCircleIcon} from "@heroicons/react/20/solid";
import DefaultGravatar from "@/components/DefaultGravatar";
import {useSelector} from "react-redux";

function DemoActionsButtons() {
	return (
		<>
			<button
				type="button"
				className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Add money
			</button>
			<button
				type="button"
				className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
			>
				Send money
			</button>
		</>
	)
}

export default function AgentProfilePageHeading({ actions }){
	const agentData = useSelector(state => state.agentDashboardProviderData?.data?.agent?.data)

	const actionContent = actions || <DemoActionsButtons />

	return (
		<>
			{/* Page header */}
			<div className="bg-white shadow">
				<div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
					<div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
						<div className="min-w-0 flex-1">
							{/* Profile */}
							<div className="flex items-center">
								<DefaultGravatar className="hidden h-16 w-16 rounded-full sm:block" />

								<div>
									<div className="flex items-center">
										<DefaultGravatar className="h-16 w-16 rounded-full sm:hidden"										/>
										<h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
											Hello, { agentData?.name || 'Undefined' }
										</h1>
									</div>
									<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
										<dt className="sr-only">Company</dt>
										<dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
											<BuildingOfficeIcon
												className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											Duke street studio
										</dd>
										<dt className="sr-only">Account status</dt>
										<dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
											<CheckCircleIcon
												className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
												aria-hidden="true"
											/>
											Verified account
										</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
							{ actionContent }
						</div>

					</div>
				</div>
			</div>
		</>
	)
}