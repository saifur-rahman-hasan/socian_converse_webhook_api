import Image from "next/image";

export default function IconYoutubeSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/youtube.svg`} alt={`facebook icon`} width={width} height={height} />
	)
}