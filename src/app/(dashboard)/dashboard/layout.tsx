import { authOptions } from "@component/lib/auth";
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";
import { Icon, Icons } from "@component/components/Icons";

interface LayoutProps {
    children: ReactNode
}

interface SidebarOption {
    id: number
    name: string
    href: string
    Icon: Icon

}
const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add Friend',
        href: '/dashboard/add',
        Icon: 'UserPlus'

    }
]
const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    return (<div className="w-full flex h-screen">
        <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href='/dashboard' className="flex h-16 shrink-0 items-center">
                <Icons.Logo className="h-8 w-auto text-indigo-600" />
            </Link>
            <div className="text-xs font-semibold leading-6 text-gray-400">
                Your Chats
            </div>
            <nav className="flex flex-1 flex-col"  >
                <ul role='list' className="flex flex-1 flex-col gap-y-7">
                    <li> //chat user has </li>
                    <li>
                        <div className="text-sm font-semibold leading-6 text-gray-900">
                            Overview
                        </div>
                        <ul role='list ' className="mx-2 mt-2 space-y-1">
                            {sidebarOptions.map((opt) => {
                                const Icon = Icons[opt.Icon]
                                return (
                                    <li key={opt.id} >
                                        <Link href={opt.href} className="text-gray-700 hover:text-indigo-900 hover:bg-gray-60 group flex gap-3 rounded-md p-2 text-sm leading-10 font-semibold ">
                                            <span className="text-gray-600 border-gray-250 group-hover:border-indigo-600 group-hover:text-indigo-600 flex-h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="truncate">{opt.name}</span>

                                        </Link>
                                    </li>
                                )
                            })} </ul>
                    </li>
                </ul>
            </nav>

        </div>
        {children}
    </div>
    )
}

export default Layout
