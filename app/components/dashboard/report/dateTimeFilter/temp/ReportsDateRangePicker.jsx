import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {saveCurrentDate, savePreviousDate} from "@/store/features/reports/reportsSlice";
import {useDispatch, useSelector} from "react-redux";
import TimeOptionsSelection from "@/components/dashboard/report/dateTimeFilter/temp/TimeOptionsSelection";

const ReportsDateRangePicker = () => {
    const dispatch = useDispatch()

    const [startDate, setStartDate] = useState(() => {
        const startTime = new Date();
        startTime.setHours(0, 0, 0, 0)
        return startTime;
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date();
    });

    useEffect(() => {
        dispatch(savePreviousDate(endDate.toISOString()))
    }, [endDate])


    useEffect(() => {
        dispatch(saveCurrentDate(startDate.toISOString()))
    }, [startDate]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    return (
        <div className="relative">
            <div className="flex justify-start items-center px-4 py-4">
                <div className="flex flex-col">
                    <h3 className="ralative text-base font-semibold leading-6 text-gray-900 ">Select Date
                        Filter</h3>
                    <TimeOptionsSelection
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                    <div className="flex justify-start items-center ">
                        <div className="relative">

                            <DatePicker
                                name="start"
                                selected={startDate}
                                onChange={handleStartDateChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsStart
                                placeholderText="Select date start"
                                selectsRange={false}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                        </div>
                        <span className="mx-4 text-gray-500">to</span>
                        <div className="relative">

                            <DatePicker
                                name="end"
                                selected={endDate}
                                onChange={handleEndDateChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsEnd
                                placeholderText="Select date end"
                                selectsRange={false}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsDateRangePicker;
