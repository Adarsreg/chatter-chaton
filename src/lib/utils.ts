//npm install clsx
//allows us to give conditional classnames
//npm install tailwind-merge  //allows us to merge tailwind classes
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1: string, id2: string) {
    const sortedIds = [id1, id2].sort()
    return `${sortedIds[0]}--${sortedIds[1]}`
}