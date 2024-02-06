"use client";
import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { pusherClient } from '@component/lib/pusher';
import { toPusherKey } from '@component/lib/utils';
import { set } from 'date-fns';
interface FriendRequestsSidebarOptionProps {
    sessionId: string
    initialrequestcount: number
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({ sessionId, initialrequestcount }) => {

    const [requestcount, setRequestCount] = useState<number>(initialrequestcount)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        console.log("subscribed to  ", `user:${sessionId}:incoming_friend_requests`)

        const friendRequestHandler = () => {
            setRequestCount((prev) => prev + 1)

        }
        const addedFriendHandler = () => {
            setRequestCount((prev) => prev - 1)
        }
        pusherClient.bind('incoming_friend_requests', friendRequestHandler)
        pusherClient.bind('new_friend', addedFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
            pusherClient.unbind('new_friend', addedFriendHandler)
        }
    }, [sessionId])
    return <Link href='/dashboard/requests' className='text-gray-300 hover:gray-700 hover:text-indigo-600 hover:bg-gray-700 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <div className='text-gray-300 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-black'>
            <User className='h-4 w-4' />
        </div>
        <p className='truncate'>Friend Requests</p>

        {requestcount > 0 ? (
            <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
                {requestcount}
            </div>
        ) : null}
    </Link>
}

export default FriendRequestsSidebarOption