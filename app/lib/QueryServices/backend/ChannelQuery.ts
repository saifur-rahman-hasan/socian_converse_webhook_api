import prisma from "@/lib/prisma";
import {debugLog} from "@/utils/helperFunctions";

export default class ChannelQuery {

    constructor() {
    }

    async getChannelByChannelId(channelUid) {
        try {
            const channel = await prisma.channel.findFirst({
                where: {
                    channelId: channelUid,
                }
            })

            if (!channel?.id) {
                throw new Error('Channel Id not found.')
            }

            if (!channel?.workspaceId || !channel?.channelType || !channel?.id) {
                throw new Error('workspaceId, channelType, and channelId all are required.')
            }

            return channel
        } catch (err) {
            console.log("Error", err.toString())
            throw new Error('workspaceId, channelType, and channelId all are required.')
        }
    }

    /**
     * Find unique channel by channelUid
     * channelUid: channelType_channelAccountId
     * channelType: messenger | fb_page | youtube | instagram_messenger
     *
     * @param channelUid
     * @param channelType
     */
    async findUniqueChannelByChannelUid (channelType: any, channelUid: string ): Promise<any> {
        try {
            const channel : any = await prisma.channel.findFirst({
                where: {
                    channelId: channelUid,
                    channelType: channelType,
                },
                include: {
                    workspace: {
                        select: {
                            userId: true,
                        },
                    },
                },
            })

            return Promise.resolve(channel)
        }catch (e) {
            return Promise.reject("Channel not found")
        }
    }

    async findChannelById(id: number) {
        try {
            const channel = await prisma.channel.findFirst({
                where: { id: id },
                include: {
                    workspace: {
                        select: {
                            userId: true,
                        },
                    },
                },
            })

            if (!channel?.id) {
                return Promise.resolve(null)
            }

            if (!channel?.workspaceId || !channel?.channelType || !channel?.id) {
                return Promise.resolve(null)
            }

            return Promise.resolve(channel)
        } catch (err) {
            debugLog('Error In: findChannelById : ', err)
            return Promise.reject(new Error('Failed to find the channel'))
        }
    }

}
