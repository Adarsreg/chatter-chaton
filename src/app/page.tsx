"use client";
import { FC } from 'react'
import Button from './components/ui/Button'
import { db } from './lib/db';
interface pageProps {

}
//children refers to the content inside the button
const page: FC<pageProps> = ({ }) => {
  const handleClick = async () => {
    const collectionId = `${process.env.collection_id}`;
    const databaseid = `${process.env.database_id}`;
    const documentid = `${process.env.document_id}`;
    // set the collection ID of your database
    const documentData = {
      title: 'process working again', // set the title of your document
      message: 'hello wroking 33', // set the message of your document
    };

    try {
      const result = await db.createDocument(databaseid, collectionId, documentid, documentData);
      console.log(result); // log the result to the console to check if it worked
    } catch (error) {
      console.error(error);

      // log any errors to the console
    }
  };

  return <Button onClick={handleClick}>click here</Button>; // add onClick to Button component to call handleClick function
};

export default page;