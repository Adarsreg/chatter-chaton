import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";


import { Client } from "appwrite";
const appwriteClient = new Client();

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
    adapter: ,
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

}