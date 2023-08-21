import InstagramMessengerConnectForm from "@/components/Integrations/InstagramMessengerConnectForm";
import MessengerConnectForm from "@/components/Integrations/MessengerConnectForm";
import FacebookPageConnectForm from "@/components/Integrations/FacebookPageConnectForm";
import TelegramConnectForm from "@/components/Integrations/TelegramConnectForm";
import NoSSRWrapper from "@/components/global/NoSSRWrapper";
import SideOverWideEmpty from "@/components/ui/SideOvers/SideOverWideEmpty";
import IconFacebookSvg from "@/components/ui/icons/IconFacebookSvg";
import IconInstagramSvg from "@/components/ui/icons/IconInstagramSvg";
import IconMessengerSvg from "@/components/ui/icons/IconMessengerSvg";
import IconTelegramSvg from "@/components/ui/icons/IconTelegramSvg";
import IconWhatsappSvg from "@/components/ui/icons/IconWhatsappSvg";
import IconYoutubeSvg from "@/components/ui/icons/IconYoutubeSvg";
import { useGetWorkspaceByIdQuery } from "@/store/features/workspace/WorkspaceAPISlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import ConnectWithYoutube from "../Integrations/ConnectWithYoutube";
import IconChatBotSvg from "@/components/ui/icons/IconChatbotSvg";
import ConnectWithOtherConnection from "@/components/Integrations/ConnectWithOtherConnection";
import ConnectWithFacebook from "@/components/Integrations/ConnectWithFacebook";
import ConnectWithMessenger from "@/components/Integrations/ConnectWithMessenger";
import OtherConnectionConnectForm from "@/components/Integrations/OtherConnectionConnectForm";

const solutions = [
	{
		id: 'telegram',
		name: 'Telegram',
		description: 'Integrate your business account on Socian Converse and engage with your audience on Telegram using both human and AI bot support. Effectively manage customer responses on demand.',
		href: '#',
		icon: IconTelegramSvg
	},
	{
		id: 'messenger',
		name: 'Messenger',
		description: 'Connect your business account on Socian Converse and interact with your audience on messaging platforms. Utilize powerful human and AI bot support for managing customer conversations.',
		href: '#',
		icon: IconMessengerSvg,
	},
	{
		id: 'instagram_messenger',
		name: 'Instagram Messenger',
		description: 'Directly communicate with your customers on Instagram through Socian Converse. Leverage human and AI bot support to efficiently manage customer interactions and responses.',
		href: '#',
		icon: IconInstagramSvg,
	},
	{
		id: 'whatsapp_messenger',
		name: 'Whatsapp Messenger',
		description: 'Build strategic sales funnels and manage your audience interactions on WhatsApp using Socian Converse. Benefit from both human and AI bot support for effective customer engagement.',
		href: '#',
		icon: IconWhatsappSvg
	},
	{
		id: 'facebook_page',
		name: 'Facebook Page',
		description: 'Securely integrate your business account on Socian Converse and efficiently manage customer interactions on your Facebook page. Utilize human and AI bot support to respond to your audience on demand.',
		href: '#',
		icon: IconFacebookSvg
	},
	{
		id: 'youtube_channel',
		name: 'Youtube Channel',
		description: 'Manage your YouTube channel effectively with Socian Converse. Leverage human and AI bot support to engage with your audience and efficiently handle customer inquiries.',
		href: '#',
		icon: IconYoutubeSvg,
	},
	// {
	// 	id: 'other',
	// 	name: 'Other Connection',
	// 	description: 'Utilize Socian Converse\'s Other Webhook Channel for instant responses, personalized recommendations, and seamless customer support on messaging platforms. Optimize business processes with advanced features and analytics, ensuring a satisfying user experience and driving loyalty.',
	// 	href: '#',
	// 	icon: IconChatBotSvg,
	// },
];

export default function WorkspaceChannelIntegrationsFlyoutApp({ title }) {
	const route = useRouter()
	const { workspaceId } = route.query

	const {
		data: workspaceData,
		isLoading: workspaceDataIsLoading,
	} = useGetWorkspaceByIdQuery(workspaceId, { skip: !workspaceId })

	const [selectedChannel, setSelectedChannel] = useState(null)
	const [openSideOver, setOpenSideOver] = useState(false)

	useEffect(() => {
		setOpenSideOver(!!selectedChannel?.id)
	}, [selectedChannel])

	return (
		<NoSSRWrapper>
			<div className={`bg-white`}>
				<div className={`p-8`}>
					<h3 className="text-base font-semibold leading-6 text-gray-900">Your Channel Integrations</h3>
					<p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your integration for this workspace</p>
				</div>

				<div className="w-full mx-auto flex-auto overflow-hidden text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
					<div className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
						{solutions.map((item) => (
							<div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
								<div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
									<item.icon className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
								</div>
								<div>
									<div
										className="font-semibold text-gray-900 cursor-pointer"
										onClick={() => setSelectedChannel(item)}
									>
										{item.name}
										<span className="absolute inset-0" />
									</div>
									<p className="mt-1 text-gray-600">{item.description}</p>
								</div>
							</div>
						))}
					</div>

					<div className="bg-gray-50 px-8 py-6">
						<div className="flex items-center gap-x-3">
							<h3 className="text-sm font-semibold leading-6 text-gray-900">Enterprise</h3>
							<p className="rounded-full bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">New</p>
						</div>
						<p className="mt-2 text-sm leading-6 text-gray-600">
							Empower your entire team with even more advanced tools.
						</p>
					</div>
				</div>

				{
					!workspaceDataIsLoading && workspaceData?.id && selectedChannel?.id && (
						<SideOverWideEmpty
							open={openSideOver}
							setOpen={setOpenSideOver}
							title={`${selectedChannel.name} Business Account`}
						>
							{ selectedChannel.id === 'telegram' && (
								<TelegramConnectForm workspace={workspaceData} />
							)}

							{ selectedChannel.id === 'messenger' && (
								<div>
									<ConnectWithMessenger workspace={workspaceData} />
									<ConnectWithOtherConnection workspace={workspaceData} />
								</div>
							)}

							{ selectedChannel.id === 'facebook_page' && (
								<ConnectWithFacebook workspace={workspaceData} />
							)}

							{ selectedChannel.id === 'instagram_messenger' && (
								<InstagramMessengerConnectForm workspace={workspaceData} />
							)}
							
							{ selectedChannel.id === 'youtube_channel' && (
								<ConnectWithYoutube workspace={workspaceData} />
							)}

							{ selectedChannel.id === 'other' && (
								<ConnectWithOtherConnection workspace={workspaceData} />
							)}

						</SideOverWideEmpty>
					)}

			</div>
		</NoSSRWrapper>
	)
}
