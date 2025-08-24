// import * as dotenv from "dotenv";
// dotenv.config();
// import readlineSync from "readline-sync";
// import { Pinecone } from "@pinecone-database/pinecone";

// async function chatting(question) {
//   //convert this question into vector-using langhgchain googel
//   const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: "text-embedding-004",
//   });

//   const queryVector = await embeddings.embedQuery(question); //converting question to vector

//   const pinecone = new Pinecone();
//   const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

//   const searchResults = await pineconeIndex.query({
//     topK: 5,
//     vector: queryVector,
//     includeMetadata: true,
//   });

//   console.log(searchResults);
// }
// async function main() {
//   const userProblem = readlineSync.question("pucho--> ");
//   await chatting(userProblem);
//   main();
// }

// main();
import * as dotenv from "dotenv";
dotenv.config();

import readlineSync from "readline-sync";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY, // ✅ init Pinecone
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004",
});

async function chatting(question) {
  // Convert question into vector
  const queryVector = await embeddings.embedQuery(question);

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const searchResults = await pineconeIndex.query({
    topK: 5,
    vector: queryVector,
    includeMetadata: true,
  });

  console.log(JSON.stringify(searchResults, null, 2));
}

async function main() {
  while (true) {
    const userProblem = readlineSync.question("pucho--> ");
    await chatting(userProblem);
  }
}

main();
