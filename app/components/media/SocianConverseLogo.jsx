import Image from "next/image";
import SocianConverseLogoWhite from '../../public/converse/images/socian_converse_logo.png'

export default function SocianConverseLogo({ className, dark }){
	return (
		<Image
			className={className || 'w-40 mx-auto'}
			src={SocianConverseLogoWhite}
			alt="Socian Converse Logo"
			width={200}
			height={200}
		/>
	)
}