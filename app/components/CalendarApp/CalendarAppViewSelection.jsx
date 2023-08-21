import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {Fragment, useEffect, useState} from "react";
import classNames from "../../utils/classNames";

export default function CalendarAppViewSelection({ onChange }){
	const calenderViews = [
		{
			id: 'day_view',
			name: 'Day View'
		},
		{
			id: 'week_view',
			name: 'Week View'
		},
		{
			id: 'month_view',
			name: 'Month View'
		},
		{
			id: 'year_view',
			name: 'Year View'
		}
	]
	const [selectedView, setSelectedView] = useState(calenderViews[0])

	useEffect(() => {
		onChange(selectedView)
	}, [selectedView])

	return (
		<Menu as="div" className="relative">
			<Menu.Button
				type="button"
				className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				Week view
				<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
			</Menu.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">

						{ calenderViews.length > 0 && calenderViews.map(view => {
							return (
								<Menu.Item key={`calendar_app_view_id_${view.id}`} className={`cursor-pointer`}>
									{({ active }) => (
										<div
											className={classNames(
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
												'block px-4 py-2 text-sm'
											)}
											onClick={e => setSelectedView(view)}
										>
											{view.name}
										</div>
									)}
								</Menu.Item>
							)
						})}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}