import { authOptions } from "@component/lib/auth"
import { db } from "@component/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const session = await getServerSession(authOptions)
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }
        const { id: idtoDeny } = z.object({ id: z.string() }).parse(body)
        //removing the friend request from the incoming friend requests

        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idtoDeny)

        return new Response('OK')
    }
    catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return new Response('Invalid Request payload', { status: 422 })
        }
        return new Response('Invalid Request', { status: 400 })
    }
}