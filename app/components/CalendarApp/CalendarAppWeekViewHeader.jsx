export default function CalendarAppWeekViewHeader(){
	return (
		<div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
			<div className="col-end-1 w-14" />
			<div className="flex items-center justify-center py-3">
                <span>
                  Mon <span className="items-center justify-center font-semibold text-gray-900">10</span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span>
                  Tue <span className="items-center justify-center font-semibold text-gray-900">11</span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span className="flex items-baseline">
                  Wed{' '}
	                <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    12
                  </span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span>
                  Thu <span className="items-center justify-center font-semibold text-gray-900">13</span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span>
                  Fri <span className="items-center justify-center font-semibold text-gray-900">14</span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span>
                  Sat <span className="items-center justify-center font-semibold text-gray-900">15</span>
                </span>
			</div>
			<div className="flex items-center justify-center py-3">
                <span>
                  Sun <span className="items-center justify-center font-semibold text-gray-900">16</span>
                </span>
			</div>
		</div>
	)
}