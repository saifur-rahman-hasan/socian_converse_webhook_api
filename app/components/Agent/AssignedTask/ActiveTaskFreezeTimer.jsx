import React, { useState, useEffect } from "react";
import moment from "moment";

const ActiveTaskFreezeTimer = ({ countdownTime = 5 }) => {
	const [timeLeft, setTimeLeft] = useState(countdownTime * 60); // countdown time in seconds

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, [timeLeft]);

	useEffect(() => {
		if (timeLeft === 0) {
			window.location.reload();
		}
	}, [timeLeft]);

	const formattedTime = moment.utc(timeLeft * 1000).format("mm:ss");

	return <span>{formattedTime}</span>;
};

export default ActiveTaskFreezeTimer;
