import classNames from "../../../utils/classNames";
import {CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import SidebarUserAccountDropdown from "./SidebarUserAccountDropdown";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {UserCircleIcon} from "@heroicons/react/24/solid";
import Dump from "@/components/Dump";
import DefaultGravatar from "@/components/DefaultGravatar";
import ConverseLogo from "@/components/global/ConverseLogo";

export default function DashboardSidebarDesktop(){
	const router = useRouter();
	const [activeNavItem, setActiveNavItem] = useState(null);

	const navigation = [
		{ id: 1, name: 'Home', href: '/dashboard', icon: HomeIcon,current:false },
		{ id: 2, name: 'Workspaces', href: '/workspaces', icon: FolderIcon ,current:false},
	];

	useEffect(() => {
		const currentNavItem = navigation.find((item) => item.href === router.pathname);
		setActiveNavItem(currentNavItem);
	}, [router.pathname]);

	return (
		<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">

			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="flex min-h-0 flex-1 flex-col bg-gray-800">
				<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
					<div className="flex flex-shrink-0 items-center px-4">
						<ConverseLogo className="h-16 w-16" />
					</div>

					<nav className="mt-5 flex-1 space-y-1 px-2">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={classNames(
									item?.active
										? 'bg-gray-900 text-white'
										: 'text-gray-300 hover:bg-gray-700 hover:text-white',
									'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
								)}
								onClick={() => setActiveNavItem(item)}
							>
								<item.icon
									className={classNames(
										item?.active
											? 'text-gray-300'
											: 'text-gray-400 group-hover:text-gray-300',
										'mr-3 h-6 w-6 flex-shrink-0'
									)}
									aria-hidden="true"
								/>
								{item.name}
							</Link>
						))}
					</nav>
				</div>


				<SidebarUserAccountDropdown />

			</div>
		</div>
	)
}