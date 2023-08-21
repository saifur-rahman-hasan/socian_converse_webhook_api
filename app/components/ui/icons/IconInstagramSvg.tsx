import Image from "next/image";

export default function IconInstagramSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/instagram.svg`} alt={`facebook icon`} width={width} height={height} />
	)
}