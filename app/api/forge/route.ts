import { model } from "@/lib/gemini";
import { FORGE_PROMPT } from "@/lib/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const prompt = `${FORGE_PROMPT}\n\nCONTENT TO FORGE:\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response in case it's wrapped in markdown code blocks
    const jsonText = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Forge Error:", error);
    return NextResponse.json({ error: error.message || "Failed to forge content" }, { status: 500 });
  }
}
