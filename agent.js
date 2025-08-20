import readlineSync from "readline-sync";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAV_VeQ7g22MHUBdwi6lCBXVe7GGhg2u40",
});

// keep history as an array
const History = [];

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

async function runAgent(userProblem) {
  // push problem to history to set context
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  const sumDeclaration = {
    name: "sum",
    description: "Get the sum of 2 numbers",
    parameters: {
      type: "OBJECT",
      properties: {
        num1: {
          type: "NUMBER",
          description: "First number (ex: 10)",
        },
        num2: {
          type: "NUMBER",
          description: "Second number (ex: 20)",
        },
      },
      required: ["num1", "num2"],
    },
  };

  const PrimeDeclaration = {
    name: "prime",
    description: "Check if a number is prime",
    parameters: {
      type: "OBJECT",
      properties: {
        num: {
          type: "NUMBER",
          description: "Number to check (ex: 13)",
        },
      },
      required: ["num"],
    },
  };

  const availableTools = {
    sum,
    prime,
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      tools: [
        {
          functionDeclarations: [sumDeclaration, PrimeDeclaration],
        },
      ],
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const { name, args } = response.functionCalls[0];
    const funCall = availableTools[name];

    if (funCall) {
      const result = funCall(args);

      // store function call
      History.push({
        role: "model",
        parts: [{ functionCall: response.functionCalls[0] }],
      });

      // store result
      History.push({
        role: "model",
        parts: [{ text: `Result: ${result}` }],
      });

      console.log("Result:", result);
    }
  } else {
    History.push({
      role: "model",
      parts: [{ text: response.text }],
    });
    console.log(response.text);
  }
}

async function main() {
  const userProblem = readlineSync.question("Ask me anything--> ");
  await runAgent(userProblem);
  main(); // recursive call, but be careful with infinite loops
}

main();
