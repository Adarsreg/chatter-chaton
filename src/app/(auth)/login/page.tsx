'use client';

import { FC, useState } from 'react'
import Button from '../../../components/ui/Button'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'


const Page: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    async function loginWithGoogle() {

        setIsLoading(true)
        try {
            await signIn('google')

        } catch (error) {
            // display error message to user
            toast.error('Error signing in with Google')
            console.log("error signing in with google", error)
        } finally {
            setIsLoading(false)
        }

    }
    return <>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

            <div className='w-full flex flex-col items-center max-w-md space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
                        <path fill="#0077C9" stroke="#000000" d="M194.4,382.5L193,382.5L78.7,366.1L38.7,246.8L55.2,231.5L70,245.5L60.2,291.5L116.2,324.9L128.1,316.2L123.8,223.5L123.8,223.3L194.4,173.6L192.8,173L245.3,208.6L379.6,196.2L388.1,246.8L328.7,262.2L338.6,307.9L304.7,325.4L294.8,279.8L284.6,327.3L253.9,338.4L241.4,327.6L256.1,291.1L200,257.7L188.5,266.3L193,364.4L194.4,365.4L301.7,420L301.8,420L301.7,420ZM173.8,291.5L141.5,285.1L148.8,263.5L173.8,265.7L173.8,291.5ZM155.6,234.5L136.1,239.9L129.7,225.1L128.4,183.9L155.6,193L155.6,234.5ZM192.3,189.5L164.3,183L155.6,166.6L170.6,156L183.5,167.8L181.4,176.8L193,184.3L192.3,189.5ZM362.5,277.5L289.1,296.3L273.6,284.3L271.9,235.5L259.9,223.5L243.5,233.6L253.5,267.5L247.2,299.6L257.3,313.3L279.5,299.7L288.9,261.5L304.6,268.3L314.1,313.1L338.5,320.4L350.5,302.2L373.3,311.8L388,273.5L362.3,275.4L362.5,277.5Z" />
                    </svg>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>ChatOn <span className='text-blue-500'>Chatter?</span></h2>
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Sign in to your account</h2>
                </div>

                <Button isloading={isLoading} type='button'
                    className='max-w-sm mx-auto w-full' onClick={loginWithGoogle}>
                    {isLoading ? null : (
                        <svg
                            className='mr-2 h-4 w-4'
                            aria-hidden='true'
                            focusable='false'
                            data-prefix='fab'
                            data-icon='github'
                            role='img'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'>
                            <path
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                fill='#4285F4'
                            />
                            <path
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                fill='#34A853'
                            />
                            <path
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                fill='#FBBC05'
                            />
                            <path
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                fill='#EA4335'
                            />
                            <path d='M1 1h22v22H1z' fill='none' />
                        </svg>
                    )}
                    Google
                </Button>
            </div>

        </div>
    </>
}

export default Page


