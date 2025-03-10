"use client";
import { pusherClient } from '@component/lib/pusher';
import { chatHrefConstructor, toPusherKey } from '@component/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import path from 'path'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import UnseenChattoast from './UnseenChattoast';

interface SidebarChatListProps {
    friends: User[]
    sessionId: string
}
interface ExtendedMessage extends Message {
    senderImg: string,
    senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenmessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChat, setActiveChat] = useState<User[]>(friends )

    useEffect(
        () => {
            //subscribe to pusher channels
            pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

            const newFriendHandler = (newFriend: User) => {
                setActiveChat((prev) => [...prev, newFriend])
            }
            const chatHandler = (message: ExtendedMessage) => {
                console.log('new message')
                const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
                //checking through path if the message has occured in the current chat
                if (!shouldNotify) return
                //if same chat, then don't notify

                //to notify
                toast.custom((t) => (
                    <UnseenChattoast
                        t={t}
                        sessionId={sessionId}
                        senderId={message.senderId}
                        senderImg={message.senderImg}
                        senderMessage={message.text}
                        senderName={message.senderName}
                    />
                ))
                setUnseenMessages((prev) => [...prev, message])
            }

            pusherClient.bind('new_message', chatHandler)
            pusherClient.bind('new_friend', newFriendHandler)

            return () => {
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
                pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

                pusherClient.unbind('new_message', chatHandler)
                pusherClient.unbind('new_friend', newFriendHandler)
            }
        }, [pathname, sessionId, router]
    )
    useEffect(
        () => {
            if (pathname?.includes('chat')) {
                setUnseenMessages((prev) => {
                    return prev.filter((msg) => !pathname.includes(msg.senderId))
                })
            }
        }, [pathname]
    )
    return <ul role='list' className='max-h-[25rem] overflow-y-autp mx-2 space-y-1'>
        {friends.sort().map((friend) => {
            const unseenMessagesCount = unseenmessages.filter((unseenMsg) => {
                return unseenMsg.senderId === friend.id
            }).length
            return (<li key={friend.id}>
                <a href={`/dashboard/chat/${chatHrefConstructor(
                    sessionId,
                    friend.id
                )}`} className='text-gray-300 hover:text-indigo-600 hover:bg-gray-700 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                    <img src={friend.image} alt={`${friend.name}'s profile`} className='w-8 h-8 rounded-full' />
                    {friend.name}
                    {unseenMessagesCount > 0 ? (
                        <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                            {unseenMessagesCount}
                        </div>) : null
                    }
                </a>
            </li>)
        })}
    </ul>
}

export default SidebarChatList