/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
        UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,

    },
    images: {
        domains: ['lh3.googleusercontent.com']
    }
}

module.exports = nextConfig