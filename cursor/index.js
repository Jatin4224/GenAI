// import readlineSync from "readline-sync";
// import { GoogleGenAI } from "@google/genai";
// import { exec } from "child_process";
// import { promisify } from "util";
// import os from "os";

// const platform = os.platform();
// const asyncExecute = promisify(exec);
// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyAV_VeQ7g22MHUBdwi6lCBXVe7GGhg2u40",
// });

// // keep history as an array
// const History = [];

// //tool create which executes any terminal /shell command
// async function executeCommand({ command }) {
//   try {
//     const { stdout, stderr } = await asyncExecute(command);
//     //i want to do things stepwise step i dont want to my files be created before the folder
//     //so i use promise-> so i need to install npm i util
//     if (stderr) return `Error: ${stderr}`;
//     return `Success: ${stdout} || Task executed completely`;
//   } catch (error) {
//     return `Error: ${error}`;
//   }
// }

// //i have to tell llm model wahat tools avlble same like tool_map
// const executeCommandDeclaration = {
//   name: "executeCommand",
//   description:
//     "Execute a single terminal/shell command.A command can be to create a folder. file, write on a file, edit the file or delete the file",
//   parameters: {
//     type: "OBJECT",
//     properties: {
//       command: {
//         type: "STRING",
//         description:
//           "It will be a single terminal comman. Example:'mkdir todoApp",
//       },
//     },
//     required: ["command"],
//   },
// };

// async function runAgent(userProblem) {
//   History.push({
//     role: "user",
//     parts: [{ text: userProblem }],
//   });

//   const availableTools = { executeCommand };

//   let keepBuilding = true;

//   while (keepBuilding) {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: History,
//       config: {
//         systemInstruction: `
//           You are a website builder expert.
//           Build the frontend step by step using executeCommand.
//           Stop when the full frontend (html, css, js) is ready.
//         `,
//         tools: [{ functionDeclarations: [executeCommandDeclaration] }],
//       },
//     });

//     if (response.functionCalls && response.functionCalls.length > 0) {
//       const { name, args } = response.functionCalls[0];
//       const funCall = availableTools[name];

//       if (funCall) {
//         const result = await funCall(args);

//         // store tool call + result
//         History.push({
//           role: "model",
//           parts: [{ functionCall: response.functionCalls[0] }],
//         });
//         History.push({
//           role: "model",
//           parts: [{ text: `Result: ${result}` }],
//         });

//         console.log("Result:", result);
//       }
//     } else {
//       // if model responds with plain text instead of function call → stop loop
//       console.log(response.text);
//       keepBuilding = false;
//     }
//   }
// }

// async function main() {
//   console.log("I am a cursor:Let's create a website");
//   const userProblem = readlineSync.question("Ask me anything--> ");
//   await runAgent(userProblem);
//   main(); // recursive call, but be careful with infinite loops
// }

// main();
import readlineSync from "readline-sync";
import { GoogleGenAI } from "@google/genai";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const platform = os.platform();
const execAsync = promisify(exec);

// ---- SAFER, CROSS-PLATFORM TOOLS ----
async function makeDir({ dir }) {
  try {
    const abs = path.resolve(dir);
    await fs.mkdir(abs, { recursive: true });
    return `OK: created dir ${abs}`;
  } catch (e) {
    return `ERROR(makeDir): ${e.message}`;
  }
}

async function writeFileTool({ file, content }) {
  try {
    const abs = path.resolve(file);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content ?? "", "utf8");
    return `OK: wrote file ${abs} (${content?.length ?? 0} chars)`;
  } catch (e) {
    return `ERROR(writeFile): ${e.message}`;
  }
}

// Keep a shell tool for rare needs (npm init, etc.)
async function runCommand({ command, cwd }) {
  try {
    const opts = cwd ? { cwd } : {};
    const { stdout, stderr } = await execAsync(command, opts);
    if (stderr && stderr.trim()) return `ERROR(runCommand): ${stderr}`;
    return `OK(runCommand): ${stdout}`;
  } catch (e) {
    return `ERROR(runCommand): ${e.message}`;
  }
}

