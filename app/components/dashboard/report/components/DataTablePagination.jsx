import React, {useEffect, useState} from 'react';
import {ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid';
import {Menu, Transition} from "@headlessui/react";
import {Fragment} from 'react'
import classNames from "@/utils/classNames";

const DataTablePagination = ({handlePaginationClick, size,paginationSize}) => {
    const items = [5, 10, 50, 100]; // Array of items

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationPerPage, setPaginationPerPage] = useState(10)

    const [paginationPages, setPaginationPages] = useState(1)
    const [totalSize, setTotalSize] = useState(0)
    useEffect(() => {
        if(paginationSize){
            setPaginationPerPage(paginationSize)
        }

    }, [paginationSize]);
   useEffect(() => {
       if (currentPage!==0){}
        handlePaginationClick({currentPage: currentPage, paginationPerPage: paginationPerPage})
    }, [currentPage, paginationPerPage]);

    useEffect(() => {
        setPaginationPages(Math.ceil(size / paginationPerPage))
        setTotalSize(size)
    }, [size]);

    useEffect(() => {
        setPaginationPages(Math.ceil(totalSize / paginationPerPage))
        setCurrentPage(1)
    }, [paginationPerPage]);

    function handleSizeOptionClick(item) {
        setPaginationPerPage(item);
    }

    function handleNextPage() {
        if (currentPage < paginationPages) {
            setCurrentPage((prevPage) => prevPage + 1)
        }
    }

    function handlePrevPage() {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1)
        }
    }

    return (
        <div>
            <div className="border-t border-gray-200 bg-white px-4 py-3">
                <nav className="grid grid-cols-12 gap-y-3 sm:grid-cols-12 sm:gap-x-4"
                     aria-label="Pagination">
                    <div className="col-span-2 flex justify-center items-center">
                        <p className="text-sm text-gray-700">
                            Showing <span
                            className="font-medium">{(currentPage * paginationPerPage) - (paginationPerPage - 1)}</span> to <span
                            className="font-medium">{currentPage * paginationPerPage}</span> of{' '}
                            <span className="font-medium">{totalSize}</span> results
                        </p>
                    </div>

                    <div className="col-span-2">
                        <Menu as="div" className="">
                            <div>
                                <Menu.Button
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Total Per Page
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    className="absolute left z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {items.map((item) => (
                                            <Menu.Item key={item}>
                                                {({active}) => (
                                                    <button
                                                        className={classNames(
                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                            'block px-4 py-2 text-sm w-full text-left'
                                                        )}
                                                        onClick={() => handleSizeOptionClick(item)}
                                                    >
                                                        {item}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>

                    {/* Previous Button */}
                    <div className="col-span-1 flex justify-end">
                        <button
                            onClick={() => handlePrevPage()}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                    </div>
                    {/* Page Buttons */}
                    <div className="col-span-6 overflow-auto flex">
                        {paginationPages>0 && Array.from({length: paginationPages}, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        pageNumber === currentPage
                                            ? 'bg-indigo-600 text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <div className="col-span-1 flex justify-start">
                        <button
                            onClick={() => handleNextPage()}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                        </button>
                        
                    </div>
                </nav>
            </div>
        </div>
    )
}
export default DataTablePagination;
