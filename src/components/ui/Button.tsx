import { cn } from '@component/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'

// Define button variants using cva
const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-indigo-800  text-white hover:bg-blue-600', // Updated hover behavior
        ghost: 'text-gray-300 hover:gray-700 hover:text-indigo-600 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold', // Updated ghost variant
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3',
        lg: 'h-12 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isloading?: boolean // Loading state for the button
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  isloading,
  size,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isloading}
      {...props}
    >
      {isloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {children}
    </button>
  )
}

export default Button