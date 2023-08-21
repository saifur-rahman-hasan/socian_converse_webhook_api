import {ChevronRightIcon} from "@heroicons/react/20/solid";
import IconWhatsappSvg from "../ui/icons/IconWhatsappSvg";
import {useState} from "react";
import classNames from "../../utils/classNames";

export default function ConnectWithWhatsapp(){
	const [active, setActive] = useState(false)

	return (
		<div className={classNames(
			!active ? 'opacity-25': '',
			"group relative flex items-start items-center space-x-3 py-4"
		)}>
			<div className="flex-shrink-0">
                <IconWhatsappSvg />
			</div>
			<div className="min-w-0 flex-1">
				<div className="text-sm font-medium text-gray-900">
					<a href={`item.href`}>
						<span className="absolute inset-0" aria-hidden="true"/>
						Whatsapp
					</a>
				</div>
				<p className="text-sm text-gray-500">Connected with Socian Bot using Mr X Account.</p>
			</div>

			<div className="flex-shrink-0 self-center">
				<ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
			</div>
		</div>
	)
}