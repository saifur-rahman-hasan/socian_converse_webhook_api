import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function PaginationButtons({ totalItem, totalPages, currentPage,  onSelected }) {
    
    const [selected, setSelected] = useState(currentPage)
    const handlePageClick = (page) => {
        setSelected(page);
        onSelected(page);
    };

    const renderPageLinks = () => {
        const links = [];
        const maxVisibleLinks = 10;

        if (totalPages <= maxVisibleLinks) {
            for (let i = 1; i <= totalPages; i++) {
                links.push(
                    <a
                        key={i}
                        onClick={() => handlePageClick(i)}
                        className={`relative inline-flex items-center cursor-pointer ${
                            selected === i
                                ? 'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        } px-4 py-2 text-sm font-semibold`}
                    >
                        {i}
                    </a>
                );
            }
        } else {
            const startPage = Math.max(1, selected - Math.floor(maxVisibleLinks / 2));
            const endPage = Math.min(totalPages, startPage + maxVisibleLinks - 1);

            if (startPage > 1) {
                links.push(
                    <span
                        key="ellipsis-start"
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                        ...
                    </span>
                );
            }

            for (let i = startPage; i <= endPage; i++) {
                links.push(
                    <a
                        key={i}
                        onClick={() => handlePageClick(i)}
                        className={`relative inline-flex items-center cursor-pointer ${
                            selected === i
                                ? 'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        } px-4 py-2 text-sm font-semibold`}
                    >
                        {i}
                    </a>
                );
            }

            if (endPage < totalPages) {
                links.push(
                    <span
                        key="ellipsis-end"
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                        ...
                    </span>
                );
            }
        }

        // Add ChevronLeftIcon at the start
        links.unshift(
            <a
                key="prev"
                onClick={() => handlePageClick(Math.max(1, selected - 1))}
                className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
        );

        // Add ChevronRightIcon at the end
        links.push(
            <a
                key="next"
                onClick={() => handlePageClick(Math.min(totalPages, selected + 1))}
                className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
        );
        return links;
    };
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Total: {totalItem}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex text-right -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {renderPageLinks()}
                    </nav>
                </div>
            </div>
        </div>
    )
}
