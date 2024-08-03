import { Pinecone } from '@pinecone-database/pinecone';


if(!process.env.PINECONE_API_KEY){
    throw new Error("PINCONE_API_KEY is not ser");
}

const pinconeClient = new Pinecone({
    apiKey : process.env.PINECONE_API_KEY,
})


export default pinconeClient