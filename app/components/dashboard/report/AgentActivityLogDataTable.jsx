import {FolderIcon, FolderOpenIcon, PlusIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {useEffect, useState, Fragment} from "react";
import {useGetWorkspaceByIdQuery} from "@/store/features/workspace/WorkspaceAPISlice";
import {useGetAgentActivitiesQuery} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import IconTelegramSvg from "@/components/ui/icons/IconTelegramSvg";
import IconMessengerSvg from "@/components/ui/icons/IconMessengerSvg";
import {ChatBubbleBottomCenterTextIcon, TrashIcon} from "@heroicons/react/24/outline";
import Dump from "@/components/Dump";
import {formatSeconds} from "@/utils/helperFunctions";
import {useSelector} from "react-redux";
import DataTablePagination from "@/components/dashboard/report/components/DataTablePagination";
import {Dialog, Disclosure, Menu, Popover, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";

export default function AgentActivityLogDataTable({workspaceId}) {

    const selectedDate = useSelector((state) => state.reports.selected_date_time);
    const [currentDate, setCurrentDate] = useState("")
    const [previousDate, setPreviousDate] = useState("")

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationPerPage, setPaginationPerPage] = useState(10)
    const [totalDataFound, setTotalDataFound] = useState(1)

    const [activities, setActivities] = useState([])

    // Define your RTK query hook
    const {
        data: agentActivityData,
        isLoading: agentActivityDataIsLoading,
        error: agentActivityDataFetchError,
        refetch: agentActivityDataRefetch
    } = useGetAgentActivitiesQuery({
        workspaceId: workspaceId,
        from: currentPage - 1,
        size: paginationPerPage,
        dateFrom: currentDate,
        dateTo: previousDate
    }, {skip: !workspaceId})

    useEffect(() => {
        if (agentActivityData?.data) {
            setActivities(agentActivityData?.data)
        }
        if (agentActivityData?.total) {
            setTotalDataFound(agentActivityData?.total)
        }

    }, [agentActivityData])

    useEffect(() => {
        if (selectedDate?.currentDate && selectedDate?.previousDate) {
            setCurrentDate(selectedDate?.currentDate)
            setPreviousDate(selectedDate?.previousDate)
        }
    }, [selectedDate])

    useEffect(() => {
        agentActivityDataRefetch({
            workspaceId: workspaceId,
            from: currentPage - 1,
            size: paginationPerPage,
            dateFrom: currentDate,
            dateTo: previousDate
        })

    }, [previousDate, currentDate])

    useEffect(() => {
        if (!agentActivityDataIsLoading) {
            agentActivityDataRefetch({
                workspaceId: workspaceId,
                from: currentPage - 1,
                size: paginationPerPage,
                dateFrom: currentDate,
                dateTo: previousDate
            })
        }
    }, [currentPage, paginationPerPage])

    function handlePaginationClick(data) {
        // agentActivityDataRefetch({
        //     workspaceId: workspaceId,
        //     from: data?.currentPage ? data?.currentPage : 0,
        //     size: data?.paginationPerPage ? data?.paginationPerPage : 10,
        //     dateFrom: currentDate,
        //     dateTo: previousDate
        // })
        if (data) {
            setCurrentPage(data?.currentPage ? data?.currentPage : currentPage)
            setPaginationPerPage(data?.paginationPerPage ? data?.paginationPerPage : paginationPerPage)
        }
    }

    const TableFilterSection = () => {

        const filters = [
            {
                id: 'agents',
                name: 'Agents',
                options: [
                    {value: 'demouser@socian.ai', label: 'demouser@socian.ai'},
                    {value: 'demouser1@socian.ai', label: 'demouser1@socian.ai'},
                    {value: 'demouser2@socian.ai', label: 'demouser2@socian.ai'},
                ],
            },
            {
                id: 'activityType',
                name: 'ActivityType',
                options: [
                    {value: 'logout', label: 'Logout'},
                    {value: 'break', label: 'Break'},
                    {value: 'unavailable', label: "Unavailable"},
                    {value: 'idle', label: "Idle"},
                    {value: 'available', label: "Available"},
                ],
            }
        ]

        function handleOnclose() {

        }

        const [open, setOpen] = useState(false)

        return (
            <div className="bg-white mt-2">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
                    <section aria-labelledby="filter-heading" className="border-t border-gray-200 py-6">


                        <div className="flex items-center justify-between">
                            <div className="relative inline-block text-left w-full mr-8">
                                <div className="w-full">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div
                                                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true"
                                                     className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                                     fill="currentColor" viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <input type="text" id="simple-search"
                                                   className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                   placeholder="Search" required=""/>
                                        </div>
                                    </form>
                                </div>

                            </div>


                            <button
                                type="button"
                                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                                onClick={() => setOpen(true)}
                            >
                                Filters
                            </button>

                            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
                                {filters.map((section, sectionIdx) => (
                                    <Popover
                                        as="div"
                                        key={section.name}
                                        id={`desktop-menu-${sectionIdx}`}
                                        className="relative inline-block text-left"
                                    >
                                        <div>
                                            <Popover.Button
                                                className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                                <span>{section.name}</span>
                                                {sectionIdx === 0 ? (
                                                    <span
                                                        className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                          1
                        </span>
                                                ) : null}
                                                <ChevronDownIcon
                                                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />
                                            </Popover.Button>
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
                                            <Popover.Panel
                                                className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <form className="space-y-4">
                                                    {section.options.map((option, optionIdx) => (
                                                        <div key={option.value} className="flex items-center">
                                                            <input
                                                                id={`filter-${section.id}-${optionIdx}`}
                                                                name={`${section.id}[]`}
                                                                defaultValue={option.value}
                                                                type="checkbox"
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <label
                                                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                                            >
                                                                {option.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </form>
                                            </Popover.Panel>
                                        </Transition>
                                    </Popover>
                                ))}
                            </Popover.Group>
                        </div>
                    </section>
                </div>
            </div>
        )
    }


    return (
        <div className="py-4 my-4">
            {/*<Dump data={{activities}}/>*/}
            <div className="px-6 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Agent Activity Log</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        All agents' activity goes here, providing a comprehensive record of their interactions and tasks
                        performed while handling socian converse.
                    </p>
                </div>

            </div>
            <TableFilterSection/>
            <div className="flow-root bg-white px-6 shadow">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                    Agent Info
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    activityType
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Duration
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    activityTime
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {activities?.map((activity) => (
                                <tr key={activity.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {activity?.agent_info?.name}<br/> {activity?.agent_info?.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold">{activity.activityType}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatSeconds(activity.duration)}<br/>Minutes
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(activity.activityTime).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {totalDataFound > 0 ?
                            (<DataTablePagination
                                handlePaginationClick={handlePaginationClick}
                                size={totalDataFound}
                            />) : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
