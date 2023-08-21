import React, { useState, useEffect } from 'react';

const TimerClock = ({ startTime }) => {
	const [currentTime, setCurrentTime] = useState(calculateTimeDifference(startTime));

	useEffect(() => {
		const timerInterval = setInterval(() => {
			setCurrentTime(calculateTimeDifference(startTime));
		}, 1000);

		return () => clearInterval(timerInterval);
	}, [startTime]);

	return <div>{formatTime(currentTime)}</div>;
};

// Helper function to calculate time difference
const calculateTimeDifference = (startTime) => {
	const startDate = new Date(startTime);
	const now = new Date();
	const timeDifference = now - startDate;
	return timeDifference;
};

// Helper function to format time in HH:mm:ss
const formatTime = (time) => {
	const hours = Math.floor(time / (1000 * 60 * 60)).toString().padStart(2, '0');
	const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
	const seconds = Math.floor((time % (1000 * 60)) / 1000).toString().padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
};

export default TimerClock;
