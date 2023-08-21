import classNames from "../../../utils/classNames";
import SidebarUserAccountDropdown from "./SidebarUserAccountDropdown";
import SocianConverseLogo from "../../media/SocianConverseLogo";
import {useSelector} from "react-redux";
import Link from "next/link";

export default function AdminSidebarDesktop(){
	const adminDashboardState = useSelector(state => state?.adminDashboard)
	const navigation = adminDashboardState?.navigation || []

	return (
		<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">
			<div className="flex flex-shrink-0 items-center px-6">
				<SocianConverseLogo />
			</div>

			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
				{/* User account dropdown */}
				<SidebarUserAccountDropdown />

				{/* Navigation */}
				<div className="mt-6 px-3">
					<div className="space-y-1">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={classNames(
									item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
									'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
								)}
								aria-current={item.current ? 'page' : undefined}
							>
								{item.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}