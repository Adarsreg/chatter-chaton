"use client";
import { FC } from 'react'
import { db } from './lib/db';
import Button from './components/ui/Button'

interface pageProps {

}


const page: FC<pageProps> = ({ }) => {


  const handleClick = async () => {


    // set the collection ID of your database
    const documentData = {
      title: 'From env not public lmao', // set the title of your document
      message: 'new test', // set the message of your document
    };

    try {
      const result = await db.createDocument(process.env.DATABASE_ID!, process.env.COLLECTION_ID!, 'bigmoney', documentData);
      console.log(result); // log the result to the console to check if it workedds
    } catch (error) {
      console.error(error);

      // log any errors to the console
    }
  };

  return <Button onClick={handleClick}>click here</Button>
    ; // add onClick to Button component to call handleClick function
};

export default page;