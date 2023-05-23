import { Client, Databases, ID } from 'appwrite';
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6467cf114ccfab3085b6');               // Your project ID

const databases = new Databases(client);
const promise = databases.createDocument(
    '646cdcc9b0508d521af3',
    '646cdd086b2f96729ea7',
    ID.unique(),
    {}
);
promise.then(function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});