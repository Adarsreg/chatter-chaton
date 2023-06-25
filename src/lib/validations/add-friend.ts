import { z } from 'zod';
//to check format of email
export const addFriendValidator = z.object(
    {
        email: z.string().email()
    }
)

