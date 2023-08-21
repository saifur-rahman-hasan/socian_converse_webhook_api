import {CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon} from '@heroicons/react/24/outline'
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useGetTaskOverviewMutation} from "@/store/features/reports/agentActivity/AgentActivityAPISlice";
import MessengerChannelSelection from "@/components/Converse/ConverseMessengerApp/MessengerChannelSelection";
import DefaultSkeleton from "@/components/ui/Skeleton/DefaultSkeleton";
import AgentUserSelection from "@/components/Agent/AgentUserSelection";
import {useGetAgentsQuery} from "@/store/features/user/UserAPISlice";


export default function AnalyticsOverviewReports({selectedWorkspace,agentId}) {

    const [
        taskOverview,
        {idLoading: taskOverviewIsLoading, data: taskOverviewData}
    ] = useGetTaskOverviewMutation()

    const {
        data: agentUserData,
        isLoading: agentUserDataIsLoading,
        error: agentUserDataFetchError,
        refetch: refetchAgentUserData
    } = useGetAgentsQuery({workspaceId: selectedWorkspace?.id}, {skip: !selectedWorkspace?.id})


    const selectedDate = useSelector((state) => state.reports.selected_date_time);
    const [isLoading, setIsLoading] = useState(false)
    const [currentDate, setCurrentDate] = useState("")
    const [previousDate, setPreviousDate] = useState("")
    const [taskOverViewData, setTaskOverViewData] = useState([])
    const [messageOverViewData, setMessageOverViewData] = useState([])
    const [messageResponseOverViewData, setMessageResponseOverViewData] = useState([])
    const [
        selectedChannel,
        setSelectedChannel
    ] = useState(null)
    const [selectedAgent,setSelectedAgent] = useState(null)


    useEffect(() => {
        if (selectedDate?.currentDate && selectedDate?.previousDate) {
            setCurrentDate(selectedDate?.currentDate)
            setPreviousDate(selectedDate?.previousDate)
        }
    }, [selectedDate])

    useEffect(() => {
        getOverviewData()

    }, [previousDate, currentDate])

    useEffect(() => {
        getOverviewData()
    }, [selectedAgent])

    function formatDateToYYYYMMDD(originalDateString) {
        const originalDate = new Date(originalDateString);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function getOverviewData() {
        console.log(currentDate, previousDate)
        setIsLoading(true)
        let agentIdParam = null
        if (selectedAgent?.id !== 'all'){
            agentIdParam = selectedAgent?.user?.id
        }
        const data = await taskOverview({
            channelIds: [selectedChannel?.id?.toString()],
            dateFrom: currentDate,
            dateTo: previousDate,
            agentId: agentId?agentId:agentIdParam
        })
        setIsLoading(false)
        let task_overview_list = []
        let message_overview_list = []
        let message_response_overview_list = []
        if (data?.data?.data) {
            // task related reports
            const total_task = data?.data?.data?.total_task
            task_overview_list.push({
                "title": "Total Task",
                "value": total_task
            })
            const total_closed_task = data?.data?.data?.total_closed_task
            task_overview_list.push({
                "title": "Total Closed Task",
                "value": total_closed_task
            })

            // const total_partially_closed_task = data?.data?.data?.total_partially_closed_task
            // task_overview_list.push({
            //     "title": "Total Closed Task",
            //     "value": total_partially_closed_task
            // })
            const total_assigned_task = data?.data?.data?.total_assigned_task
            task_overview_list.push({
                "title": "Total Assigned Task",
                "value": total_assigned_task
            })
            const total_pending_task = data?.data?.data?.total_pending_task
            task_overview_list.push({
                "title": "Total Pending Task",
                "value": total_pending_task
            })

            const active_assigned_task = data?.data?.data?.active_assigned_task
            task_overview_list.push({
                "title": "Active Assigned Task",
                "value": active_assigned_task
            })


            // message related reports
            const total_ice_message = data?.data?.data?.total_ice_message
            message_overview_list.push({
                "title": "Total ICE message",
                "value": total_ice_message
            })
            const totalIceFeedbackMessageY = data?.data?.data?.totalIceFeedbackMessageY
            message_overview_list.push({
                "title": "ICE Response Y",
                "value": totalIceFeedbackMessageY
            })
            const totalIceFeedbackMessageN = data?.data?.data?.totalIceFeedbackMessageN
            message_overview_list.push({
                "title": "ICE Response N",
                "value": totalIceFeedbackMessageN
            })

            const total_agent_message = data?.data?.data?.total_agent_message
            message_overview_list.push({
                "title": "Total Agent message",
                "value": total_agent_message
            })

            const total_consumer_message = data?.data?.data?.total_consumer_message
            message_overview_list.push({
                "title": "Total Consumer message",
                "value": total_consumer_message
            })

            const returningUser = data?.data?.data?.returningUser
            message_overview_list.push({
                "title": "Returning User",
                "value": returningUser
            })

            const newUser = data?.data?.data?.newUser
            message_overview_list.push({
                "title": "New User",
                "value": newUser
            })


            // Total Message Response Overview
            const total_response_rate = data?.data?.data?.total_response_rate
            message_response_overview_list.push({
                "title": "Total Response Rate",
                "value": total_response_rate + "%"
            })
            const total_response_time = data?.data?.data?.total_response_time
            message_response_overview_list.push({
                "title": "Response Time",
                "value": total_response_time
            })

            const total_handling_time = data?.data?.data?.total_handling_time
            message_response_overview_list.push({
                "title": "Handling Time",
                "value": total_handling_time
            })
            const total_response_time_avg = data?.data?.data?.total_response_time_avg
            message_response_overview_list.push({
                "title": "Average Response Time",
                "value": total_response_time_avg
            })
            const total_handling_time_avg = data?.data?.data?.total_handling_time_avg
            message_response_overview_list.push({
                "title": "Average Handling Time ",
                "value": total_handling_time_avg
            })

            // const total_waiting_time = data?.data?.data?.total_waiting_time
            // message_response_overview_list.push({
            //     "title": "Thread Agent LifeTime",
            //     "value": total_waiting_time
            // })
        }
        setTaskOverViewData(task_overview_list)
        setMessageResponseOverViewData(message_response_overview_list)
        setMessageOverViewData(message_overview_list)
    }

    useEffect(() => {
        getOverviewData()
    }, [selectedChannel])

    function CardForCountingReports({title, dataList}) {
        if (dataList && dataList.length > 0) {
            return (<div>
                {/*<Dump data={selectedAgent.id }/>*/}
                {/*<div className="pt-4 sm:flex sm:items-center">*/}
                {/*    <div className="sm:flex-auto">*/}
                {/*        <h1 className="text-1xl font-semibold leading-6 text-gray-900">{title}</h1>*/}
                {/*    </div>*/}

                {/*</div>*/}
                <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {dataList.map((item) => (
                        <div
                            key={item.title}
                            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 sm:pt-6"
                        >
                            <dt>
                                <div className="absolute rounded-md bg-indigo-500 p-3">
                                    <EnvelopeOpenIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                </div>
                                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.title}</p>
                            </dt>
                            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>

                            </dd>
                        </div>
                    ))}
                </dl>
            </div>);
        } else {
            return null
        }

    }

    function TabView() {
        const [activeTab, setActiveTab] = useState('taskOverview');

        const handleTabChange = (tabName) => {
            setActiveTab(tabName);
        };

        return (
            <div className="px-4 py-8">
                {/* Your MessengerChannelSelection component */}
                <div
                    className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px">
                        <li className="mr-2">
                            <button
                                onClick={() => handleTabChange('taskOverview')}
                                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                                    activeTab === 'taskOverview' ? 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            >
                                Task Overview
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                onClick={() => handleTabChange('messageOverview')}
                                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                                    activeTab === 'messageOverview' ? 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            >
                                Message Overview
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                onClick={() => handleTabChange('messageResponseOverview')}
                                className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg ${
                                    activeTab === 'messageResponseOverview' ? 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            >
                                Message Response Overview
                            </button>
                        </li>
                    </ul>
                </div>


                {/* Render the corresponding CardForCountingReports based on the activeTab state */}
                {
                    isLoading ? (<DefaultSkeleton className="my-4 mx-4"/>) : (
                        <div>
                            {activeTab === 'taskOverview' && (
                                <CardForCountingReports title={'Task Overview'} dataList={taskOverViewData}/>
                            )}
                            {activeTab === 'messageOverview' && (
                                <CardForCountingReports title={'Message Overview'} dataList={messageOverViewData}/>
                            )}
                            {activeTab === 'messageResponseOverview' && (
                                <CardForCountingReports
                                    title={'Message Response Overview'}
                                    dataList={messageResponseOverViewData}
                                />
                            )}
                        </div>
                    )
                }


            </div>
        );
    }

    return (
        <div className="px-4 py-4">
            {/*<Dump data={agentUserData}/>*/}
            <div className="mt-4 grid grid-cols-2 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                <div>
                    <h3 className="text-sm font-medium leading-6 text-gray-900 mb-2">Select  Channel</h3>
                    <MessengerChannelSelection
                        channels={selectedWorkspace?.channels}
                        onSelect={setSelectedChannel}
                    />

                </div>
                {agentId ? null : (
                    <div>
                        <AgentUserSelection
                            workspaceId={selectedWorkspace?.id}
                            onSelect={setSelectedAgent}
                        />
                    </div>
                )}
            </div>
            <TabView
                taskOverViewData={taskOverViewData}
                messageOverViewData={messageOverViewData}
                messageResponseOverViewData={messageResponseOverViewData}
            />

        </div>
    )
}
