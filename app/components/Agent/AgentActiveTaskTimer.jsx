"use client"

import React, { useEffect, useState } from 'react';
import {ChevronRightIcon, PauseIcon, PlayIcon, StopIcon} from "@heroicons/react/20/solid";
import DefaultGravatar from "@/components/DefaultGravatar";
import classNames from "@/utils/classNames";
import {useDispatch, useSelector} from "react-redux";
import Dump from "@/components/Dump";
import TimerCountUp from "@/components/Timers/TimerCountUp";
import {useStopAgentActiveTaskMutation} from "@/store/features/agentDashboard/AgentDashboardApiSlice";
import {deActivateAgentActiveTask, updateAgentActiveTask} from "@/store/features/agentDashboard/AgentDashboardSlice";



export default function AgentActiveTaskTimer({ agentActiveTask, className }) {
	const defaultClass = `fixed w-full bg-red-100 top-0 left-0`

	if(agentActiveTask?.status !== 'start'){
		return null
	}

	return (
		<div className={classNames( className || defaultClass )}>
			<div className="relative py-5 hover:bg-gray-100">
				<div className="px-4 sm:px-6 lg:px-8">

					<div className="mx-auto flex max-w-4xl justify-between gap-x-6" >
						<div className="flex gap-x-4">
							<DefaultGravatar
								className="h-12 w-12 flex-none rounded-full bg-gray-50"

							/>

							<div className="flex-auto">
								<div className="text-sm font-semibold leading-6 text-gray-900">
									<div>
										<span className="absolute inset-x-0 -top-px bottom-0" />
										{agentActiveTask?.consumer?.name || 'The Consumer'}
									</div>
								</div>

								<div className="mt-1 flex items-center gap-x-4 text-xs text-gray-500 border-red-500">
									<div className="flex items-center gap-x-2 mt-1 text-xs leading-5 text-gray-500">
										<span>Task Id:</span>
										<span className="inline-flex items-center rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
											{ agentActiveTask?.threadId }
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-x-4 z-20">
							<div className="sm:flex sm:flex-col sm:items-end">
								<div className="text-md leading-6 text-red-900">

									<TimerCountUp seconds={agentActiveTask?.duration || 0} />

								</div>

								<TimerController activeTask={agentActiveTask}/>
							</div>

							<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
						</div>
					</div>

				</div>
			</div>

		</div>
	);
};

function TimerController({activeTask }) {
	const dispatch = useDispatch()

	const [status, setStatus] = useState('start')

	const [
		stopAgentActiveTask,
		{idLoading: stoppingAgentActiveTask, data: stoppedTasksData}
	] = useStopAgentActiveTaskMutation()

	const [
		pauseAgentActiveTask,
		{idLoading: pauseAgentActiveTaskIsLoading, data: pausedActiveTask}
	] = useStopAgentActiveTaskMutation()

	function handleTimerStop() {
		const { workspaceId, agentId, taskDocId } = activeTask
		stopAgentActiveTask({ workspaceId, agentId, taskDocId })
		dispatch(deActivateAgentActiveTask())
		setStatus('stop')
	}

	function handleTimerStart() {
		alert('Timer Start coming soon')
	}

	function handleTimerPause() {
		const { workspaceId, agentId, taskDocId } = activeTask
		pauseAgentActiveTask({ workspaceId, agentId, taskDocId })
		dispatch(updateAgentActiveTask({
			loading: false,
			error: null,
			loaded: true,
			enabled: true,
			data: {
				...activeTask,
				status: 'pause'
			}
		}))
		setStatus('pause')
	}

	return (
		<div className={`inline-flex items-center gap-x-x-4 z-20`}>

			{ stoppingAgentActiveTask || pauseAgentActiveTaskIsLoading && 'wait...' }

			{ status === 'start' && (
				<>
					<button onClick={handleTimerPause}>
						<PauseIcon className={`w-4 h-4 text-red-500 cursor-pointer`} />
					</button>

					<button onClick={handleTimerStop}>
						<StopIcon className={`w-4 h-4 text-red-500`} />
					</button>
				</>
			)}

			{ status === 'pause' && (
				<>
					<button onClick={handleTimerStart}>
						<PlayIcon className={`w-4 h-4 text-red-500 cursor-pointer`} />
					</button>

					<button onClick={handleTimerStop}>
						<StopIcon className={`w-4 h-4 text-red-500`} />
					</button>
				</>
			)}

			{ status === 'stop' && (
				<>
					<button onClick={handleTimerStart}>
						<PlayIcon className={`w-4 h-4 text-red-500 cursor-pointer`} />
					</button>
				</>
			)}

		</div>
	);
}