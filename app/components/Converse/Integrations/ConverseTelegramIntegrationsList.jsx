import Link from "next/link";
import collect from "collect.js";
import Dump from "../../Dump";
import {useRouter} from "next/router";


export default function ConverseTelegramIntegrationsList({ channels }) {
	const router = useRouter()
	const { workspaceId } = router?.query

	const telegramChannels = collect(channels).where('integrationId', 'telegram').toArray()

	return (
		<div className="">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-base font-semibold leading-6 text-gray-900">Telegram Channels</h1>
					<p className="mt-2 text-sm text-gray-700">
						A list of all the telegram channels in your account including their name, title, email and role.
					</p>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">

				</div>
			</div>

			<div className="mt-8 flow-root">
				<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
							<table className="min-w-full divide-y divide-gray-300">
								<thead className="bg-gray-50">
								<tr>
									<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
										Name
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Source
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Status
									</th>
									<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
										Last Update
									</th>
									<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
										<span className="sr-only">Action</span>
									</th>
								</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
								{telegramChannels?.length < 1 && (
									<tr>
										<td colSpan={5} className={`bg-red-50 text-red-600 text-center whitespace-nowrap px-3 py-4 text-sm text-gray-500`}>You have not added any channel yet.</td>
									</tr>
								)}

								{telegramChannels.map((channel) => (
									<tr key={`telegram_channel_${channel?._id}`}>
										<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
											{ channel?.sourceId }
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{channel?.integrationId}</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{channel?.active}</td>
										<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{channel?.updated_at}</td>
										<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
											<Link
												href={`/workspaces/${channel?.workspaceId}/converse/channels/${channel?.integrationId}/${channel?.sourceId}`}
												className="text-indigo-600 hover:text-indigo-900">
												Access Chanel <span className="sr-only">, {channel.sourceId}</span>
											</Link>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
