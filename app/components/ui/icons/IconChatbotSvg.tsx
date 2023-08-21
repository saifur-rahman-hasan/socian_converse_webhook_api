import Image from "next/image";

export default function IconChatBotSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/chatbot.svg`} alt={`chatbot icon`} width={width} height={height} />
	)
}