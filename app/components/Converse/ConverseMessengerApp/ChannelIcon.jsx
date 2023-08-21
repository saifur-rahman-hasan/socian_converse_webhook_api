import IconWhatsappSvg from "@/components/ui/icons/IconWhatsappSvg";
import IconMessengerSvg from "@/components/ui/icons/IconMessengerSvg";
import IconFacebookSvg from "@/components/ui/icons/IconFacebookSvg";
import IconTelegramSvg from "@/components/ui/icons/IconTelegramSvg";
import IconInstagramSvg from "@/components/ui/icons/IconInstagramSvg";
import IconChatBotSvg from "@/components/ui/icons/IconChatbotSvg";
import IconYoutubeSvg from "@/components/ui/icons/IconYoutubeSvg";

export default function ChannelIcon({ channelType, size = 18 }) {
	let channelIcon = null

	switch (channelType) {
		case "whatsapp":
			channelIcon = <IconWhatsappSvg width={size} height={size} />
			break

		case "messenger":
			channelIcon = <IconMessengerSvg width={size} height={size} />
			break

		case "instagram_messenger":
			channelIcon = <IconInstagramSvg width={size} height={size} />
			break

		case "fb_page":
			channelIcon = <IconFacebookSvg width={size} height={size} />
			break

		case "telegram":
			channelIcon = <IconTelegramSvg width={size} height={size} />
			break

		case "youtube":
			channelIcon = <IconYoutubeSvg width={size} height={size} />
			break

		case "other":
			channelIcon = <IconChatBotSvg width={size} height={size} />
			break

		default:
			channelIcon = null
	}

	return channelIcon
}