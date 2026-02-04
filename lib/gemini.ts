import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "dummy-key");

export const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
 // The spec said gemini-3-flash-preview but that might not be available yet or might be a typo for 1.5. Wait, I should check the spec again.
