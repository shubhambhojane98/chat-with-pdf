'use server'

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function generateEmbeddings(docsId:string){
    auth().protect() //Protect this route with clerk

    // turn a pdf into embedding [0.0123234,0.234234,...]
    await generateEmbeddingInPineconeVectorStore(docsId)

    revalidatePath("/dashbaord")

    return{completed : true}
}