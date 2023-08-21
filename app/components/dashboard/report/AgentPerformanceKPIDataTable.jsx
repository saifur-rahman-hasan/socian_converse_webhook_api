import {FolderIcon, FolderOpenIcon, PlusIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import {formatSeconds} from "@/utils/helperFunctions";

const kpi_data = [
	{
		id:1,
		kpi_metric: 'Response Rate (Wall)',
		weightage: '15%',
		kpi:'L1',
		state:'80',
		l1: '98.50%',
		l2: '98.80%',
		l3: '99.10%',
		l4: '99.40%',
		l5: '99.70%'
	},
	{
		id:2,
		kpi_metric: 'Response Rate in % for all queries',
		weightage: '15%',
		kpi:'L1',
		state:'80',
		l1: '80%',
		l2: '85%',
		l3: '90%',
		l4: '95%',
		l5: '100%'
	},
	{
		id:3,
		kpi_metric: 'Social Baker\'s Response Time (Wall)',
		weightage: '15%',
		kpi:'L4',
		state:'110',
		l1: '13 min',
		l2: '11 min',
		l3: '9 min',
		l4: '7 min',
		l5: '5 min'
	},
	{
		id:4,
		kpi_metric: 'Averagr Response Time',
		weightage: '15%',
		kpi:'L5',
		state:'120',
		l1: '35 min',
		l2: '30 min',
		l3: '25 min',
		l4: '20 min',
		l5: '15 min'
	},
	{
		id:5,
		kpi_metric: 'Service Quality',
		weightage: '10%',
		kpi:'L1',
		state:'80',
		l1: '91%',
		l2: '92%',
		l3: '93%',
		l4: '94%',
		l5: '95%'
	},
	{
		id:6,
		kpi_metric: 'ICE/CSAT (will set the target based on 3 months achievement)',
		weightage: '30%',
		kpi:'L5',
		state:'120',
		l1: 'TBD',
		l2: 'TBD',
		l3: 'TBD',
		l4: 'TBD',
		l5: 'TBD'
	}
]

export default function AgentPerformanceKPIDataTable() {
	return (
		<div className="py-4 my-4">
			<div className="px-6 sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold leading-6 text-gray-900">Agent Performance KPI</h1>
					<p className="mt-2 text-sm text-gray-700">
						All agents' performance KPIs are documented here, encompassing key metrics and indicators that evaluate their efficiency, effectiveness, and customer satisfaction in handling  socian converse.
					</p>
				</div>
			</div>

			<div className="mt-4 flow-root bg-white px-6 shadow">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
									KPI Metric - Robi
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Weightage
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									KPI
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									State
								</th>
								{/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
								{/*	L2*/}
								{/*</th>*/}
								{/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
								{/*	L3*/}
								{/*</th>*/}
								{/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
								{/*	L4*/}
								{/*</th>*/}
								{/*<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">*/}
								{/*	L5*/}
								{/*</th>*/}
							</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 bg-white">
							{kpi_data?.map((activity) => (
								<tr key={activity.id}>
									<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
										{activity.kpi_metric}
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-bold">{activity.weightage}</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.kpi}</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.state}	</td>
									{/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.l1}	</td>*/}
									{/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.l2}</td>*/}
									{/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.l3}</td>*/}
									{/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.l4}</td>*/}
									{/*<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{activity.l5}</td>*/}
								</tr>
							))}
							</tbody>
						</table>
						<div className="px-6 py-8 sm:flex sm:items-end flex justify-end mr-8">

							<p className="mt-2 text-2xl font-medium text-gray-700">
								Total :
							</p>
							<p className="mt-2 text-2xl text-gray-700">
								140%
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
