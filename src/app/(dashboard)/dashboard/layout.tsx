import { authOptions } from "@component/lib/auth";
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    return (<div className="w-full flex h-screen">
        <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6"></div>
        <Link href='/dashboard' className="flex h-16 shrink-0 items-center">

        </Link>
        {children}
    </div>
    )
}

export default Layout
