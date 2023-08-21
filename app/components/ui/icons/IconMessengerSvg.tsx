import Image from "next/image";

export default function IconMessengerSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/messenger.svg`} alt={`messenger icon`} width={width} height={height} />
	)
}