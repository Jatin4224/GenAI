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
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
// Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});
// Create a prompt template with different roles
const template = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Answer the question based on the context below.
     If the question cannot be answered using the information provided,
     just reply with "I don't know".`,
  ],
  ["human", "Context: {context}"],
  ["human", "Question: {question}"],
]);

// Fill dynamic data (context + question)
const prompt = await template.invoke({
  context: `Chai is one of the most loved beverages in India.
  It is made by brewing black tea leaves with milk, water, and spices like ginger and cardamom.
  Many people enjoy chai in the evening with snacks such as pakoras or biscuits.`,

  question: "tell me the snacks name?",
});

// Send the structured prompt to Gemini
const response = await model.invoke(prompt);

console.log(response.content);
