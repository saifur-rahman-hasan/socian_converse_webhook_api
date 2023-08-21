import Dump from '@/components/Dump';
import React, { useState, Fragment, useRef, useEffect } from 'react';
import {useRouter} from "next/router";
import {useGetMessageTemplatesQuery,useSearchTemplateMutation,useUpdateMessageTemplatesMutation,useGetChannelsQuery,useCreateMessageTempAddToChannelMutation} from "../../../store/features/workspace/WorkspaceAPISlice";
import PaginationButtons from '@/components/ui/table/pagination';
import { Listbox, Dialog, Transition } from '@headlessui/react'
import { AdjustmentsHorizontalIcon,CheckIcon,ChevronUpDownIcon,XCircleIcon } from "@heroicons/react/24/solid";
import MultipleSelectMenu from '@/components/ui/forms/multipleSelectManu';

export default function MessageTemplateTable() {
    
    const [page, setPage] = useState(1);
    const [modalFor, setModalFor] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState();
    const [selectedTemplateName, setSelectedTemplateName] = useState();
    const [inputName, setInputName] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [searchText, setSearchText] = useState("");
    const cancelButtonRef = useRef(null)

    // Define your RTK query hook
	const {
		data: templatesData,
		isLoading: templatesIsLoading
	} = useGetMessageTemplatesQuery(page)
    
    const handleOnEditClick = (template) => {
        setModalFor("Edit")
        setSelectedTemplateId(template?.id);
        setSelectedTemplateName(template?.name);
        setInputName(template?.name);
        setInputMessage(template?.message);
        setModalShow(true)
    }
    const handleOnAddChanelClick = (template) => {
        setSelectedTemplateId(template?.id);
        setSelectedTemplateName(template?.name);

        setModalFor("Add To Channel")
        setModalShow(true)
    }

    const [updateTemplate, {
		isLoading: updateTemplateIsLoading,
		error: updateTemplateError
	}] = useUpdateMessageTemplatesMutation()

    const handleUpdateSubmission = async (e) => {
		e.preventDefault()

        if(modalFor === "Add To Channel"){
            let final_data = []
            for(const channel of selectedChannel){
                const dataObj = {
                    channel_id: channel?.id,
                    channel_name: channel?.name,
                    template_name: selectedTemplateName,
                    template_id: selectedTemplateId,
                    dataSource: "messageTemplate"
                }
                final_data.push(dataObj)
            }
            
            await addToChannel(final_data)
        }else if(modalFor === "Edit"){
            const updatedWorkspace = await updateTemplate({
                id: selectedTemplateId,
                name: inputName,
                message: inputMessage
            })
        }
            

        setModalShow(false)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
    };
    
    const {
		data: channelList,
		isLoading: channelListIsLoading
	} = useGetChannelsQuery()

    const [
        addToChannel,
        {
            isLoading: addToChannelIsLoading,
            error: addToChannelError
        }
    ] = useCreateMessageTempAddToChannelMutation();

    const [selectedChannel, setSelectedChannels] = useState([])
    const [templateSearchText, setTemplateSearchText] = useState("")
    const [dataArray, setDataArray] = useState()

    const [
        searchTemplate,
        {
            isLoading: searchTemplateIsLoading,
            error: searchTemplateError
        }
    ] = useSearchTemplateMutation();

    async function handleTemplateSearch(){
		const searchResponse = await searchTemplate({key:templateSearchText,channelId:0})
        
        // setSearchResult(searchResponse?.data?.data)
        setDataArray(searchResponse?.data?.data)
    }
    
    useEffect(() => {
		if(templateSearchText && templateSearchText.length > 2){
			const debounceId = setTimeout(() => {
                handleTemplateSearch()            
            }, 1000);
    
            return () => {
                clearTimeout(debounceId);
            };
		}
	}, [templateSearchText])

    useEffect(() => {
        setTemplateSearchText("")
        setDataArray([])
		setDataArray(templatesData)
	}, [templatesIsLoading,page])

    return (
        <div className="-mx-4 mt-8 sm:-mx-0">

            <input
                type="text"
                placeholder="Search"
                value={templateSearchText}
                onChange={(e) => setTemplateSearchText(e.target.value)}
                className="w-sm px-4 py-2 mb-3 rounded-md border-gray-300 focus:ring focus:ring-indigo-200"
            />

            <>
                {templatesIsLoading && (
                    <span>Loading...</span>
                )}
                {searchTemplateIsLoading && (
                    <span>Loading...</span>
                )}
            </>

            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                            Name
                        </th>
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Message
                        </th>
                        
                        <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                            Assigned Channels
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {/* {templatesIsLoading && (
                        <span>Loading...</span>
                    )} */}
                    
                    {!(templatesIsLoading) && (
                        <>
                            {dataArray?.data?.map((template) => (
                                <tr key={template.email}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                        {template.name}
                                    </td>
                                    <td className="font-small text-gray-600">
                                        {template.message}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                        <>
                                            {template?.channels?.map((channel,channel_index) => (
                                                <span 
                                                    key={"channel_"+channel_index}
                                                    className="text-gray-900"
                                                >{channel?.name}<br/></span>
                                            ))}
                                        </>
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        {/* <button onClick={()=>handleOnEditClick(template)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button> */}
                                        <span className="isolate inline-flex rounded-md shadow-sm">
                                            <button
                                                type="button"
                                                onClick={()=>handleOnEditClick(template)}
                                                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=>handleOnAddChanelClick(template)}
                                                className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                            >
                                                Add To Channel
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
        
                            <PaginationButtons 
                                totalItem={templatesData?.totalItem} 
                                totalPages={templatesData?.totalPages}
                                currentPage={templatesData?.currentPage} 
                                onSelected={handlePageChange}
                            />
                        </>
                    )}

                </tbody>
            </table>

            <Transition.Root show={modalShow} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setModalShow}>
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
								<Dialog.Panel className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <form onSubmit={handleUpdateSubmission}>
                                        <div>
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                <AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="my-6 text-center sm:mt-5">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    {modalFor}
                                                </Dialog.Title>
                                            </div>

                                            { modalFor === "Add To Channel" && (
                                                <div className="mt-2">
                                                    <div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                                        
                                                        {!channelListIsLoading && (
                                                            <MultipleSelectMenu label={'Select Channel'} options={channelList} onSelected={setSelectedChannels} setSearchText={setSearchText} isLoading={false} />
                                                        )}
                                                    </div>
                                                    
                                                </div>
                                            ) }

                                            { modalFor === "Edit" && (
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
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                disabled={false}
                                            >
                                                { updateTemplateIsLoading || addToChannelIsLoading ? 'wait..' : 'Update' }

                                            </button>
                                            
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                onClick={() => setModalShow(false)}
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
