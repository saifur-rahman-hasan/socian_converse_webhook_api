import Dump from '@/components/Dump';
import React, { useState, Fragment, useRef, useEffect } from 'react';
import {useRouter} from "next/router";
import {useGetTagsQuery,useSearchTagsMutation,useUpdateTagMutation,useGetChannelsQuery,useCreateAddToChannelMutation,useCreateRemoveFromChannelMutation} from "../../../store/features/workspace/WorkspaceAPISlice";
import PaginationButtons from '@/components/ui/table/pagination';
import { Listbox, Dialog, Transition } from '@headlessui/react'
import { AdjustmentsHorizontalIcon,CheckIcon,ChevronUpDownIcon,XCircleIcon } from "@heroicons/react/24/solid";
import MultipleSelectMenu from '@/components/ui/forms/multipleSelectManu';

export default function TagsTable() {
    const router = useRouter()

    const [modalFor, setModalFor] = useState("");
    const [page, setPage] = useState(1);
    const [modalShow, setModalShow] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState();
    const [selectedTagName, setSelectedTagName] = useState();
    const [tagName, setTagName] = useState();
    const [selectedChannel, setSelectedChannels] = useState([])
    const [channelSearchText, setChannelSearchText] = useState("")
    const [tagSearchText, setTagSearchText] = useState("")
    const [searchResult, setSearchResult] = useState()
    const [dataArray, setDataArray] = useState()
    const cancelButtonRef = useRef(null)

    const handlePageChange = (newPage) => {
        setPage(newPage)
    };

    const [updateTag, {
		isLoading: updateTagIsLoading,
		error: updateTagError
	}] = useUpdateTagMutation()

    const handleOnAddChanelClick = (tag) => {
        setModalFor("Add To Channel")
        setSelectedTagId(tag?.id)
        setSelectedTagName(tag?.name)
        setModalShow(true)
    }
    const handleOnEditClick = (tag) => {
        setSelectedTagId(tag?.id);
        setSelectedTagName(tag?.name)
        setTagName(tag?.name);
        setModalFor("Edit")
        setModalShow(true)
    }

    const handleUpdateSubmission = async (e) => {
		e.preventDefault()

        if(modalFor === "Add To Channel"){

            let final_data = []
            for(const channel of selectedChannel){
                const dataObj = {
                    channel_id: channel?.id,
                    channel_name: channel?.name,
                    tag_name: selectedTagName,
                    tag_id: selectedTagId,
                    dataSource: "tag"
                }
                final_data.push(dataObj)
            }
            
            const createdResponse = await addToChannel(final_data)
        }else if(modalFor === "Edit"){

            const updatedWorkspace = await updateTag({
            	id: selectedTagId,
            	name: tagName,
            })
        }
        

        setModalShow(false)
    }

    const {
		data: tagsData,
		isLoading: tagsIsLoading
	} = useGetTagsQuery(page)
    
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
    ] = useCreateAddToChannelMutation();
    
    const [
        removeFromChannel,
        {
            isLoading: removeFromChannelIsLoading,
            error: removeFromChannelError
        }
    ] = useCreateRemoveFromChannelMutation();

    const onChannelRemoveClick = async (e,tag,channel) => {
		e.preventDefault()
        const userConfirmed = window.confirm("Do you want to proceed?");
        if (userConfirmed) {
            
            await removeFromChannel({
                tag_id: tag?.id,
                es_channel_id: channel?.id
            })
        }
    }

    
    const [
        searchTag,
        {
            isLoading: searchTagIsLoading,
            error: searchTagError
        }
    ] = useSearchTagsMutation();

    async function handleTagSearch(){
		const searchResponse = await searchTag({key:tagSearchText,channelId:0})
        setSearchResult(searchResponse?.data?.data)
        setDataArray(searchResponse?.data?.data)
    }
    
    useEffect(() => {
		if(tagSearchText && tagSearchText.length > 2){
			const debounceId = setTimeout(() => {
                handleTagSearch()            
            }, 1000);
    
            return () => {
                clearTimeout(debounceId);
            };
		}
	}, [tagSearchText])


    useEffect(() => {
        setTagSearchText("")
        setDataArray([])
		setDataArray(tagsData)
	}, [tagsIsLoading,page])
    
    return (
        <div className="-mx-4 mt-8 sm:-mx-0">
            <input
                type="text"
                placeholder="Search"
                value={tagSearchText}
                onChange={(e) => setTagSearchText(e.target.value)}
                className="w-sm px-4 py-2 mb-3 rounded-md border-gray-300 focus:ring focus:ring-indigo-200"
            />

            <>
                {tagsIsLoading && (
                    <span>Loading...</span>
                )}
                {searchTagIsLoading && (
                    <span>Loading...</span>
                )}
            </>
            
            <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th scope="col" className="pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                            Name
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
                    
                    {!(tagsIsLoading) && (
                        <>
                            {dataArray?.data.map((tag,index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap pl-4 text-sm font-medium text-gray-900 ">
                                        {tag.name}
                                    </td>
                                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                        <>
                                            {tag?.channels?.map((channel,channel_index) => (
                                                <>
                                                    <span key={"channel_"+channel_index} className="inline-flex items-center gap-x-0.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        {channel?.name}
                                                        <button onClick={(e)=>onChannelRemoveClick(e,tag,channel)} type="button" className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
                                                            <span className="sr-only">Remove</span>
                                                                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
                                                                    <path d="M4 4l6 6m0-6l-6 6" />
                                                                </svg>
                                                            <span className="absolute -inset-1" />
                                                        </button>
                                                    </span>
                                                    <br/>
                                                </>
                                            ))}
                                        </>
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-15 pr-4 text-right text-sm font-medium ">
                                        <span className="isolate inline-flex rounded-md shadow-sm">
                                            <button
                                                type="button"
                                                onClick={()=>handleOnEditClick(tag)}
                                                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={()=>handleOnAddChanelClick(tag)}
                                                className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                                            >
                                                Add To Channel
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            <PaginationButtons
                                totalItem={tagsData?.totalItem} 
                                totalPages={tagsData?.totalPages}
                                currentPage={tagsData?.currentPage} 
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
                                                            <MultipleSelectMenu label={'Select Channel'} options={channelList} onSelected={setSelectedChannels} setSearchText={setChannelSearchText} isLoading={false}  />
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
                                                            value={tagName}
                                                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            onChange={(e) => setTagName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) }
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                disabled={false}
                                            >

                                                { updateTagIsLoading || addToChannelIsLoading ? 'wait..' : 'Update' }
                                                
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
