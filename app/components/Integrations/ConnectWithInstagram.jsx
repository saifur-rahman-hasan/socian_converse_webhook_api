import {ChevronRightIcon} from "@heroicons/react/20/solid";
import IconInstagramSvg from "../ui/icons/IconInstagramSvg";
import {useState} from "react";
import classNames from "../../utils/classNames";
import {Disclosure} from "@headlessui/react";
import IconMessengerSvg from "@/components/ui/icons/IconMessengerSvg";
import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/24/outline";
import InstagramMessengerConnectForm from "@/components/Integrations/InstagramMessengerConnectForm";

export default function ConnectWithInstagram({ workspace }){
	return (
		<Disclosure as="div" className="pt-6">
			{({ open }) => (
				<>
					<div>
						<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
							<div className="group relative flex items-start space-x-3 py-4 cursor-pointer">
								<div className="flex-shrink-0">
									<IconInstagramSvg />
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium text-gray-900 flex justify-between">
										<span className="absolute inset-0" aria-hidden="true"/>
										<span>Instagram Messenger</span>
									</div>

									<p className="text-sm text-gray-500">Connect your instagram messenger business account</p>
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
							<InstagramMessengerConnectForm
								workspace={workspace}
							/>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}