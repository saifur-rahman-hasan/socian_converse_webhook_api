import Image from "next/image";

export default function IconTelegramSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/telegram.svg`} alt={`telegram`} width={width} height={height} />
	)
}