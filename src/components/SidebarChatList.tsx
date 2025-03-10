"use client"
import { pusherClient } from '@component/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@component/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import UnseenChattoast from './UnseenChattoast'

interface SidebarChatListProps {
  friends: User[]
  sessionId: string
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
      if (!shouldNotify) return

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
  }, [pathname, sessionId, router])

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages((prev) => prev.filter((msg) => !pathname.includes(msg.senderId)))
    }
  }, [pathname])

  return (
    <ul className="space-y-2 overflow-y-auto scrollbar-hide"> {/* Hide scrollbar */}
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => unseenMsg.senderId === friend.id).length
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
              className="flex items-center text-gray-300 hover:text-indigo-600 hover:bg-gray-700 group gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <img
                src={friend.image}
                alt={`${friend.name}'s profile`}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium truncate">{friend.name}</span>
              {unseenMessagesCount > 0 && (
                <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  {unseenMessagesCount}
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarChatList