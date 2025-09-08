// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";
// import readlineSync from "readline-sync";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
// // Chat context (memory)
// const Context = [];

// async function User(userQuery) {
//   Context.push({
//     role: "user",
//     parts: [{ text: userQuery }],
//   });

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: Context,
//   });
//   Context.push({
//     role: "user",
//     parts: [{ text: response.text }],
//   });

//   console.log(response.text);
// }

// async function main() {
//   const userQuery = readlineSync.question("Hanji pucho!!");
//   await User(userQuery); //if i dont write await here the main function will be called early
//   main();
// }

// main();
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import "dotenv/config";
// // Initialize Gemini model
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: process.env.GEMINI_API_KEY,
// });
// // Create a prompt template with different roles
// const template = ChatPromptTemplate.fromMessages([
//   [
//     "system",
//     `Answer the question based on the context below.
//      If the question cannot be answered using the information provided,
//      just reply with "I don't know".`,
//   ],
//   ["human", "Context: {context}"],
//   ["human", "Question: {question}"],
// ]);

// // Fill dynamic data (context + question)
// const prompt = await template.invoke({
//   context: `Chai is one of the most loved beverages in India.
//   It is made by brewing black tea leaves with milk, water, and spices like ginger and cardamom.
//   Many people enjoy chai in the evening with snacks such as pakoras or biscuits.`,

//   question: "tell me the snacks name?",
// });

// // Send the structured prompt to Gemini
// const response = await model.invoke(prompt);

// console.log(response.content);

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { z } from "zod";
// import "dotenv/config";
// // 1. Define schema for structured JSON output
// const answerSchema = z
//   .object({
//     answer: z.string().describe("The answer to the user's question"),
//     justification: z.string().describe("Reasoning behind the answer"),
//   })
//   .describe("An answer along with justification.");

// // 2. Create Gemini model and bind schema
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: process.env.GEMINI_API_KEY,
//   temperature: 0, // lower = more deterministic
// }).withStructuredOutput(answerSchema);

// // 3. Ask a question
// const response = await model.invoke("green tea recipe?");

// console.log(response);
// // Example Output:
// // {
// //   answer: "They weigh the same.",
// //   justification: "A pound of bricks and a pound of feathers are both one pound."
// // }
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { CommaSeparatedListOutputParser } from "@langchain/core/output_parsers";
// import "dotenv/config";
// import z from "zod";
// const answerSchema = z
//   .object({
//     answer: z.string().describe("The answer to the user's question"),
//     justification: z.string().describe("Reasoning behind the answer"),
//   })
//   .describe("An answer along with justification.");

// const parser = new CommaSeparatedListOutputParser();

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: process.env.GEMINI_API_KEY,
//   temperature: 0, // lower = more deterministic
// });

// // 3. Ask a question
// const response = await model.invoke("green tea recipe?");

// // Parse Gemini’s raw text into a clean array
// const parsedList = await parser.invoke(response.content);

// console.log(parsedList);
// // Example Output:
// // ["ginger", "cardamom", "cloves"]
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { RunnableLambda } from "@langchain/core/runnables";
// import "dotenv/config";

// // 1. Build a chat prompt template
// const template = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful assistant."],
//   ["human", "{question}"],
// ]);

// // 2. Define the Gemini model
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // 3. Combine them in a custom function (RunnableLambda)
// const chatbot = RunnableLambda.from(async (values) => {
//   const prompt = await template.invoke(values);
//   return await model.invoke(prompt);
// });

// // 4. Use it
// const response = await chatbot.invoke({
//   question: "Which spices are commonly added to chai?",
// });

// console.log(response.content);
// // 👉 "Ginger and cardamom are commonly added to chai for flavor."
// 1. Same prompt
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

// import "dotenv/config";

// const template = ChatPromptTemplate.fromMessages([
//   ["system", "You are a helpful assistant."],
//   ["human", "{question}"],
// ]);

