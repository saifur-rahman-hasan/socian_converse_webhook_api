import IntegrationOverviewCard from "./IntegrationOverviewCard";

export default function IntegrationsOverviewCards({ channels }){
	if(!channels?.length){
		return null
	}

	return (
		<div className="mx-auto px-4">
			<h2 className="text-lg font-medium leading-6 text-gray-900">Overview</h2>
			<div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{/* Card */}
				{channels.map((channel) => (
					<IntegrationOverviewCard
						key={`channel_card_${channel.id}`}
						channel={channel}
					/>
				))}
			</div>
		</div>
	)
}

