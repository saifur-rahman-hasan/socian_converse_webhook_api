import IconTelegramSvg from "../ui/icons/IconTelegramSvg";
import TelegramConnectForm from "./TelegramConnectForm";
import {Disclosure} from "@headlessui/react";
import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/24/outline";
import collect from "collect.js";

export default function ConnectWithTelegram({ workspace }){

	const telegramIntegration = collect(workspace.integrations).firstWhere('id', 'telegram')

	return (
		<Disclosure as="div" className="pt-6">
			{({ open }) => (
				<>
					<dt>
						<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
							<div className="group relative flex items-start space-x-3 py-4 cursor-pointer">
								<div className="flex-shrink-0">
									<IconTelegramSvg />
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium text-gray-900 flex justify-between">
										<span className="absolute inset-0" aria-hidden="true"/>
										<span>Telegram</span>
									</div>

									<p className="text-sm text-gray-500">Connect your telegram business bot account</p>
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
					</dt>
					<Disclosure.Panel as="dd" className="mt-2 pr-12">
						<div className={`pl-16 pb-10 max-w-2xl`}>
							<TelegramConnectForm
								workspace={workspace}
								integration={telegramIntegration}
							/>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}