import {useEffect, useState} from "react";

export default function TimerCountUp({ seconds = 0 }) {
	const [time, setTime] = useState(0);

	useEffect(() => {
		// This function will be called every second to update the timer
		const updateTimer = () => {
			setTime((prevTime) => prevTime + 1);
		};

		const intervalId = setInterval(updateTimer, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	// Convert total seconds to HH:mm:ss format
	const formatTime = (totalSeconds) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	};

	return formatTime(time + seconds);
}