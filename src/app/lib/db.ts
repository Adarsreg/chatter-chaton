import { Client, Databases, ID } from 'appwrite';
const client = new Client();

try {
    client.setEndpoint(process.env.API_ENDPOINT!)
        .setProject(process.env.PROJECT_ID!);
}
catch (err) {
    console.log(err)
    console.log("Error in db.ts")
}


export const db = new Databases(client);