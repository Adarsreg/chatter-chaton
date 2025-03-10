"use client"
import { ButtonHTMLAttributes, FC, useState } from 'react'
import { toast } from 'react-hot-toast'
import { signOut } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <button
      {...props}
      className="flex items-center justify-center w-10 h-10 text-gray-300 hover:text-indigo-600 hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={async () => {
        setIsLoading(true) // Start loading
        try {
          await signOut()
        } catch (error) {
          toast.error('There was a problem signing out')
        } finally {
          setIsLoading(false) // Stop loading
        }
      }}
      disabled={isLoading} // Disable button while loading
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" /> // Spinner while loading
      ) : (
        <LogOut className="w-5 h-5" /> // LogOut icon when not loading
      )}
    </button>
  )
}

export default SignOutButton