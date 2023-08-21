import {BuildingOfficeIcon, CheckCircleIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {useSession} from "next-auth/react";
import Dump from "@/components/Dump";

export default function DashboardAuthUserHeading(){
	const {
		data: session,
		status: authStatus
	}  = useSession()

	const {
		user: authUser
	} = session

	let authStatusContent = ''

	if(authStatus === 'loading'){
		authStatusContent = (<div>Loading ...</div>)
	}

	if(authStatus === 'unauthenticated'){
		authStatusContent = (<div>{authStatus}</div>)
	}

	if(authStatus === 'authenticated' && authUser?.id){
		authStatusContent = (
			<div className="bg-white shadow">
				{/*<Dump data={{session}}/>*/}
				<div className="px-4 sm:px-6 lg:mx-auto">
					<div className="py-6 md:flex md:items-center md:justify-between">
						<div className="min-w-0 flex-1">
							{/* Profile */}
							<div className="flex items-center">
								<img
									className="hidden h-16 w-16 rounded-full sm:block"
									src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
									alt=""
								/>
								<div>
									<div className="flex items-center">
										<img
											className="h-16 w-16 rounded-full sm:hidden"
											src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
											alt=""
										/>
										<h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
											Good morning, { authUser?.name }
										</h1>
									</div>
									<dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
										<dt className="sr-only">{ authUser?.name }</dt>
										<dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
											<BuildingOfficeIcon
												className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
												aria-hidden="true"
											/>
											{ authUser?.name}
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
						<div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
							<Link
								href={`/profile/me`}
								className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
							>
								My Profile
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return authStatusContent
}