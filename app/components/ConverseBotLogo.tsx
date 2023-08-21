import Image from "next/image";
import React from "react";
import ConverseBotLogoImage from '@/public/converse/images/socian_converse_logo.png'

export default function ConverseBotLogo({ size }) {
    return <Image
        src={ConverseBotLogoImage}
        width={size}
        height={size}
        className={`mx-auto`}
        alt={`converse-bot-logo`}
    />
}