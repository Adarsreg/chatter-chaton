import { Client, Account, Databases, ID, Query } from 'appwrite';
import { Awaitable } from 'next-auth';
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from 'next-auth/adapters';


const client = new Client()
    .setEndpoint(process.env.API_ENDPOINT!)
    .setProject(process.env.PROJECT_ID!)

const database = new Databases(client);

const adapter: Adapter<string> = {
    async getUser(id) {
        console.log(id);
        try {
            const response = database.listDocuments(
                process.env.APPWRITE_DATABASE_ID!,
                process.env.APPWRITE_COLLECTION_ID!,
                [
                    Query.equal("id", [id])
                ]
            );

            response.then(function (response) {
                console.log(response); // Success
            }, function (error) {
                console.log(response) // Failure
                console.log(error); // Failure
            });



            return null;
        } catch (error) {
            console.error('Error retrieving session:', error);
            return null;
        }
    },

    async createUser(user): Promise<AdapterUser> {
        try {
            const response = database.createDocument(process.env.DATABASE_ID!,
                process.env.COLLECTION_ID!, ID.unique(), { user });


            response.then(function (response) {
                console.log(response); // Success
            }, function (error) {
                console.log(response) // Failure
                console.log(error); // Failure
            });
            const createdUser: AdapterUser = {
                id: (await response).$id,
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
            const resp = database.listDocuments(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, [
                Query.equal('sessionToken', [sessionToken]),
            ]);
            resp.then(function (response) {
                console.log(response); // Success
            }, function (error) {
                console.log(resp) // Failure
                console.log(error); // Failure
            });
            /* const doc = resp.documents[0]; */

            /*  await database.deleteDocument(
                 process.env.DATABASE_ID!,
                 process.env.COLLECTION_ID!,
                 doc.$id
             ); */

        } catch (error) {
            console.error('Error deleting session:', error);

        }
    },
    async getUserByAccount({ providerAccountId, provider }) {
        const resp = await database.listDocuments(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, [Query.equal('provider', [provider]), Query.equal('providerAccountId', [providerAccountId])]);
        const doc = resp.documents[0];
        if (!doc) {
            console.log(doc);
            return null;
        }
        const user = database.listDocuments(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, [Query.equal('id', [doc.userId])]);
        user.then(function (response) {
            console.log(response); // Success
        }, function (error) {
            console.log(error); // Failure
        });
        return null;

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
    },
    getUserByEmail: function (email: string): Awaitable<AdapterUser | null> {
        throw new Error('Function not implemented.');
    }
};

export default adapter;


