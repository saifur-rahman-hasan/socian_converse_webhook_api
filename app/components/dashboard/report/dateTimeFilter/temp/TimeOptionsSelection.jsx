import React, { useState } from 'react';
import TimeOptionsSelectionOption from "@/components/dashboard/report/dateTimeFilter/temp/TimeOptionsSelectionOption";
const TimeOptionsSelection = ( {setStartDate,setEndDate}) => {
    const [selectedTimeOption, setSelectedTimeOption] = useState('today');

    const handleTimeOptionSelect = (value) => {
        setSelectedTimeOption(value);
        const { startTime, endTime } = calculateTimeRange(value);
        // Here, you can use startTime and endTime for your Elasticsearch query
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);
        setStartDate(startTime)
        setEndDate(endTime)
    };

    // Function to calculate the time range based on the selected option
    const calculateTimeRange = (value) => {
        const now = new Date();
        let startTime, endTime;

        switch (value) {
            case 'today':
                startTime = new Date(now);
                startTime.setHours(0, 0, 0, 0);
                endTime = new Date(now);
                break;
            case 'yesterday':
                startTime = new Date(currentDate);
                startTime.setDate(currentDate.getDate() - 1);
                startTime.setHours(0, 0, 0, 0).toISOString();
                break;
            case 'this_week':
                startTime = new Date(now);
                startTime.setHours(0, 0, 0, 0);
                startTime.setDate(now.getDate() - now.getDay()); // Start of the current week (Sunday)
                endTime = new Date(now);
                break;
            case 'last_15_minutes':
                startTime = new Date(now);
                startTime.setMinutes(now.getMinutes() - 15);
                endTime = new Date(now);
                break;
            case 'last_30_minutes':
                startTime = new Date(now);
                startTime.setMinutes(now.getMinutes() - 30);
                endTime = new Date(now);
                break;
            case 'last_1_hour':
                startTime = new Date(now);
                startTime.setHours(now.getHours() - 1);
                endTime = new Date(now);
                break;
            case 'last_24_hours':
                startTime = new Date(now);
                startTime.setDate(now.getDate() - 1);
                endTime = new Date(now);
                break;
            case 'last_7_days':
                startTime = new Date(now);
                startTime.setDate(now.getDate() - 7);
                endTime = new Date(now);
                break;
            case 'last_30_days':
                startTime = new Date(now);
                startTime.setDate(now.getDate() - 30);
                endTime = new Date(now);
                break;
            case 'last_90_days':
                startTime = new Date(now);
                startTime.setDate(now.getDate() - 90);
                endTime = new Date(now);
                break;
            case 'last_1_year':
                startTime = new Date(now);
                startTime.setFullYear(now.getFullYear() - 1);
                endTime = new Date(now);
                break;
            default:
                break;
        }

        // Elasticsearch query typically requires timestamps in ISO8601 format
        const startTimeISO = startTime.toISOString();
        const endTimeISO = endTime.toISOString();

        return { startTime: startTime, endTime: endTime };
        // return { startTime: startTimeISO, endTime: endTimeISO };
    };

    return (
        <div className="container mx-auto p-2">
            {/*<h1 className="text-2xl font-bold mb-4">Time Options Selection</h1>*/}
            <TimeOptionsSelectionOption selectedOption={selectedTimeOption} onSelect={handleTimeOptionSelect} />
        </div>
    );
};

export default TimeOptionsSelection;