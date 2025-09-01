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
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const prompt = [new HumanMessage("What is the capital of Rajasthan?")];

const response = await model.invoke(prompt);
console.log(response);
