import Image from "next/image";

export default function IconFacebookSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/facebook.svg`} alt={`facebook icon`} width={width} height={height} />
	)
}