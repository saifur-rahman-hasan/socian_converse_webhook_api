import Image from "next/image";

export default function IconWhatsappSvg({ width = 50, height = 50}){
	return (
		<Image src={`/converse/integrations/whatsapp.svg`} alt={`facebook icon`} width={width} height={height} />
	)
}