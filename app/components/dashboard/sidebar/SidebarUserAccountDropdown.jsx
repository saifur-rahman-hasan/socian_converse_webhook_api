import {Menu, Transition} from "@headlessui/react";
import {ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {Fragment} from "react";
import classNames from "../../../utils/classNames";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {FaPowerOff} from "react-icons/fa";
import DefaultGravatar from "@/components/DefaultGravatar";
import UserSignOut from "@/components/UserSignOut";

function LogoutButton() {
	async function handleLogout() {
		const callbackUrl = process?.env?.NEXT_PUBLIC_APP_URL || '/'
		await signOut({ callbackUrl: callbackUrl})
	}

	return (
		<button
			className={`flex-2`}
			onClick={handleLogout}
		>
			<FaPowerOff className={`w-5 h-5 text-red-400`} />
		</button>
	);
}

export default function SidebarUserAccountDropdown(){
	const session = useSession()
	const authUser = session?.data?.user || {}

	if(session.status !== "authenticated" && authUser?.name !== undefined){
		return null
	}

	return (
		<div className="flex flex-shrink-0 bg-gray-700 p-4">
			<div className="group block w-full flex-shrink-0">
				<div className="flex items-center gap-x-3">
					<div className="">
						<DefaultGravatar className="inline-block h-9 w-9 rounded-full" />
					</div>

					<div className="flex-1">
						<div className={`flex items-center`}>
							<div className={`flex-1`}>
								<div className="text-sm font-medium text-white">{ authUser?.name }</div>
								<div className="text-sm font-medium text-white">View Profile</div>
							</div>

							<UserSignOut className={`flex-2`}>
								<FaPowerOff className={`w-5 h-5 text-red-400`} />
							</UserSignOut>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}