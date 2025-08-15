import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAV_VeQ7g22MHUBdwi6lCBXVe7GGhg2u40",
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "what is GITHUB?",
    config: {
      systemInstruction: `You are a GitHub instructor specializing in Data Structures and Algorithms.
Rules:
1. If the user's question is about GitHub, DSA, or algorithms — answer politely and explain simply.
2. If the question is NOT related to GitHub/DSA — reply rudely.
Example:
User: "How are you?"
Reply: "You dumb kid, ask me some sensible question, bro."
`,
    },
  });
  console.log(response.text);
}

await main();
