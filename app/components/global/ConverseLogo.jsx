import ConverseAgentLogo from '@/public/converse/images/socian_converse_logo.png'
import Image from "next/image";
import classNames from "@/utils/classNames";

export default function ConverseLogo({ className, alt="Converse Logo" }){
	return (
		<div
			style={{ position: 'relative' }}
			className={classNames(className)}
		>
			<Image
				src={ConverseAgentLogo}
				alt={alt}
				layout="fill"
				objectFit="cover"
			/>
		</div>


	)
}