// ---- TOOL DECLARATIONS FOR GEMINI ----
const toolDeclarations = [
  {
    name: "makeDir",
    description: "Create a directory (recursively).",
    parameters: {
      type: "OBJECT",
      properties: {
        dir: {
          type: "STRING",
          description: "Directory path to create, e.g. 'todoApp'.",
        },
      },
      required: ["dir"],
    },
  },
  {
    name: "writeFileTool",
    description:
      "Write text content to a file (creates parent directories automatically).",
    parameters: {
      type: "OBJECT",
      properties: {
        file: {
          type: "STRING",
          description: "Path of the file to write, e.g. 'todoApp/index.html'.",
        },
        content: {
          type: "STRING",
          description: "Full file contents as a string.",
        },
      },
      required: ["file", "content"],
    },
  },
  {
    name: "runCommand",
    description:
      "Run a shell/terminal command (use only when necessary, prefer writeFileTool/makeDir).",
    parameters: {
      type: "OBJECT",
      properties: {
        command: {
          type: "STRING",
          description: "A single shell command.",
        },
        cwd: {
          type: "STRING",
          description: "Optional working directory to run the command in.",
        },
      },
      required: ["command"],
    },
  },
];

// ---- AGENT LOOP ----
const ai = new GoogleGenAI({
  apiKey: "AIzaSyAV_VeQ7g22MHUBdwi6lCBXVe7GGhg2u40", // replace
});

const History = [];

async function runAgent(userInstruction) {
  History.push({ role: "user", parts: [{ text: userInstruction }] });

  const tools = { makeDir, writeFileTool, runCommand };

  while (true) {
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        // Be explicit: build the whole frontend, step-by-step, using *only* our safe tools.
        systemInstruction: `
You are a website builder expert.
OS: ${platform}

Your job:
1) Understand the user's website type.
2) Create a project folder.
3) Create files: index.html, style.css, script.js (and more if useful).
4) Fill those files with production-ready starter code.
5) Use ONLY these tools: makeDir, writeFileTool, and runCommand (avoid runCommand unless necessary).
6) Make one tool call at a time, then wait for the result.
7) When everything is done, reply with plain text summary and STOP calling tools.

Conventions:
- Use relative paths like "myApp/index.html".
- Always create the folder first with makeDir before writing files inside it.
- After writing all files and content, finish with a plain text message like: "All done. Open myApp/index.html".
        `,
        tools: [{ functionDeclarations: toolDeclarations }],
      },
    });

    // Tool call?
    if (resp.functionCalls && resp.functionCalls.length > 0) {
      const { name, args } = resp.functionCalls[0];
      const fn = tools[name];
      if (!fn) {
        const err = `No such tool: ${name}`;
        History.push({ role: "model", parts: [{ text: err }] });
        console.log(err);
        break;
      }

      const result = await fn(args);

      // Log tool call and result back into history
      History.push({
        role: "model",
        parts: [{ functionCall: resp.functionCalls[0] }],
      });
      History.push({
        role: "model",
        parts: [{ text: `Result: ${result}` }],
      });

      console.log(result);
      continue; // ask model for next step
    }

    // No tool call: model is done; print its message and stop.
    if (resp.text) {
      History.push({ role: "model", parts: [{ text: resp.text }] });
      console.log(resp.text);
    }
    break;
  }
}

// ---- MAIN REPL ----
async function main() {
  console.log("I am a cursor: Let's create a website");
  while (true) {
    const q = readlineSync.question("Ask me anything--> ");
    // basic exit
    if (q.trim().toLowerCase() === "exit") {
      console.log("Bye!");
      process.exit(0);
    }
    await runAgent(q);
  }
}

main();
