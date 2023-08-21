import {Disclosure} from "@headlessui/react";
import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/24/outline";
import collect from "collect.js";
import IconMessengerSvg from "../ui/icons/IconMessengerSvg";
import MessengerConnectForm from "./MessengerConnectForm";
import IconFacebookSvg from "@/components/ui/icons/IconFacebookSvg";
import Dump from "@/components/Dump";

export default function ConnectWithFacebook({ workspace }){
	const messengerIntegration = collect(workspace.integrations).firstWhere('id', 'messenger')

	return (
		<Disclosure as="div" className="pt-6">
			{({ open }) => (
				<>
					<div>
						<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
							<div className="group relative flex items-start space-x-3 py-4 cursor-pointer">
								<div className="flex-shrink-0">
									<IconFacebookSvg />
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium text-gray-900 flex justify-between">
										<span className="absolute inset-0" aria-hidden="true"/>
										<span>Facebook Business Page</span>
									</div>

									<p className="text-sm text-gray-500">Connected with Socian Bot using Mr X Account.</p>
								</div>
							</div>

							<span className="ml-6 flex h-7 items-center">
	                          {open ? (
								  <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
							  ) : (
								  <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
							  )}
	                        </span>
						</Disclosure.Button>
					</div>

					<Disclosure.Panel as="dd" className="mt-2 pr-12">
						<div className={`pl-16 pb-10 max-w-2xl`}>
							{/*<Dump data={permissions}/>*/}
							<MessengerConnectForm
								workspace={workspace}
								authType={"fb_page"}
							/>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}