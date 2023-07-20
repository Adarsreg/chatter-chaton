import { FC, useRef, useState } from 'react'
import { Message } from '@component/lib/validations/message'

interface MessagesProps {
    initialMessages: Message[]
    sessionId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId }) => {

    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)
    return (
        <div
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrollDownRef} />
            {
                messages.map((message, index) => {

                    const isCurrentUser = message.senderId === sessionId
                    const hasNextMessagefromSameUser = messages[index - 1]?.senderId === messages[index].senderId

                    return (<div className='chat-message' key={`${message.id}- ${message.timestamp}`}>
                        <div > </div>
                    </div>)



                })
            }
        </div>
    )
}

export default Messages