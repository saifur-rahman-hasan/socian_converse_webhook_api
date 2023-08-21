import classNames from "../../../utils/classNames";
import {useSelector} from "react-redux";
import {CheckCircleIcon, CheckIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";
import Link from "next/link";
import Dump from "@/components/Dump";

export default function WorkspaceCreateStepsIndicator(){
	const { workspace_create_steps } = useSelector(state => state?.workspace)
	const router = useRouter()

	return (
		<aside className="py-6 px-20 sm:px-20 lg:col-span-3 lg:py-0 lg:px-14">
			<nav className="flex justify-center" aria-label="Progress">
				<ol role="list" className="space-y-6">
					{workspace_create_steps.map((step) => (
						<li key={step.name}>
							{step.status === 'complete' ? (
								<Link href={step.href} className="group">
                                    <span className="flex items-start">
					                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
					                        <CheckCircleIcon
						                        className="h-full w-full text-indigo-600 group-hover:text-indigo-800"
						                        aria-hidden="true"
					                        />
					                    </span>

					                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
					                        {step.name}
					                    </span>
									</span>
								</Link>
							) : step.status === 'current' ? (
								<Link href={step.href} className="flex items-start" aria-current="step">
                                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
                    <span className="absolute h-4 w-4 rounded-full bg-indigo-200" />
                    <span className="relative block h-2 w-2 rounded-full bg-indigo-600" />
                  </span>
									<span className="ml-3 text-sm font-medium text-indigo-600">{step.name}</span>
								</Link>
							) : (
								<Link href={step.href} className="group">
									<div className="flex items-start">
										<div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center" aria-hidden="true">
											<div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
										</div>
										<p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</p>
									</div>
								</Link>
							)}
						</li>
					))}
				</ol>
			</nav>
		</aside>
	)
}