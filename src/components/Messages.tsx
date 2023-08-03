"use client"
import { FC, useEffect, useRef, useState } from 'react'
import { Message } from '@component/lib/validations/message'
import { cn, toPusherKey } from '@component/lib/utils'
import { time } from 'console'
import { format } from 'date-fns'
import Image from 'next/image'
import { pusherClient } from '@component/lib/pusher'


interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
    sessionImg: string | null | undefined
    chatPartner: User
    chatId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, chatPartner, sessionImg, chatId }) => {

    const [messages, setMessages] = useState<Message[]>(initialMessages)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`)
        )


        const MessageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev])

        }
        //message handler gets called everytime a new message is sent
        pusherClient.bind('incoming-message', MessageHandler)

        return () => {
            //unsubscribe from pusher channel and unbind the event listener inorder to prevent memory leaks
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind('incoming-message', MessageHandler)
        }
    }, [])

    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    const formatTimeStamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm')
    }
    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef} />
            {
                messages.map((message, index) => {

                    const isCurrentUser = message.senderId === sessionId
                    const hasNextMessagefromSameUser = messages[index - 1]?.senderId === messages[index].senderId

                    return (
                        <div className='chat-message'
                            key={`${message.id}- ${message.timestamp}`}>
                            <div className={cn('flex items-end', {
                                'justify-end': isCurrentUser,
                            })}>
                                <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2 ',
                                    {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    }
                                )}>
                                    <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                        'bg-indigo-600 text-white': isCurrentUser,
                                        'bg-gray-200 text-gray-900': !isCurrentUser,
                                        'rounded-br-none': !hasNextMessagefromSameUser && isCurrentUser,
                                        'rounded-bl-none': !hasNextMessagefromSameUser && !isCurrentUser,
                                    })}>
                                        {message.text}{' '}
                                        <span className='ml-2 text-xs text-gray-400'>
                                            {formatTimeStamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>
                                <div className={cn('relative w-6 h-6', {
                                    'order-2': isCurrentUser,
                                    'order-1': !isCurrentUser,
                                    'invisible': hasNextMessagefromSameUser
                                })}>
                                    <Image
                                        fill
                                        src={
                                            isCurrentUser ? (sessionImg as string) : chatPartner.image
                                        }
                                        alt='Profile picture'
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                    />
                                </div>
                            </div>

                        </div>
                    )



                })}
        </div>
    )
}

export default Messages