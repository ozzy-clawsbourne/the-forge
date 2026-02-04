import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

const SORA_ENHANCE_PROMPT = `You are a cinematic prompt engineer specializing in AI video generation.

Your job is to transform rough video ideas into detailed, visually stunning Sora 2 prompts.

STYLE GUIDELINES:
- Cinematic and specific visual descriptions
- Include camera movements: dolly, pan, tracking shot, crane, push-in, pull-out, handheld, steadicam
- Specify lighting: tungsten, neon, golden hour, harsh overhead, soft diffused, rim lighting
- Add film aesthetic: 35mm grain, anamorphic lens flares, shallow DOF, bokeh
- Describe motion and action clearly
- Mood and atmosphere are essential
- Be creative, slightly irreverent, visually striking
- Use metaphors and creative framing for edgy concepts (guardrail dodging)
- NO dialogue, just visual description
- Length: 50-150 words

EXAMPLE:
Input: "a lobster giving a TED talk"
Output: "A hyperrealistic crimson crustacean stands at a sleek black podium, tiny wireless mic clipped to its shell. Soft spotlight from above, audience silhouettes in bokeh. Camera slowly pushes in as it gestures dramatically with massive claws. TED logo glows red behind. Cinematic 35mm film grain, shallow depth of field. The crowd erupts in silent applause as it drops a metaphorical truth bomb. Corporate conference energy meets absurdist theater."

Now transform this rough idea into a cinematic Sora 2 prompt:`;

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const prompt = `${SORA_ENHANCE_PROMPT}\n\n"${idea}"\n\nRespond with ONLY the enhanced prompt, no preamble or explanation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedPrompt = response.text().trim();

    return NextResponse.json({ enhancedPrompt });
  } catch (error: any) {
    console.error("Sora Enhance Error:", error);
    return NextResponse.json({ error: error.message || "Failed to enhance prompt" }, { status: 500 });
  }
}
