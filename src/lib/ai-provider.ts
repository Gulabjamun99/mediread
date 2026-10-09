import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import os from "os";

export interface ChatCompletionResult {
  choices: Array<{ message: { content: string } }>;
}
export interface ChatMessage {
  role: string;
  content: string | object[];
}
export interface CreateOptions {
  messages: ChatMessage[];
  thinking?: { type: string };
}
export interface VisionOptions {
  messages: ChatMessage[];
  thinking?: { type: string };
}
export interface AIInstance {
  chat: {
    completions: {
      create: (opts: CreateOptions) => Promise<ChatCompletionResult>;
      createVision: (opts: VisionOptions) => Promise<ChatCompletionResult>;
    };
  };
}

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.0-flash";

function createGeminiInstance(apiKey: string): AIInstance {
  async function callGemini(messages: ChatMessage[]): Promise<ChatCompletionResult> {
    const contents: any[] = [];
    for (const msg of messages) {
      if (typeof msg.content === "string") {
        contents.push({ role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.content }] });
      } else if (Array.isArray(msg.content)) {
        const parts: any[] = [];
        for (const part of msg.content as any[]) {
          if (part.type === "text" && part.text) {
            parts.push({ text: part.text });
          } else if (part.type === "image_url" && part.image_url?.url) {
            const m = part.image_url.url.match(/^data:([^;]+);base64,(.+)$/s);
            if (m) parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
          } else if (part.type === "file_url" && part.file_url?.url) {
            const m = part.file_url.url.match(/^data:([^;]+);base64,(.+)$/s);
            if (m) parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
          }
        }
        contents.push({ role: "user", parts });
      }
    }
    const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const body = { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Gemini error (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
    return { choices: [{ message: { content: text } }] };
  }
  return {
    chat: {
      completions: {
        create: (opts: CreateOptions) => callGemini(opts.messages),
        createVision: (opts: VisionOptions) => callGemini(opts.messages),
      },
    },
  };
}

interface ZaiConfig {
  baseUrl: string;
  apiKey: string;
  chatId?: string;
  userId?: string;
  token?: string;
}

export async function createAi(): Promise<AIInstance> {
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "your_gemini_key_here" && key.length > 5) {
    console.log("[AI] Using Gemini");
    return createGeminiInstance(key);
  }
  const homeDir = os.homedir();
  const configPaths = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(homeDir, ".z-ai-config"),
    "/etc/.z-ai-config",
  ];
  for (const filePath of configPaths) {
    try {
      const configStr = fs.readFileSync(filePath, "utf-8");
      const config = JSON.parse(configStr);
      if (config.baseUrl && config.apiKey) {
        console.log("[AI] Using Z.AI");
        const zai = new ZAI(config);
        return zai as unknown as AIInstance;
      }
    } catch {}
  }
  throw new Error("Set GEMINI_API_KEY env var. Get free key: https://aistudio.google.com/apikey");
}
