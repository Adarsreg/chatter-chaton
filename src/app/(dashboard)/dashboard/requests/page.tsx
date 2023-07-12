import AddFriendButton from '@component/components/AddFriendButton'
import FriendRequests from '@component/components/FriendRequests'
import { fetchRedis } from '@component/helpers/redis'
import { authOptions } from '@component/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { send } from 'process'
import { FC } from 'react'



const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    //friend req list for the logged user
    const incomingRequests = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as string[]

    const incomingFriendRequests = await Promise.all(
        incomingRequests.map(async (senderId) => {
            const sender = (await fetchRedis('get', `user:${senderId}`)) as string
            const senderparsed = JSON.parse(sender) as User
            return {
                senderId,
                senderEmail: senderparsed.email,
            }
        })
    )

    return <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
        <div className='flex flex-col gap-4'>
            <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
        </div>
    </main>
}

export default page