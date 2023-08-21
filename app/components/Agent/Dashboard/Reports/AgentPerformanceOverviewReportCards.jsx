const stats = [
	{ name: 'Queue Tasks', stat: '15' },
	{ name: 'Avg Response Time', stat: '2 min' },
	{ name: 'Your Performance Rating', stat: '4.2' },
]

export default function AgentPerformanceOverviewReportCards() {
	return (
		<div>
			<h3 className="text-base font-semibold leading-6 text-gray-900">Performance Overview Stats</h3>
			<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
				{stats.map((item) => (
					<div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
						<dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
						<dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
					</div>
				))}
			</dl>
		</div>
	)
}
