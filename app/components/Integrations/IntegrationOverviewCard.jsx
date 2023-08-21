import React from 'react'
import classNames from "../../utils/classNames";
import Link from "next/link";
import ChannelIcon from "@/components/Converse/ConverseMessengerApp/ChannelIcon";

export default function IntegrationOverviewCard({ channel }) {
    const {
        id: channelId,
        workspaceId,
        channelType,
        channelName,
        isConnected
    } = channel


    const accessLink = {
        pathname: '/workspaces/[workspaceId]/converse',
        query: {
            workspaceId,
            channelId
        }
    }

  return (
    <div  className={classNames(
        channel?.active ? 'bg-white' : 'bg-gray-100',
        'overflow-hidden rounded-lg shadow')}
    >
        <div className="p-5">

            <div className="flex items-center relative">
                <div className={classNames(
                    !isConnected ? "opacity-30": "",
                    "flex-shrink-0 absolute -bottom-4 right-0"
                )}>
                    <ChannelIcon
                        channelType={channelType}
                        size={40}
                    />
                </div>
                <div className="w-0 flex-1">
                    <dl>
                        <dt className="truncate text-sm font-medium text-gray-500">{channelName}</dt>

                        <dd>
                            <div className="text-lg font-medium text-gray-900">{'...'}</div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
                <Link
                    href={accessLink || '/dashboard'}
                    className="font-medium text-cyan-700 hover:text-cyan-900">
                    View all
                </Link>
            </div>
        </div>
    </div>
  )
}
