import { Client, Databases, ID } from 'appwrite';

const client = new Client();
const projectId = process.env.PROJECT_ID!
const apiendpoint = process.env.API_ENDPOINT!

try {
    client.setEndpoint(apiendpoint)
        .setProject(projectId);
}
catch (err) {
    console.log(err);
    console.log("Error in db.ts")
}


export const db = new Databases(client);