//mandatory route.ts file for routing
//handling post req

import { fetchRedis } from "@component/helpers/redis"
import { authOptions } from "@component/lib/auth"
import { db } from "@component/lib/db"
import { addFriendValidator } from "@component/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email: emailToAdd } = addFriendValidator.parse(body.email)

        const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_URL}/get/user:email${emailToAdd}`, {
            headers: {
                Authorization: `Bearer ${process.env.UPSTASH_REDIS_TOKEN}`,
            },
            cache: "no-store",
        }
        )
        //user:email:simchettri123@gmail.com => source url

        const data = await RESTResponse.json() as { result: string | null }
        const idToAdd = data.result
        if (!idToAdd) {
            return new Response('This person does not exist', { status: 400 })
        }
        const session = await getServerSession(authOptions)
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }
        if (idToAdd === session.user.id) {
            return new Response("You cannot add yourself as a friend", { status: 400 })

        }

        //check for already added user using a custom helper function
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1

        const isAlreadyFriends = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd) as 0 | 1
        if (isAlreadyAdded) {
            return new Response('Already added this user', { status: 400 })
        }

        if (isAlreadyFriends) {
            return new Response('Already friends with this user', { status: 400 })
        }
        //valid request, send friend request
        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

        return new Response('OK')

    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 })
        }
        return new Response('Invalid request', { status: 400 })
    }
}