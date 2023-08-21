import {Fragment, useEffect, useState} from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { UsersIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import classNames from "@/utils/classNames";
import {useDispatch, useSelector} from "react-redux";
import {
    editConversationSearch,activateChatWindow
} from '@/store/features/messenger/MessengerInstanceSlice'
import {
    useCreateConversationConsumersMutation,
} from '@/store/features/messenger/MessengerAPISlice'
import Dump from "@/components/Dump";
import {useRouter} from "next/router";
import DefaultGravatar from '@/components/DefaultGravatar'

export default function MessengerChatConversationSearchModal() {
    const router = useRouter()
	const {
		workspaceId,channelId
	} = router?.query

    const chatWindowData = useSelector(state => state.messengerInstance.chat_window.data)
    const conversationSearch = useSelector(state => state.messengerInstance.conversation_search)
    const [query, setQuery] = useState('')
    const [filteredPeople, setFilteredPeople] = useState([])
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(conversationSearch?.open){
            setOpen(true)
            setQuery(conversationSearch?.data?.query || '')
        }else{
            setOpen(false)
            setQuery('')
        }
    }, [conversationSearch])
    
    useEffect(() => {
        if(query.length > 1){
            const debounceId = setTimeout(() => {
                handleSearchConversations(query)            
                dispatch(editConversationSearch({ query }))
            }, 1000);
        
            return () => {
                clearTimeout(debounceId);
            };
        }
    }, [query])

    const [searchConsumer, {
        isLoading: searchConsumerIsLoading,
        error: searchConsumerError
    }] = useCreateConversationConsumersMutation()

    async function handleSearchConversations(query){

        const updatedWorkspace = await searchConsumer({
            query: query,
            workspaceId: workspaceId,
            channelId: channelId
        })

        const filteredPeopleResult = updatedWorkspace?.data?.filter((person) => {
            return person?.name.toLowerCase().includes(query.toLowerCase())
        })
        
        setFilteredPeople(filteredPeopleResult)
    }
    
    const sendMessageHandler = async (e,activeOption) => {
		e.preventDefault()
        const { currentThreadId, email, id, name, role } = activeOption;

        setOpen(false)
        dispatch(activateChatWindow({
            workspaceId: workspaceId,
            channelId: channelId,
            conversationId: id,
            currentThreadId: currentThreadId,
            activeThreadId: currentThreadId,
            activityTab: "threads",
            userActivityType: currentThreadId ? "preview_single_thread" : "preview_all_threads"
        }))
    }
    
    function handleComboboxChange(person) {
        dispatch(editConversationSearch({
            query: query,
            selectedConversation: person
        }))
    }

    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                </Transition.Child>


                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">

                            <Combobox onChange={(person) => handleComboboxChange(person)}>
                                {({ activeOption }) => (
                                    <>
                                        <div className="relative">
                                            
                                            {searchConsumerIsLoading &&(
                                                <>
                                                    <span className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 loading loading-sm'></span>
                                                </>
                                            )}
                                            {!(searchConsumerIsLoading) &&(
                                                <MagnifyingGlassIcon
                                                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <Combobox.Input
                                                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                                placeholder="Search..."
                                                onChange={(event) => setQuery(event.target.value) }
                                            />
                                        </div>
                                        
                                        {(filteredPeople?.length > 0 || query === '') && (
                                            <Combobox.Options as="div" static hold className="flex divide-x divide-gray-100">
                                                <div
                                                    className={classNames(
                                                        'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                                                        activeOption && 'sm:h-96'
                                                    )}
                                                >
                                                    <div className="-mx-2 text-sm text-gray-700">
                                                        {filteredPeople?.map((person) => (
                                                            <Combobox.Option
                                                                as="div"
                                                                key={person?.id}
                                                                value={person}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        'flex cursor-default select-none items-center rounded-md p-2',
                                                                        active && 'bg-gray-100 text-gray-900'
                                                                    )
                                                                }
                                                            >
                                                                {({ active }) => (
                                                                    <>
                                                                        <DefaultGravatar className="h-6 w-6 flex-none rounded-full" />
                                                                        <span className="ml-3 flex-auto truncate">{person?.name}</span>
                                                                        {active && (
                                                                            <ChevronRightIcon
                                                                                className="ml-3 h-5 w-5 flex-none text-gray-400"
                                                                                aria-hidden="true"
                                                                            />
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))}
                                                    </div>
                                                </div>

                                                {activeOption && (
                                                    <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                                                        
                                                        <div className="flex flex-auto flex-col justify-between p-10">
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                                <dt className="col-end-1 font-semibold text-gray-900">Name</dt>
                                                                <dd className="truncate">
                                                                    {activeOption?.name}
                                                                </dd>
                                                            </dl>
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                                <dt className="col-end-1 font-semibold text-gray-900">Role</dt>
                                                                <dd className="truncate">
                                                                    {activeOption?.role}
                                                                </dd>
                                                            </dl>
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                                <dt className="col-end-1 font-semibold text-gray-900">Email</dt>
                                                                <dd className="truncate">
                                                                    <a href={`mailto:${activeOption.email}`} className="text-indigo-600 underline">
                                                                        {activeOption.email}
                                                                    </a>
                                                                </dd>
                                                            </dl>
                                                            <button
                                                                type="button"
                                                                onClick={(e)=>sendMessageHandler(e,activeOption)}
                                                                className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            >
                                                                Send message
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Combobox.Options>
                                        )}

                                        {query !== '' && filteredPeople?.length === 0 && (
                                            <div className="px-6 py-14 text-center text-sm sm:px-14">
                                                <UsersIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                                <p className="mt-4 font-semibold text-gray-900">No consumer found</p>
                                                <p className="mt-2 text-gray-500">
                                                    We couldn’t find anything with that term. Please try again.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
