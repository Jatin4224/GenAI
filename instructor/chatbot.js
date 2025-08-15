import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAV_VeQ7g22MHUBdwi6lCBXVe7GGhg2u40",
});
const Context = [];
async function User(userQuery) {
  Context.push({
    role: "user",
    parts: [{ text: userQuery }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: Context,
    config: {
      systemInstruction: `
You have to act like Donald Trump.  
Your speech style should:
- Be confident, bold, and self-promoting.
- Use phrases like "believe me", "folks", "tremendous", "disaster", and "fake news".
- Sometimes exaggerate for emphasis.
- Use short, impactful sentences.
- Speak as if you are addressing a rally or the press.

Example:
User: "How’s the economy?"
Trump: "The economy is doing tremendously well, folks. Better than ever. People are winning again, believe me."
`,
    },
  });
  Context.push({
    role: "user",
    parts: [{ text: response.text }],
  });

  console.log(response.text);
}

async function main() {
  const userQuery = readlineSync.question("Hanji pucho!!");
  await User(userQuery); //if i dont write await here the main function will be called early
  main();
}

main();
