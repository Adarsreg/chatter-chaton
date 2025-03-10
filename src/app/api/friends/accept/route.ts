//logic to accept a friend
//naming convention: HTTP method followed by the route name
import { fetchRedis } from "@component/helpers/redis";
import { authOptions } from "@component/lib/auth";
import { db } from "@component/lib/db";
import { pusherServer } from "@component/lib/pusher";
import { toPusherKey } from "@component/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Parse and validate the 'body' object using the 'zod' library
    const { id: idtoAdd } = z.object({ id: z.string() }).parse(body);
    // Extract the 'id' property from the parsed 'body' object and assign it to the variable 'idtoAdd'
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //verify both users are akready friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idtoAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }
    //accept the friend request that was sent only if it exists
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idtoAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }
    const [userRaw, friendRaw] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idtoAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;

    await Promise.all([
      await pusherServer.trigger(
        toPusherKey(`user:${idtoAdd}:friends`),
        "new_friend",
        user
      ),
      await pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "new_friend",
        friend
      ),
      await db.sadd(`user:${session.user.id}:friends`, idtoAdd),
      await db.sadd(`user:${idtoAdd}:friends`, session.user.id),
      await db.srem(
        `user:${session.user.id}:incoming_friend_requests`,
        idtoAdd
      ),
    ]);

    //'new_friend' is the event name that will be triggered on the client side

    /*  await db.srem(`user:${idtoAdd}:outbound_friend_requests`, session.user.id) */

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid Request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
