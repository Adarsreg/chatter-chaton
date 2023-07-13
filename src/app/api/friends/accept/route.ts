//logic to accept a friend
//naming convention: HTTP method followed by the route name
import { fetchRedis } from "@component/helpers/redis"
import { authOptions } from "@component/lib/auth"
import { getServerSession } from "next-auth"
import { z } from "zod"
export async function POST(req: Request) {
    try {
        const body = await req.json()
        // Parse and validate the 'body' object using the 'zod' library
        const { id: idtoAdd } = z.object({ id: z.string() }).parse(body)
        // Extract the 'id' property from the parsed 'body' object and assign it to the variable 'idtoAdd'
        const session = await getServerSession(authOptions)
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        //verify both users are akready friends
        const isAlreadyFriends = await fetchRedis('sismember',
            `user:${session.user.id}:friends`)

        if (isAlreadyFriends) {
            return new Response("Already friends", { status: 400 })
        }
        //accept the friend request that was sent only if it exists
        const hasFriendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_requests`, idtoAdd)




    }
    catch (error) {

    }
}