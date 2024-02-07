
import { cn } from '@component/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'
//creating a resuable button using cva

const buttonVariants = cva(
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-900',
                ghost: 'bg-transparent hover:text-slate-900 ',
                

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
    },
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    //loading state inside the button
    isloading?: boolean
}
const Button: FC<ButtonProps> = ({ className, children, variant, isloading, size, ...props }) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} disabled={isloading} {...props}>
        {isloading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
        {children}
    </button>
}

export default Button;