"use client"
import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import { toast } from 'react-hot-toast'
import { signOut } from 'next-auth/react'
import { set } from 'zod'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
    const [isSignOut, setIsSignOut] = useState<boolean>(false)

    return <Button{...props} variant='ghost' onClick={async () => {
        setIsSignOut(true)
        try {
            await signOut()
        }
        catch (error) {
            toast.error('There was a problem signing out')
        }
        finally {
            setIsSignOut(false)
        }

    }}>
        {isSignOut ? (
            <Loader2 className='animate-spin h-4 w-4' />
        ) : (
            <LogOut className='w-4 h-4  text-white hover:bg-gray-700 ' />

        )}
    </Button>
}

export default SignOutButton