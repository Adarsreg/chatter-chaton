import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
interface ChatInputProps {
    chatPartner: User
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>('')
    const sendMessage = () => { }
    return (<div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-withinL focus-within:ring-indigo-600 '>
            <TextareaAutosize ref={textareaRef} onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()

                }
            }}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${chatPartner.name}`}
                className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:leading-6'
            />
        </div>
    </div>
    )
}

export default ChatInput