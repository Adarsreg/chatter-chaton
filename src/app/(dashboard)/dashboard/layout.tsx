import { authOptions } from "@component/lib/auth";
import Link from 'next/link'
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";
import { Icon, Icons } from "@component/components/Icons";
import Image from "next/image";
import SignOutButton from "@component/components/SignOutButton";
import FriendRequestsSidebarOption from "@component/components/FriendRequestsSidebarOption";
import { fetchRedis } from "@component/helpers/redis";
import { getFriendsByUserId } from "@component/helpers/get-friends-by-user-id";
import SidebarChatList from "@component/components/SidebarChatList";

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

  const friends = await getFriendsByUserId(session.user.id)
  const requestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]).length

  return (
    <div className="w-full flex h-screen">
      {/* Sidebar */}
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-gray-900 px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center pl-2">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {/* Friends List */}
        {friends.length > 0 && (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Your Chats
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Chat List */}
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>

            {/* Sidebar Options */}
            <li>
              <div className="text-sm font-semibold leading-6 text-gray-300">
                Overview
              </div>
              <ul role="list" className="mx-2 mt-2 space-y-1">
                {sidebarOptions.map((opt) => {
                  const Icon = Icons[opt.Icon]
                  return (
                    <li key={opt.id}>
                      <Link
                        href={opt.href}
                        className="text-gray-300 hover:text-indigo-600 hover:bg-gray-700 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        {/* Icon Container (No Hover Effect) */}
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-black">
                          <Icon className="h-4 w-4" />
                        </span>
                        {/* Text (Hover Effect) */}
                        <span className="truncate">{opt.name}</span>
                      </Link>
                    </li>
                  )
                })}

                {/* Friend Requests */}
                <li>
                  <FriendRequestsSidebarOption
                    sessionId={session.user.id}
                    initialrequestcount={requestCount}
                  />
                </li>
              </ul>
            </li>

            {/* User Profile */}
            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-300">
                <div className="relative h-8 w-8 bg-gray-700 rounded-full">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ''}
                    alt="Your profile picture"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-gray-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              {/* Sign Out Button */}
              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <aside className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  )
}

export default Layout