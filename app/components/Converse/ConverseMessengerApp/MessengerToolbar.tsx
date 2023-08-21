import {
	ArchiveBoxIcon as ArchiveBoxIconMini,
	ArrowUturnLeftIcon, ChevronDownIcon, ChevronUpIcon, FolderArrowDownIcon,
	PencilIcon,
	UserPlusIcon
} from "@heroicons/react/20/solid";
import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";
import classNames from "../../../utils/classNames";
import {useRouter} from "next/router";

export default function MessengerToolbar(){
	const router = useRouter()
	const {
		taskId
	} = router?.query

	return (
		<div className="flex h-16 flex-col justify-center">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-3">
					{
						taskId && (
							<div className={`flex items-center gap-x-3`}>
								<span>Replay on Task:</span>
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
							        #{taskId}
								</span>
							</div>
						)
					}

					{/* Left buttons */}
					<div>
						<div className="isolate inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
                          <span className="inline-flex sm:shadow-sm">
                            <button
	                            type="button"
	                            className="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10"
                            >
                              <ArrowUturnLeftIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Reply
                            </button>
                            <button
	                            type="button"
	                            className="relative -ml-px hidden items-center gap-x-1.5 bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10 sm:inline-flex"
                            >
                              <PencilIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Note
                            </button>
                            <button
	                            type="button"
	                            className="relative -ml-px hidden items-center gap-x-1.5 rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10 sm:inline-flex"
                            >
                              <UserPlusIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Assign
                            </button>
                          </span>

							<span className="hidden space-x-3 lg:flex">
                            <button
	                            type="button"
	                            className="relative -ml-px hidden items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10 sm:inline-flex"
                            >
                              <ArchiveBoxIconMini className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Archive
                            </button>
                            <button
	                            type="button"
	                            className="relative -ml-px hidden items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10 sm:inline-flex"
                            >
                              <FolderArrowDownIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              Move
                            </button>
                          </span>

							<Menu as="div" className="relative -ml-px block sm:shadow-sm lg:hidden">
								<div>
									<Menu.Button className="relative inline-flex items-center gap-x-1.5 rounded-r-md bg-white px-2 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 sm:rounded-md sm:px-3">
										<span className="sr-only sm:hidden">More</span>
										<span className="hidden sm:inline">More</span>
										<ChevronDownIcon className="h-5 w-5 text-gray-400 sm:-mr-1" aria-hidden="true" />
									</Menu.Button>
								</div>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										<div className="py-1">
											<Menu.Item>
												{({ active }) => (
													<a
														href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
														className={classNames(
															active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
															'block px-4 py-2 text-sm sm:hidden'
														)}
													>
														Note
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
														className={classNames(
															active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
															'block px-4 py-2 text-sm sm:hidden'
														)}
													>
														Assign
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
														className={classNames(
															active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
															'block px-4 py-2 text-sm'
														)}
													>
														Archive
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
														className={classNames(
															active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
															'block px-4 py-2 text-sm'
														)}
													>
														Move
													</a>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>

					{/* Right buttons */}
					<nav aria-label="Pagination">
                        <span className="isolate inline-flex rounded-md shadow-sm">
                          <a
	                          href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
	                          className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                          </a>
                          <a
	                          href="@/components/Converse/ConverseMessengerApp/MessengerToolbar#"
	                          className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:z-10 hover:bg-gray-50 focus:z-10"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                          </a>
                        </span>
					</nav>
				</div>
			</div>
		</div>
	)
}