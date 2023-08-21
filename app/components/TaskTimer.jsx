"use client"

import React, { useEffect, useState } from 'react';
import {ChevronRightIcon} from "@heroicons/react/20/solid";
import DefaultGravatar from "@/components/DefaultGravatar";
import classNames from "@/utils/classNames";
import {useSelector} from "react-redux";
import Dump from "@/components/Dump";

export default function TaskTimer({ taskId,  active = false, seconds = 0, className }) {
	const agentActiveTaskData = useSelector((state) => state?.agentDashboardProviderData?.agentActiveTask);
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

	const defaultClass = `fixed w-full bg-red-100 top-0 left-0`

	return (
		<div className={classNames( className || defaultClass )}>
			<div className="relative py-5 hover:bg-gray-50">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="mx-auto flex max-w-4xl justify-between gap-x-6">
						<div className="flex gap-x-4">
							<DefaultGravatar className="h-12 w-12 flex-none rounded-full bg-gray-50" />

							<div className="min-w-0 flex-auto">
								<p className="text-sm font-semibold leading-6 text-gray-900">
									<div>
										<span className="absolute inset-x-0 -top-px bottom-0" />
										{agentActiveTaskData?.consumer?.name || 'The Consumer'}
									</div>
								</p>
								<div className="mt-1 flex items-center gap-x-4 text-xs leading-5 text-gray-500">
									<p className="flex items-center gap-x-2 mt-1 text-xs leading-5 text-gray-500">
										<span>Task Id:</span>
										<span className="inline-flex items-center rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
											{ agentActiveTaskData?.threadId }
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-x-4">
							<div className="hidden sm:flex sm:flex-col sm:items-end">
								<p className="text-md leading-6 text-red-900">{formatTime(time + seconds)}</p>
							</div>

							<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
						</div>
					</div>
				</div>
			</div>

		</div>
	);

};