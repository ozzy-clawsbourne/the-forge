import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "dummy-key");

const MODEL_NAME = "gemini-3-flash";

export const model = genAI.getGenerativeModel({ model: MODEL_NAME });
