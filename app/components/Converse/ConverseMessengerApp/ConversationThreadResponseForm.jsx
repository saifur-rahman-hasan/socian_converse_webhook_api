import {
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon, XMarkIcon
} from "@heroicons/react/20/solid";
import {Listbox, Transition} from "@headlessui/react";
import {Fragment, useState} from "react";
import classNames from "@/utils/classNames";
import Dump from "@/components/Dump";
import useMessengerQueryParams from "@/hooks/useMessengerQueryParams";
import {useCreateConversationMessageMutation} from "@/store/features/messenger/MessengerAPISlice";
import {useRouter} from "next/router";

const moods = [
    { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
    { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
    { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
    { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
    { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

export default function ConversationThreadResponseForm(){
    const [selected, setSelected] = useState(moods[5])
    const [messageText, setMessageText] = useState('')
    const router = useRouter()

    const {
        workspaceId,
        channelId,
        conversationId,
        threadId,
        activityTab
    } = useMessengerQueryParams()


    const [messageCreate, {
        isLoading: messageIsCreating,
        error: messageCreateError
    }] = useCreateConversationMessageMutation()

    const handleSendMessage = async (e) => {
        e.preventDefault()

        if(!conversationId){
            alert("Invalid Conversation Data Loaded.");
        }

        const from = {
            id: 1,
            name: 'The Agent',
            role: 'agent',
            image: null
        }
        const to = {
            id: 123,
            name: 'The Consumer',
            role: 'consumer',
            image: null
        }

        const message = {
            "type": "text",
            "content": messageText
        }

        const messageCreateResult = await messageCreate({
            workspaceId,
            channelId,
            conversationId,
            threadId,
            from,
            to,
            message
        })

        if(messageCreateResult?.data?.data?._id){
            await router.push({
                pathname: '/workspaces/[workspaceId]/converse/',
                query: {
                    workspaceId,
                    channelId,
                    conversationId,
                    threadId,
                    activityTab: 'chat'
                }
            })
        }else{
            alert('Failed to send message')
        }

        setMessageText(null)
    }


    return (
        <form
            onSubmit={handleSendMessage}
            className="relative flex-auto">

            <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <label htmlFor="comment" className="sr-only">
                    Send your message
                </label>
                <textarea
                    rows={2}
                    name="comment"
                    id="comment"
                    className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Send your message..."
                    defaultValue={''}
                    onChange={e => setMessageText(e.target.value)}
                />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                <div className="flex items-center space-x-5">
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        >
                            <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Attach a file</span>
                        </button>
                    </div>

                    <div className="flex items-center">
                        <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                                <>
                                    <Listbox.Label className="sr-only">Your mood</Listbox.Label>
                                    <div className="relative">
                                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {selected.value === null ? (
                                <span>
                                <FaceSmileIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                <span className="sr-only">Add your mood</span>
                              </span>
                            ) : (
                                <span>
                                <span
                                    className={classNames(
                                        selected.bgColor,
                                        'flex h-8 w-8 items-center justify-center rounded-full'
                                    )}
                                >
                                  <selected.icon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                                </span>
                                <span className="sr-only">{selected.name}</span>
                              </span>
                            )}
                          </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                                {moods.map((mood) => (
                                                    <Listbox.Option
                                                        key={mood.value}
                                                        className={({ active }) =>
                                                            classNames(
                                                                active ? 'bg-gray-100' : 'bg-white',
                                                                'relative cursor-default select-none px-3 py-2'
                                                            )
                                                        }
                                                        value={mood}
                                                    >
                                                        <div className="flex items-center">
                                                            <div
                                                                className={classNames(
                                                                    mood.bgColor,
                                                                    'flex h-8 w-8 items-center justify-center rounded-full'
                                                                )}
                                                            >
                                                                <mood.icon
                                                                    className={classNames(mood.iconColor, 'h-5 w-5 flex-shrink-0')}
                                                                    aria-hidden="true"
                                                                />
                                                            </div>
                                                            <span className="ml-3 block truncate font-medium">{mood.name}</span>
                                                        </div>
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                </div>

                {
                    messageIsCreating
                        ? (
                            <button
                                type="button"
                                disabled={true}
                                className="rounded-md bg-gray-200 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Sending ....
                            </button>
                        )
                        : (
                            <button
                                type="submit"
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Send Message
                            </button>
                        )
                }
            </div>
        </form>
    )
}