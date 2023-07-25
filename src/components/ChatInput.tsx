"use client"
import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'
import axios from 'axios'
import { toast } from 'react-hot-toast'
interface ChatInputProps {
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>('')
    const sendMessage = async () => {
        setIsLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            await axios.post('/api/message/send', { text: input, chatId })
            setInput('')
            textareaRef.current?.focus()
        }
        catch (error) {
            toast.error('Something went wrong. Please try again')
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }
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

            <div
                onClick={() => textareaRef.current?.focus()}
                className='py-2'
                aria-hidden='true'
            >
                <div className='py-px'>
                    <div className='h-9' />
                </div>
            </div>
            <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                <div className='flex-shrink-0'>
                    <Button isloading={isLoading} onClick={sendMessage} type='submit'>POST</Button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ChatInput