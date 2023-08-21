import React, {useEffect, useState} from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import {debugLog} from "@/utils/helperFunctions";

const TimeRangePickerComponent = ({setHourlyTimeRange}) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);


    useEffect(() => {
        setHourlyTimeRange({
            start:startTime,
            end:endTime
        })
    }, [startTime,endTime]);

    const handleStartTimeChange = (value) => {
        setStartTime(value);
        debugLog('Start Time',value)

    };

    const handleEndTimeChange = (value) => {
        setEndTime(value);
        debugLog('End Time',value)
    };

    return (
        <div className="p-4">
            <h3 className="text-1xl  mb-2">Select Time Range:</h3>
            <div className="flex justify-evenly">
                <div className="mb-4">
                    <span className="text-gray-600">Start Time:</span>
                    <TimePicker
                        value={startTime}
                        onChange={handleStartTimeChange}
                        showSecond={false}
                        format="h:mm A"
                        use12Hours
                        inputReadOnly
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div>
                    <span className="text-gray-600">End Time:</span>
                    <TimePicker
                        value={endTime}
                        onChange={handleEndTimeChange}
                        showSecond={false}
                        format="h:mm A"
                        use12Hours
                        inputReadOnly
                        className="px-2 py-1 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default TimeRangePickerComponent;
