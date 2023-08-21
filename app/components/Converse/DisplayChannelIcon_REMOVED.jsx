import IconWhatsappSvg from "@/components/ui/icons/IconWhatsappSvg";
import IconMessengerSvg from "@/components/ui/icons/IconMessengerSvg";
import IconFacebookSvg from "@/components/ui/icons/IconFacebookSvg";
import IconTelegramSvg from "@/components/ui/icons/IconTelegramSvg";

const DisplayChannelIcon_REMOVED = ({ channelType, size = 18 }) => {
	const icons = {
		whatsapp: IconWhatsappSvg,
		messenger: IconMessengerSvg,
		facebook_page: IconFacebookSvg,
		telegram: IconTelegramSvg
	};

	const IconComponent = icons[channelType] || null;

	return IconComponent && <IconComponent width={size} height={size} />;
};

export default DisplayChannelIcon_REMOVED;
