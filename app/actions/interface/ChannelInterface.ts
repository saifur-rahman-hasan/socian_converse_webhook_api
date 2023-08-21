export interface ChannelDataRequiredInterface {
    accountId: string,
    accessToken: string,
    authorized: boolean,
}

export interface ChannelCreateInputInterface {
    workspaceId: number;
    channelUid: string;
    channelName: string;
    channelType: string | ChannelTypeEnum;
    isConnected: boolean;
    channelData: any & ChannelDataRequiredInterface;
}

export enum ChannelTypeEnum {
    telegram = "telegram",
    messenger = "messenger",
    instagram_messenger = "instagram_messenger",
    whatsapp = "whatsapp",
    fb_page = "fb_page",
    fb_group = "fb_group",
    other = "other",
}


export interface ChannelOutputInterface {
    id: number;
    workspaceId: number;
    channelUid: string;
    channelName: string;
    channelType: string | ChannelTypeEnum;
    isConnected: boolean;
    channelData: any & ChannelDataRequiredInterface;
    workspace?: any
}

export interface ChannelConsumerDocInputInterface {
    channelAccountId: string,
    channelType: string,
    consumerId: string,
    consumerData: {
        id: string,
        name: string,
        email?: string,
        phone?: string
    }
}

export interface ChannelConsumerDocOutputInterface {
    _id: string,
    channelAccountId: string,
    channelType: string,
    consumerId: string,
    consumerData: {
        id: string,
        name: string,
        email?: string,
        phone?: string,
        role?: 'consumer',
    }
}

export interface ConsumerDataOutputInterface {
    id: string,
    name: string,
    email?: string,
    phone?: string,
    role?: 'consumer'
}