import React from 'react';

const timeOptions = [
    { label: 'Last 15 minutes', value: 'last_15_minutes' },
    { label: 'Last 30 minutes', value: 'last_30_minutes' },
    { label: 'Last 1 hour', value: 'last_1_hour' },
    { label: 'Today', value: 'today' },
    { label: 'Last 24 hours', value: 'last_24_hours' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This week', value: 'this_week' },
    { label: 'Last 7 days', value: 'last_7_days' },
    { label: 'Last 30 days', value: 'last_30_days' },
    { label: 'Last 90 days', value: 'last_90_days' },
    { label: 'Last 1 year', value: 'last_1_year' },
];

const TimeOptionsSelectionOption = ({ selectedOption, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelect(option.value)}
                    className={`px-4 py-1 rounded-full ${
                        selectedOption === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default TimeOptionsSelectionOption;
