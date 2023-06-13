import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";

import adapter from "@component/adapters/appwrite";




function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return { clientId, clientSecret }
}
export const authOptions: NextAuthOptions = {
    adapter: adapter,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log(token)
            console.log(user)
            try {
                const dbUser = await db.getDocument(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, `${user.id}`)
                if (dbUser === null || dbUser === undefined) {
                    token.id = user.id
                    return token
                }
                else {
                    return {
                        id: dbUser.id,
                        name: dbUser.name,
                        email: dbUser.email,
                        picture: dbUser.image,
                    }
                }
            } catch (err) {
                console.error(err) // Print the error to the console
                return token // Return the original token object
            }
        },
        async session({ session, token }) {

            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        redirect() {
            return '/dashboard'
        }


    },


}