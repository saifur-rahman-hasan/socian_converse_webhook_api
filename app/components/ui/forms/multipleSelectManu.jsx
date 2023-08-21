import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from '@/utils/classNames'

export default function MultipleSelectMenu({ label, options, onSelected, setSearchText, isLoading }) {

    const [selected, setSelected] = useState([])
    const [filteredOptions, setFilteredOptions] = useState(options)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        onSelected(selected)
    }, [selected])

    useEffect(() => {
        if(options && options.length > 0){
            const filtered = options?.filter((option) =>
                option.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredOptions(filtered)
        }
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

            { selected?.length > 0 && selected.map(tag => (
                <span
                    key={`thread_tag_id_${tag?.id}`}
                    className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {tag?.name}
                    <button
                        type="button"
                        onClick={()=>handleCancelClick(tag)}
                        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-pink-600/20">
                            <span className="sr-only">Remove</span>
                            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-pink-700/50 group-hover:stroke-pink-700/75">
                            <path d="M4 4l6 6m0-6l-6 6" />
                            </svg>

                            <span className="absolute -inset-1" />
                    </button>
                </span>
            )) }
            
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                {label || 'Select Item'}
            </Listbox.Label>

            <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <span className="block truncate">
                        {/* {selected.length > 0 ? selected.map(item => item.name).join(', ') : label || 'Select Item'} */}
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
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {isLoading && <span className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 loading loading-sm'></span>}
                                    {!(isLoading) && <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    autoComplete='off'
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        {filteredOptions?.length == 0 && searchTerm.length > 0 && (
                            <>
                                <p>Result Not Found.</p>
                            </>
                        )}
                        
                        {filteredOptions?.length == 0 && searchTerm.length == 0 && (
                            <>
                                <p>Ex: "Robi"</p>
                            </>
                        )}
                        {filteredOptions?.length > 0 && filteredOptions?.map((item) => (
                            <Listbox.Option
                                key={`${label}_${item.id}`}
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
