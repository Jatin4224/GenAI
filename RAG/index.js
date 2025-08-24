// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { PineconeStore } from "@langchain/pinecone";

// import * as dotenv from "dotenv";
// dotenv.config();

// async function indexDoc() {
//   const PDF_PATH = "./dsa.pdf";
//   const pdfLoader = new PDFLoader(PDF_PATH);
//   const rawDocs = await pdfLoader.load();

//   //chunk
//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 2000,
//     chunkOverlap: 400,
//   });
//   const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

//   const embeddings = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
//     model: "text-embedding-004",
//   });

//   const pinecone = new Pinecone();
//   const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

//   await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
//     pineconeIndex,
//     maxConcurrency: 4,
//   });
//   console.log("db stored success");
// }

// indexDoc();
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

import * as dotenv from "dotenv";
dotenv.config();

async function indexDoc() {
  try {
    const PDF_PATH = "./dsa.pdf";
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    // Split into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 400,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log(
      `✅ Loaded ${rawDocs.length} pages, split into ${chunkedDocs.length} chunks.`
    );

    // Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "text-embedding-004",
    });

    // Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

    // Store chunks into Pinecone
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 4,
    });

    console.log("🎉 db stored success");

    // ✅ Debug: check stats
    const stats = await pineconeIndex.describeIndexStats();
    console.log("📊 Pinecone Index Stats:", JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error("❌ Error while indexing:", err);
  }
}

indexDoc();
