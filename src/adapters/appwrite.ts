import { Client, Account, Databases, ID, Query } from 'appwrite';
import { Awaitable } from 'next-auth';
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from 'next-auth/adapters';


const client = new Client()
    .setEndpoint(process.env.API_ENDPOINT!)
    .setProject(process.env.PROJECT_ID!)

const database = new Databases(client);

const adapter: Adapter<string> = {
    async getUser(id) {
        console.log(id)
        try {
            const response = await database.listDocuments(
                process.env.APPWRITE_DATABASE_ID!,
                process.env.APPWRITE_COLLECTION_ID!,
                [
                    Query.equal("id", [id])
                ]
            );

            const document = response.documents[0];

            if (document) {
                return JSON.parse(document.data);
            }

            return null;
        } catch (error) {
            console.error('Error retrieving session:', error);
            return null;
        }
    },

    async createUser(user): Promise<AdapterUser> {
        try {
            const response = await database.createDocument(process.env.DATABASE_ID!,
                process.env.COLLECTION_ID!, ID.unique(), { user });
            const createdUser: AdapterUser = {
                id: response.$id,
                ...user,
            };
            return createdUser;
        } catch (error) {
            console.error('Error creating session:', error);

            return Promise.reject(`Error creating session: ${error}`);
        }
    },

    async deleteSession(sessionToken: string) {

        try {
            const resp = await database.listDocuments(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, [
                Query.equal('title', [sessionToken]),

            ])
            const doc = resp.documents[0]

            await database.deleteDocument(
                process.env.DATABASE_ID!,
                process.env.COLLECTION_ID!,
                doc.$id
            );

        } catch (error) {
            console.error('Error deleting session:', error);

        }
    },
    async getUserByEmail(email: string): Promise<AdapterUser> {
        const user = database.getDocument(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, email);
    },
    getUserByAccount: function (providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>): Awaitable<AdapterUser | null> {
        throw new Error('Function not implemented.');
    },
    updateUser: function (user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Awaitable<AdapterUser> {
        throw new Error('Function not implemented.');
    },
    linkAccount: function (account: AdapterAccount): Promise<void> | Awaitable<AdapterAccount | null | undefined> {
        throw new Error('Function not implemented.');
    },
    createSession: function (session: { sessionToken: string; userId: string; expires: Date; }): Awaitable<AdapterSession> {
        throw new Error('Function not implemented.');
    },
    getSessionAndUser: function (sessionToken: string): Awaitable<{ session: AdapterSession; user: AdapterUser; } | null> {
        throw new Error('Function not implemented.');
    },
    updateSession: function (session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>): Awaitable<AdapterSession | null | undefined> {
        throw new Error('Function not implemented.');
    }
};

export default adapter;


