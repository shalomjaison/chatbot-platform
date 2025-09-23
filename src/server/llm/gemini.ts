import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

export async function geminiComplete({model="gemini-2.5-flash", systemPrompt, contents}: {model: string, systemPrompt: string, contents: Array<{role:'user'|'model'; parts:{text:string}[];}>}) {
    const windowed = contents.slice(-16);
    const response = await ai.models.generateContent({
        model,
        ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
    contents: windowed,
  });
  const text = response.text?.trim() ?? "";
  if (!text) {
    throw new Error("Gemini returned empty text");
  }
  return text;
}

