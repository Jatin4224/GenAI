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
import "dotenv/config";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// 1. Define the LLM
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// 2. Define the Template
const template = PromptTemplate.fromTemplate(`Answer the question based on the
context below. If the question cannot be answered using the information
provided, answer with "I don't know".

Context: {context}
Question: {question}
Answer:`);

async function main() {
  // 3. Fill the Template
  const prompt = await template.format({
    context: `Chai is one of the most loved beverages in India.
    It is made by brewing black tea leaves with milk, water,
    and spices like ginger and cardamom.
    Many people enjoy chai in the evening with snacks
    such as pakoras or biscuits.`,

    question: `Which spice is commonly added to chai for flavor?`,
  });

  // 4. Invoke the Model
  const response = await model.invoke(prompt);

  console.log("Gemini says:", response.content);
}

main();
