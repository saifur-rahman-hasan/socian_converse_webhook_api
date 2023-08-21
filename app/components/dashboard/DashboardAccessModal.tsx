import {Fragment, useEffect, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import { RadioGroup } from '@headlessui/react'
import classNames from "@/utils/classNames";
import useDashboardSlice from "@/hooks/useDashboardSlice";
import {useDispatch} from "react-redux";
import {activateUserCurrentDashboard} from "@/store/features/dashboard/DashboardSlice";
import {throwIf} from "@/lib/ErrorHandler";



export default function DashboardAccessModal() {
	const { currentDashboard } = useDashboardSlice()
	const dispatch = useDispatch()

	const [selected, setSelected] = useState(null)

	const [open, setOpen] = useState(false)
	const cancelButtonRef = useRef(null)

	useEffect(() => {
		if(currentDashboard?.id && currentDashboard?.current == true){
			setSelected(currentDashboard)
			setOpen(false)
		}else{
			setOpen(true)
		}
	}, [currentDashboard])

	function handleContinueToDashboard() {
		try {

			throwIf(!selected?.id, new Error("Please select your dashboard to get access."))
			dispatch( activateUserCurrentDashboard(selected))

		}catch (e) {
			alert("Error")
		}
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-900 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
											<ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
										</div>
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
												Select your dashboard
											</Dialog.Title>

											<div>
												Based on your account role your can now access to any of your dashboard.
											</div>
										</div>
									</div>
								</div>

								<div className={`p-4`}>
									<UserDashboardAccessList
										selected={selected}
										setSelected={setSelected}
									/>
								</div>

								<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-4">
									{
										!selected?.id ? (
											<button
												type="button"
												className="inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
												disabled={true}
											>
												Continue
											</button>
										) : (
											<button
												type="button"
												className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
												onClick={handleContinueToDashboard}
											>
												Continue
											</button>
										)
									}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export function UserDashboardAccessList({ selected, setSelected }) {
	const { userDashboard, currentDashboard } = useDashboardSlice()

	return (
		<RadioGroup value={selected} onChange={setSelected}>
			<RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
			<div className="-space-y-px rounded-md bg-white">
				{userDashboard.map((dashboard, indx) => (
					<RadioGroup.Option
						key={dashboard.name}
						value={dashboard}
						className={({ checked }) =>
							classNames(
								indx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
								indx === userDashboard.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
								checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200',
								'relative flex cursor-pointer border p-4 focus:outline-none'
							)
						}
					>
						{({ active, checked }) => (
							<>
				                <span
					                className={classNames(
						                checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
						                active ? 'ring-2 ring-offset-2 ring-indigo-600' : '',
						                'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center'
					                )}
					                aria-hidden="true"
				                >
				                  <span className="rounded-full bg-white w-1.5 h-1.5" />
				                </span>
									<span className="ml-3 flex flex-col">
				                  <RadioGroup.Label
					                  as="span"
					                  className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
				                  >
				                    {dashboard.name}
				                  </RadioGroup.Label>
				                  <RadioGroup.Description
					                  as="span"
					                  className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
				                  >
				                    {dashboard?.description}
				                  </RadioGroup.Description>
				                </span>
							</>
						)}
					</RadioGroup.Option>
				))}
			</div>
		</RadioGroup>
	)
}
