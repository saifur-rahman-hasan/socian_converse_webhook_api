import {Fragment, useRef, useState} from "react";
import {AdjustmentsHorizontalIcon, PlusIcon} from "@heroicons/react/20/solid";
import MultipleSelectMenu from "@/components/ui/forms/multipleSelectManu";
import { useGetTagsQuery,useUpdateClosingTagsMutation } from "@/store/features/workspace/WorkspaceAPISlice";
import Dump from "@/components/Dump";
import { Dialog, Transition } from "@headlessui/react";
import MultipleTagSelect from "@/components/tag/MultipleTagSelect";

export default function ConversationThreadPreviewTags({ closingTags }) {
    const cancelButtonRef = useRef(null)

    const [tags, setTags] = useState(closingTags || [])
    const [canCreateTag, setCanCreateTag] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState();
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const [
        updateClosingTags,
        {
            isLoading: updateClosingTagsIsLoading,
            error: updateClosingTagsError
        }
    ] = useUpdateClosingTagsMutation();

    const handleUpdateSubmission = async (e) => {
		e.preventDefault()
        await updateClosingTags(selectedTags)

        console.log("selectedTags@@@@@#####");
        console.log("selectedTags@@@@@#####");
        console.log("selectedTags@@@@@#####");
        console.log("selectedTags@@@@@#####");
        
        setIsModalOpen(false)
    }

    return (
        <div>
            <div className={`flex items-center justify-between`}>
                <h2 className="text-sm font-medium text-gray-500">Tags</h2>

                <button onClick={openModal}>
                    <PlusIcon className={`w-4 h-4 text-gray-500`} />
                </button>
            </div>
            <ul role="list" className="mt-2 leading-8">
                {tags.map(tag => (
                    <li
                        key={`task_tags_${tag.id}`}
                        className="inline">
						<span
                            className="relative inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
							<div className="absolute flex flex-shrink-0 items-center justify-center">
								<span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
							</div>
							<div className="ml-3 text-xs font-semibold text-gray-900">{tag?.name}</div>
						</span>{' '}
                    </li>
                ))}

            </ul>
            
            <Transition.Root show={isModalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsModalOpen}>
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
                                                    Select Tags
                                                </Dialog.Title>
                                            </div>
                                            
                                                <div className="mt-2">
                                                    <div className="rounded-md mb-4 px-3 pt-2.5 pb-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                                        <MultipleTagSelect onSelected={setSelectedTags} channelId={""}/>
                                                    </div>
                                                    
                                                </div>
                                            
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                            
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                                disabled={false}
                                            >

                                                { 'Add' }
                                                
                                            </button>
                                            
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                                onClick={() => setIsModalOpen(false)}
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
    );
}



const DEMO_TAGS = [
    {
        id: 1,
        name: 'Mobile Network',
        color: 'red'
    },
    {
        id: 2,
        name: 'Internet Service',
        color: 'orange'
    },
    {
        id: 2,
        name: '4G SIM',
        color: 'green'
    }
]