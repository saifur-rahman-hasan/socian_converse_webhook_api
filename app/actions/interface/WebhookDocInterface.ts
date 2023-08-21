export interface WebhookDocCreateInterface {
    workspaceId?: number| null,
    channelType: string,
    channelId?: number | null,
    payloadData: any,
    payloadQueryParams?: object | null,
    received?: boolean,
    payloadType?: string
}

export interface WebhookDocOutputInterface extends WebhookDocCreateInterface {
    _id: string;
}