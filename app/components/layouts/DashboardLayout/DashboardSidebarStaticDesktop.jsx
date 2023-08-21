import SocianConverseLogo from "../../media/SocianConverseLogo";
import SidebarAuthUserInfoWithOption from "./Sidebar/SidebarAuthUserInfoWithOption";
import SidebarSearch from "./Sidebar/SidebarSearch";
import SidebarNavigation from "./Sidebar/SidebarNavigation";



function SidebarBrandLogo() {
	return (
		<div className="flex flex-shrink-0 items-center px-6">
			<SocianConverseLogo className={`w-40 mx-auto`} />
		</div>
	)
}

function SidebarStartNewProjectContent() {
	return (
		<div className="flex flex-col sm:flex-row xl:flex-col mx-6 my-4">
			<button
				type="button"
				className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 xl:w-full"
			>
				New Project
			</button>
			<button
				type="button"
				className="mt-3 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 xl:ml-0 xl:mt-3 xl:w-full"
			>
				Invite Team
			</button>
		</div>
	)
}

function SidebarSpeedDial() {
	return (
		<div data-dial-init data-dial-trigger={'hover'} className="fixed flex right-6 bottom-6 group">
			<div id="speed-dial-menu-horizontal" className="flex items-center hidden mr-4 space-x-2">
				<button type="button" data-tooltip-target="tooltip-share" data-tooltip-placement="top"
				        className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
					<svg aria-hidden="true" className="w-6 h-6 -ml-px " fill="currentColor" viewBox="0 0 20 20"
					     xmlns="http://www.w3.org/2000/svg">
						<path
							d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
					</svg>
					<span className="sr-only">Share</span>
				</button>
				<div id="tooltip-share" role="tooltip"
				     className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
					Share
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button type="button" data-tooltip-target="tooltip-print" data-tooltip-placement="top"
				        className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
					<svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
					     xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd"
						      d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
						      clipRule="evenodd"></path>
					</svg>
					<span className="sr-only">Print</span>
				</button>
				<div id="tooltip-print" role="tooltip"
				     className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
					Print
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button type="button" data-tooltip-target="tooltip-download" data-tooltip-placement="top"
				        className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
					<svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
					     xmlns="http://www.w3.org/2000/svg">
						<path clipRule="evenodd"
						      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 00-2 0v1.586l-.293-.293a.999.999 0 10-1.414 1.414l2 2a.999.999 0 001.414 0l2-2a.999.999 0 10-1.414-1.414l-.293.293V9z"
						      fillRule="evenodd"></path>
					</svg>
					<span className="sr-only">Download</span>
				</button>
				<div id="tooltip-download" role="tooltip"
				     className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
					Download
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
				<button type="button" data-tooltip-target="tooltip-copy" data-tooltip-placement="top"
				        className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 dark:hover:text-white shadow-sm dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
					<svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
					     xmlns="http://www.w3.org/2000/svg">
						<path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>
						<path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path>
					</svg>
					<span className="sr-only">Copy</span>
				</button>
				<div id="tooltip-copy" role="tooltip"
				     className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
					Copy
					<div className="tooltip-arrow" data-popper-arrow></div>
				</div>
			</div>
			<button type="button" data-dial-toggle="speed-dial-menu-horizontal"
			        aria-controls="speed-dial-menu-horizontal" aria-expanded="false"
			        className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
				<svg aria-hidden="true" className="w-8 h-8 transition-transform group-hover:rotate-45" fill="none"
				     stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
					      d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>
				<span className="sr-only">Open actions menu</span>
			</button>
		</div>
	)
}

export default function DashboardSidebarStaticDesktop(){
	return (
		<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">

			<SidebarBrandLogo />

			{/* Sidebar component, swap this element with another sidebar if you like */}
			<div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">

				{/* User account dropdown */}
				<SidebarAuthUserInfoWithOption />

				{/* Sidebar Search */}
				<SidebarSearch />

				{/* Navigation */}
				<SidebarNavigation />
				
				<SidebarStartNewProjectContent />
			</div>
		</div>
	)
}