/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {

        API_ENDPOINT: process.env.API_ENDPOINT,
        PROJECT_ID: process.env.PROJECT_ID,
        DATABASE_ID: process.env.DATABASE_ID,
        COLLECTION_ID: process.env.COLLECTION_ID,

    }
}

module.exports = nextConfig