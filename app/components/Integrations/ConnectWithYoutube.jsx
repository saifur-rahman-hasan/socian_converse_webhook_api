import {ChevronRightIcon} from "@heroicons/react/20/solid";
import IconYoutubeSvg from "../ui/icons/IconYoutubeSvg";
import {useState} from "react";
import classNames from "../../utils/classNames";
import {useGetYoutubeQuery} from "@/store/features/youtube/youtubeAPISlice";
import {Disclosure} from "@headlessui/react";
import IconInstagramSvg from "@/components/ui/icons/IconInstagramSvg";
import {MinusSmallIcon, PlusSmallIcon} from "@heroicons/react/24/outline";
import InstagramMessengerConnectForm from "@/components/Integrations/InstagramMessengerConnectForm";
import YoutubeConnectForm from "@/components/Integrations/YoutubeConnectForm";

export default function ConnectWithYoutube({workspace}){
	const { data: youtubeData } = useGetYoutubeQuery()
	const [active, setActive] = useState(true)
	const clickedFunction = async (e) => {
		e.preventDefault()
		console.log("DDDDDDDDDDDD");
		console.log("@@@@@@@@@@@@@@@@@@");
		console.log(youtubeData);
		console.log("################");
		console.log("%%%%%%%%%%%%%%%%%%%");
		console.log("%%%%%%%%%%%%%%%%%%%");
	}

	return (
		<Disclosure as="div" className="pt-6">
			{({ open }) => (
				<>
					<div>
						<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
							<div className="group relative flex items-start space-x-3 py-4 cursor-pointer">
								<div className="flex-shrink-0">
									<IconYoutubeSvg />
								</div>
								<div className="min-w-0 flex-1">
									<div className="text-sm font-medium text-gray-900 flex justify-between">
										<span className="absolute inset-0" aria-hidden="true"/>
										<span>Youtube Channel</span>
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
							<YoutubeConnectForm
								workspace={workspace}
							/>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}