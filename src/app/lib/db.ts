import { Client, Databases, ID } from 'appwrite';
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('');               // Your project ID

const databases = new Databases(client);
const promise = databases.createDocument(
    '',
    '',
    ID.unique(),
    {}
);
promise.then(function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});