import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from '@/utils/classNames'
import {getCurrentTimestamp} from "@/utils/helperFunctions";

function SelectedItemsPreviewContent({ selected }) {
    return (
        <div>
            { selected?.length > 0 && selected.map(item => (
                <span
                    key={`thread_tag_id_${item?.id}`}
                    className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {item?.name}
                    <button
                        type="button"
                        onClick={()=>handleCancelClick(item)}
                        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-pink-600/20">
                            <span className="sr-only">Remove</span>
                            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-pink-700/50 group-hover:stroke-pink-700/75">
                            <path d="M4 4l6 6m0-6l-6 6" />
                            </svg>

                            <span className="absolute -inset-1" />
                    </button>
                </span>
            )) }
        </div>
    );

}

export default function MultipleSelectMenu({
    id,
    label,
    options,
    onSelected,
    displaySelectedPreviewContent = true,
    setSearchText
}) {

    const [selected, setSelected] = useState([])
    const [filteredOptions, setFilteredOptions] = useState(options)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        onSelected(selected)
    }, [selected])

    useEffect(() => {
        const filtered = options.filter((option) =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredOptions(filtered)        
        setSearchText(searchTerm)
    }, [searchTerm, options])

    async function  handleCancelClick(tag){
		const updatedObjects = selected.filter((obj) => obj.id !== tag.id);
		setSelected(updatedObjects);
	}

    return (
        <Listbox onChange={setSelected} multiple>
        {({ open }) => (
            <>

                { displaySelectedPreviewContent && (<SelectedItemsPreviewContent selected={selected} />)}

                { label &&  (
                    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                        {label || 'Select Item'}
                    </Listbox.Label>
                )}

            <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="block truncate">
                    {'Select Item'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
                </Listbox.Button>

                <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div className="relative">
                        <label htmlFor="search" className="sr-only">
                            Search
                        </label>
                        <div className="relative p-2 flex items-center gap-x-4">
                            <div className="absolute inset-y-0 left-0 ml-5 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full p-2 pl-9 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {filteredOptions.map((item) => (
                    <Listbox.Option
                        key={`${id}_${label}_${item.id}}`}
                        className={({ active }) =>
                        classNames(
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                        }
                        value={item}
                    >
                        {({ selected, active }) => (
                        <>
                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                {item.name}
                            </span>

                            {selected ? (
                                <span
                                    className={classNames(
                                    active ? 'text-white' : 'text-indigo-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}
                                >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            ) : null}
                        </>
                        )}
                    </Listbox.Option>
                    ))}
                </Listbox.Options>
                </Transition>
            </div>
            </>
        )}
        </Listbox>
    )
}
