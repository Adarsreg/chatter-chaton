//npm install clsx
//allows us to give conditional classnames
//npm install tailwind-merge  //allows us to merge tailwind classes
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

