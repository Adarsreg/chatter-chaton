"use client"
import { pusherClient } from '@component/lib/pusher'
import { toPusherKey } from '@component/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
    const router = useRouter()
    const [friendrequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
        incomingFriendRequests
    )
    //listen for incoming friend requests
    useEffect(
        () => {
            pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            const friendRequestHandler = () => {

            }
            pusherClient.bind('incoming_friend_requests', friendRequestHandler)

            return () => {
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
                pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
            }
        }, []
    )
    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId)
        )
        router.refresh()
    }
    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId)
        )
        router.refresh()
    }
    return (<>
        {friendrequests.length === 0 ? (
            <p className='text-sm text-zinc-500 '>Nothing to show here...</p>
        ) : (
            friendrequests.map((request) => (
                <div key={request.senderId} className='flex gap-4 items-center'>
                    <UserPlus className='text-black' />
                    <p className='font-medium text-lg'>{request.senderEmail}</p>
                    <button
                        onClick={() => acceptFriend(request.senderId)}
                        aria-label='accept friend'
                        className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <Check className='font-semibold text-white w-3/4 h-3/4' />
                    </button>

                    <button
                        onClick={() => denyFriend(request.senderId)}
                        aria-label='deny friend'
                        className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                        <X className='font-semibold text-white w-3/4 h-3/4' />
                    </button>
                </div>
            ))
        )}
    </>
    )
}

export default FriendRequests