// // 2. Same Gemini model
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash",
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // 3. Just pipe them together
// const chatbot = template.pipe(model);

// // 4. Use it the same way
// const response = await chatbot.invoke({
//   question: "Which snacks are commonly eaten with chai?",
// });

// console.log(response.content);
// // 👉 "Chai is often enjoyed with pakoras or biscuits."
// import { TextLoader } from "langchain/document_loaders/fs/text";

// const loader = new TextLoader("./test.txt"); // must run from the same folder
// const docs = await loader.load();
// console.log(docs);

// // Output: [Document(page_content='text content \n', metadata={'line_number': 0, 'source': './test.txt'})]
// import path from "path";
// import { fileURLToPath } from "url";
// import { TextLoader } from "langchain/document_loaders/fs/text";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const loader = new TextLoader(path.join(__dirname, "test.txt"));
// const docs = await loader.load();

// console.log(docs);
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// const loader = new CheerioWebBaseLoader("https://www.langchain.com/");
// const docs = await loader.load();

// console.log(docs);
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const loader = new TextLoader("./test.txt");
// const docs = await loader.load();

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 200,
// });

// const splittedDocs = await splitter.splitDocuments(docs);
// console.log(splittedDocs);
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const JAVASCRIPT_CODE = `
// function helloWorld() {
//   console.log("Chai Aur Code!");
// }
// // Call the function
// helloWorld();
// `;

// const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
//   chunkSize: 50,
//   chunkOverlap: 0,
// });

// const jsDocs = await jsSplitter.createDocuments([JAVASCRIPT_CODE]);

// console.log(jsDocs);
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// const markdownText = `
// # LangChain
// ⚡ Building applications with LLMs through composability ⚡
// ## Quick Install
// \`\`\`bash
// pip install langchain
// \`\`\`
// As an open source project in a rapidly developing field, we are extremely
// open to contributions.
// `;

// const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
//   chunkSize: 60,
//   chunkOverlap: 0,
// });

// const mdDocs = await mdSplitter.createDocuments(
//   [markdownText],
//   [{ source: "https://www.langchain.com" }]
// );
// console.log(mdDocs);
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import "dotenv/config";
// const model = new GoogleGenerativeAIEmbeddings({
//   model: "embedding-001",
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const embeddings = await model.embedDocuments([
//   "Haan ji!",
//   "kaise hain aap sabhi",
//   "swagat hai aap sabhi ka Chai aur Code mein",
// ]);

// console.log(embeddings);
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import "dotenv/config";

// // Load the document from a file
// const loader = new TextLoader("./test.txt");
// const docs = await loader.load();

// // Split the document into smaller chunks
// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 200,
// });
// const chunks = await splitter.splitDocuments(docs);

// // Generate embeddings for all the chunks using Gemini
// const embeddingsModel = new GoogleGenerativeAIEmbeddings({
//   model: "embedding-001",
//   apiKey: process.env.GEMINI_API_KEY,
// });
// const contents = [];
// for (const chunk of chunks) {
//   contents.push(chunk.pageContent);
// }
// await embeddingsModel.embedDocuments(contents);
// console.log(embeddingsModel);
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import "dotenv/config";

async function run() {
  // Step 1: Load the document and split it into chunks
  const loader = new TextLoader("./test.txt");
  const rawDocs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);

  // Step 2: Embed each chunk using Gemini embeddings
  const embeddingsModel = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Step 3: Connect to Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  // Get your Pinecone index (await!)
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

  // Step 4: Store docs in Pinecone
  const vectorStore = await PineconeStore.fromDocuments(docs, embeddingsModel, {
    pineconeIndex: index,
  });

  console.log("✅ Documents successfully indexed in Pinecone!");
  const results = await vectorStore.similaritySearch(
    "What does this document say about AI?",
    4
  );

  console.log("🔍 Search results:");
  results.forEach((doc, i) => {
    console.log(`Result ${i + 1}:`, doc.pageContent);
  });
}

run().catch(console.error);
