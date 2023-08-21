import React, {Fragment, useEffect, useState} from "react";
import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import classNames from "@/utils/classNames";
import LoadingCircle from "@/components/ui/loading/LoadingCircle";
import {useGetAgentsQuery} from "@/store/features/user/UserAPISlice";

export default function AgentUserSelection({ workspaceId, onSelect}) {

    const {
        data: agentUserData,
        isLoading: agentUserDataIsLoading,
        error: agentUserDataFetchError,
        refetch: refetchAgentUserData
    } = useGetAgentsQuery({workspaceId: workspaceId}, {skip: !workspaceId})

    const [selectedAgent, setSelectedAgent] = useState( {})
    const [agentList, setAgentList] = useState(agentUserData)

    useEffect(() => {
        onSelect(selectedAgent)
    }, [selectedAgent])

    useEffect(() => {
        if (agentUserData) {
            const users = [{
                id: 'all',
                user: {
                    "name": "All Agents"
                }
            },...agentUserData,]
            setAgentList(users)
            setSelectedAgent(users[0])
        }
    }, [agentUserData])

    return (
        <div>
            <h3 className="text-sm font-medium leading-6 text-gray-900 mb-2">Select Agent</h3>

            {agentUserDataIsLoading && ( <LoadingCircle size={6}/>)}
            {Object.keys(selectedAgent).length>0 && (
                <Listbox value={selectedAgent} onChange={setSelectedAgent}>
                    {({open}) => (
                        <>
                            <div className="relative mt-1 z-20">
                                <Listbox.Button
                                    className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
							<span className="flex items-center">

								<span className="ml-3 block truncate">{selectedAgent?.user?.name}</span>
							</span>

                                    <span
                                        className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
							</span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options
                                        className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {agentList?.length > 0 && agentList.map((agent) => (
                                            <Listbox.Option
                                                key={agent.id}
                                                className={({active}) =>
                                                    classNames(
                                                        active ? 'bg-gray-100' : 'text-gray-900',
                                                        'relative cursor-default select-none py-2 pl-3 pr-9 cursor-pointer'
                                                    )
                                                }
                                                value={agent}
                                            >
                                                {
                                                    ({selected, active}) => (
                                                        <>
                                                            <div className="flex items-center">
                                                                {/*<ChannelIcon channelType={channel?.channelType} size={20} />*/}

                                                                <span
                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                >
							                            {agent.user.name}
							                          </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'text-white' : 'text-indigo-600',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
							                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
													</span>
                                                            ) : null}
                                                        </>
                                                    )
                                                }
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </>
                    )}
                </Listbox>
            )}

        </div>

    )
}