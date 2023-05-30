// Import the required libraries
import { db } from './db';

// Create a new session document in the Appwrite Database collection
async function createSession(sessionData: any): Promise<string> {
    try {
        const session = await db.createDocument(
            'sessions', // The collection name where the session documents are stored
            sessionData, // The session data to be stored in the document
            ['*'], // The list of read permissions
            ['*'], // The list of write permissions
        );
        return session.$id; // Return the document ID
    } catch (error) {
        console.log('Error creating session:', error);
        throw error; // Throw the error to the caller
    }
}

// Example usage
const sessionData = { userId: 123, expiresAt: Date.now() + 3600000 /* Session timeout */ };
const sessionId = await createSession(sessionData);
console.log('Created session with ID', sessionId);