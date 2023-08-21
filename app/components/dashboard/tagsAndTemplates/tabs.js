import { Dialog, Transition } from '@headlessui/react';
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from 'react';
import { useCreateTagMutation, useCreateTemplateMutation } from "../../../store/features/workspace/WorkspaceAPISlice";
import MessageTemplateTable from './messageTemplateTable';
import TagsTable from './tagsTable';

const tabs = [
    { name: 'Tags', href: '#', current: true },
    { name: 'Templates', href: '#', current: false }
]

const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}




export default function TagAndTemplateManage() {
    const router = useRouter()
	// const {workspaceId} = router.query
    const [open, setOpen] = useState(false)
    const [inputName, setInputName] = useState("")
    const [inputMessage, setInputMessage] = useState("")
    const [imageUri, setImageUri] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedTab, setSelectedTab] = useState(tabs.find((tab) => tab.current)?.name);
    const cancelButtonRef = useRef(null)
    
    const [
        createTemplate,
        {
            isLoading: createTemplateIsLoading,
            error: createTemplateError
        }
    ] = useCreateTemplateMutation();
    
    const [
        createTag,
        {
            isLoading: createTagIsLoading,
            error: createTagError
        }
    ] = useCreateTagMutation();
    
    const handleCreateSubmission = async (e) => {
		e.preventDefault()

        let createdResponse;
        
        const dataObj = {
            name: inputName,
            message: inputMessage,
            imageUri: imageUri
        }
        
        if(selectedTab === "Templates"){
            createdResponse = await createTemplate(dataObj)
        }

        if(selectedTab === "Tags"){
            createdResponse = await createTag(dataObj)
        }
        
        if(createdResponse?.data?.success === true){
            setOpen(false)
            setErrorMessage('')
        }else if(createdResponse?.error){
            setErrorMessage(createdResponse?.error.data.message)
        }
    }

    return (
        <div className="relative">
            <div className="flex justify-start items-center px-5 py-5">
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={tabs.find((tab) => tab.current)?.name}
                    >
                        {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                        ))}
                    </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <a
                                    key={tab.name}
                                    href="#"
                                    className={classNames(
                                        tab.name == selectedTab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                                        'flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                                    )}
                                    onClick={(e) => setSelectedTab(tab.name)}
                                    aria-current={tab.current ? 'page' : undefined}
                                >
                                    {tab.name}
                                    {tab.count ? (
                                        <span
                                            className={classNames(
                                                tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
                                                'ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block'
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 mt-10">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">{selectedTab}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all the {selectedTab} in your workspace.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            onClick={()=>{
                                setOpen(true)
                            }}
                            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Add {selectedTab}
                        </button>
                    </div>
                </div>
                
                {
                    selectedTab === "Templates" && (
                        <MessageTemplateTable/>
                    )
                }
                
                {
                    selectedTab === "Tags" && (
                        <TagsTable/>
                    )
                }
            </div>

            <Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <form onSubmit={handleCreateSubmission}>
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="my-6 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    Add {selectedTab}
                                                </Dialog.Title>
                                            </div>

                                            { selectedTab === "Templates" && (
                                                <div className="mt-2">
                                                    <div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                                        <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            value={inputName}
                                                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setInputName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                                        <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                                            Message
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            value={inputMessage}
                                                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-10"
                                                            onChange={(e) => setInputMessage(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {
                                                selectedTab === "Tags" && (
                                                    <div className="mt-2">
                                                        <div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                                            <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                value={inputName}
                                                                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                                onChange={(e) => setInputName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                disabled={false}
                                            >
                                                Create
                                            </button>
                                            
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                onClick={() => setOpen(false)}
                                                ref={cancelButtonRef}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
        </div>
    )
}
