import { Fragment } from 'react'
import classNames from "../../utils/classNames";
import IconTelegramSvg from "../ui/icons/IconTelegramSvg";
import IconWhatsappSvg from "../ui/icons/IconWhatsappSvg";
import IconFacebookSvg from "../ui/icons/IconFacebookSvg";
import IconYoutubeSvg from "../ui/icons/IconYoutubeSvg";

const integrations = [
	{
		id: 1,
		name: 'Telegram',
		sources: [
			{ id: 1, name: 'Socian Converse Bot', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
			{ id: 2, name: 'Robi Customer Support Bot', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
		],
	},

	{
		id: 2,
		name: 'Whatsapp',
		sources: [
			{ id: 1, name: 'Socian Whatsapp', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
			{ id: 2, name: 'Robi Whatsapp', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
		],
	},
	// More people...
]

export default function MessengerIntegrationsDataTable() {
	return (
		<div className="">
			<div className="sm:flex sm:items-center px-4 sm:px-6 lg:px-8">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Messenger Sources</h1>
					<p className="mt-2 text-sm text-gray-700">
						A list of all the users in your account including their name, title, email and role.
					</p>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						type="button"
						className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add Source
					</button>
				</div>
			</div>
			<div className="mt-8 flow-root">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full">
							<thead className="bg-white">
							<tr>
								<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-8">
									Name
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Title
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Email
								</th>
								<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Role
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
							</thead>
							<tbody className="bg-white">
							{integrations.map((integration) => (
								<Fragment key={integration.name}>
									<tr className="border-t border-gray-200">
										<th
											colSpan={5}
											scope="colgroup"
											className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-8 flex items-center gap-x-4"
										>
											{ integration?.name.toLowerCase() === 'telegram' && <IconTelegramSvg height={40} width={40} /> }
											{ integration?.name.toLowerCase() === 'whatsapp' && <IconWhatsappSvg height={40} width={40} /> }
											{ integration?.name.toLowerCase() === 'facebook' && <IconFacebookSvg height={40} width={40} /> }
											{ integration?.name.toLowerCase() === 'youtube' && <IconYoutubeSvg height={40} width={40} /> }

											<span>{integration.name}</span>
										</th>
									</tr>

									{integration?.sources?.length > 0 && integration.sources.map((source, sourceIdx) => (
										<tr
											key={source.email}
											className={classNames(sourceIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
										>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-20">
												<a href={`/messenger?integrationId=${integration?.id}&sourceId=${source?.id}`} className="text-indigo-600 hover:text-indigo-900">
												{source.name}
												</a>
											</td>

											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{source.title}</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{source.email}</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{source.role}</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
												<a href={`/messenger?integrationId=${integration?.id}&sourceId=${source?.id}`} className="text-indigo-600 hover:text-indigo-900">
													Edit<span className="sr-only">, {source.name}</span>
												</a>
											</td>
										</tr>
									))}
								</Fragment>
							))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
