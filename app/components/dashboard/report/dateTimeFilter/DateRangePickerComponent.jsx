import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {Transition} from "@headlessui/react";
import {ChevronDownIcon,CalendarDaysIcon} from "@heroicons/react/24/solid";
import React, {Fragment, useEffect, useRef, useState} from 'react'
import moment from "moment/moment";
import {saveCurrentDate, savePreviousDate} from "@/store/features/reports/reportsSlice";
import {useDispatch, useSelector} from "react-redux";
import TimeRangePickerComponent from "@/components/dashboard/report/dateTimeFilter/TimeRangePickerComponent";

const DateRangePickerComponent = ({ onSelected }) => {
    const containerRef = useRef(null);

    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [hourlyTimeRange, setHourlyTimeRange] = useState({
        start:null,
        end:null
    })
    const [selectedItemString, setSelectedItemString] = useState("")

    const [selectedDateRange, setSelectedDateRange] = useState({})

    const [selectedDates, setSelectedDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    useEffect(() => {
        convertViewDateTimeFormat(selectedDates)
        convertAndSubmitDateTime(selectedDates)
        dialogOutsideClickEvent()
    }, []);

    async function dialogOutsideClickEvent(){
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }

    const handleSelect = (ranges) => {
        setSelectedDates([ranges.selection]);

        const selectedDateRangeData = {
            from: moment(ranges.selection.startDate).toISOString(),
            to: moment(ranges.selection.endDate).toISOString(),
        }

        setSelectedDateRange(selectedDateRangeData)
        // onSelected(selectedDateRangeData)
    };
    function convertViewDateTimeFormat(selectedDates){
        const startViewFormat = moment(selectedDates[0].startDate).format('MMMM Do YYYY')
        const endViewFormat = moment(selectedDates[0].endDate).format('MMMM Do YYYY ')
        setSelectedItemString(startViewFormat.toString()+' - '+endViewFormat.toString())
    }
    function convertAndSubmitDateTime(selectedDates){


        const startEsFormat = moment(selectedDates[0].startDate).format('YYYY-MM-DD')
        const endEsFormat = moment(selectedDates[0].endDate).format('YYYY-MM-DD')
        let start_time =  startEsFormat.toString()
        let end_time =  endEsFormat.toString()
        if(hourlyTimeRange.start && hourlyTimeRange.end){
            const timeStart = moment(hourlyTimeRange.start).format('HH:mm:ss')
            const timeEnd = moment(hourlyTimeRange.end).format('HH:mm:ss')
            start_time = start_time+"T"+timeStart+".001Z"
            end_time = end_time+"T"+timeEnd+".001Z"
        }else{
            start_time=start_time+"T00:00:01.001Z"
            end_time= end_time+"T23:59:01.001Z"
        }
        
        try{
            onSelected({
                from:start_time,
                to:end_time
            })

        }catch (e) {

        }
        start_time = new Date( new Date(start_time).getTime() - (6 * 60 * 60 * 1000));
        end_time = new Date( new Date(end_time).getTime() - (6 * 60 * 60 * 1000));
        start_time = start_time.toISOString()
        end_time = end_time.toISOString()
        // debugLog("start time",start_time)
        // debugLog("end_time",end_time)

        
        dispatch(saveCurrentDate(start_time))
        dispatch(savePreviousDate(end_time))
    }
    function onApplyClick(){
        convertViewDateTimeFormat(selectedDates)
        convertAndSubmitDateTime(selectedDates)

        setOpen(false)
        // onSelected(selectedDateRange)
    }

    return (
        <div className="w-full py-4" ref={containerRef}>
            <h3 className="text-sm font-medium leading-6 text-gray-900">Select Date Filter</h3>

            <div className={`mt-2`}>
                <button
                    onClick={()=> {setOpen(!open)}}
                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <CalendarDaysIcon className="-mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
                    {selectedItemString}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
            </div>

            <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div className="absolute left z-30 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">

                        <DateRangePicker
                            ranges={selectedDates}
                            onChange={handleSelect}
                        />
                    </div>

                    <TimeRangePickerComponent
                        setHourlyTimeRange={setHourlyTimeRange}
                    />

                    <div className="flex justify-end pr-8 pb-6">
                        <button
                            onClick={()=> {setOpen(false)}}
                            type="button"
                            className="mr-4 rounded bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 shadow-sm hover:bg-indigo-100"
                        >
                            Close
                        </button>

                        <button
                            onClick={()=> {onApplyClick()}}
                            type="button"
                            className="rounded bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default DateRangePickerComponent;
