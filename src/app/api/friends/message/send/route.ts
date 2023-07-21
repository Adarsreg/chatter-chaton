import { fetchRedis } from "@component/helpers/redis"
import { authOptions } from "@component/lib/auth"
import { db } from "@component/lib/db"
import { messageValidator } from "@component/lib/validations/message"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
    try {
        const { text, chatId }: { text: string, chatId: string } = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) return new Response('Unauthorized', { status: 401 })
        const [userId1, userId2] = chatId.split('--')

        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorized', { status: 401 })
        }
        const friendId = session.user.id === userId1 ? userId2 : userId1
        const friendList = await fetchRedis('smembers', `user:${session.user.id}:friends`) as string[]
        const isFriend = friendList.includes(friendId)

        if (!isFriend) {
            return new Response('Unauthorized', { status: 401 })
        }
        const sender = await fetchRedis('get', `user:${session.user.id}:username`) as string
        const parsedsender = JSON.parse(sender) as User
        const timestamp = Date.now()
        // send message to redis

        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp,
        }

        const message = messageValidator.parse(messageData)
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })

        return new Response('Ok')
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 400 })

        }
        return new Response('Internal Server Error', { status: 500 })
    }

}