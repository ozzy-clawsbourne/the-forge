# The Forge — Content Multiplier Engine

## Vision
One piece of content in, four formats out. Turn any idea, article, or thread into a multi-platform content arsenal in seconds.

## The Problem
Tony creates great insights, but manually reformatting for X, LinkedIn, Newsletter, and Video is time-consuming. Every hour spent reformatting is an hour not spent creating.

## The Solution
**The Forge** takes a single input and generates:
1. **X Thread** (5-7 tweets, optimized hooks)
2. **Newsletter Section** (Beehiiv-ready with intro, body, CTA)
3. **LinkedIn Post** (professional tone, paragraph breaks)
4. **Video Script** (30-60 sec, conversational, with visual cues)

---

## Tech Stack
- Next.js 15+ (App Router)
- Tailwind CSS
- Google Gemini API (gemini-3-flash-preview)
- Framer Motion (animations)
- LocalStorage (history)

## Pages

### Home (`/`)
Single-purpose landing:
- Big input textarea (paste URL, thread, or raw text)
- "Forge It" button
- Loading state with progress animation
- Results display with 4 tabbed outputs

### Output Display
Each format in its own card:
- Copy button (one-click)
- Character/word count
- Format-specific styling preview

## Design
- Continue "Cyber-Industrial" aesthetic from OZZY OS
- Dark theme, glassmorphism cards
- Outfit font
- Neon accent: Orange/Amber (to differentiate from blue X-Amplify)

## API Route

### `/api/forge`
POST body: `{ content: string }`
Response: 
```json
{
  "insight": "Core thesis extracted",
  "xThread": ["tweet1", "tweet2", ...],
  "newsletter": "Full newsletter section...",
  "linkedin": "LinkedIn post...",
  "videoScript": "Video script with [VISUAL] cues..."
}
```

## Prompt Engineering

### System Prompt
```
You are a content strategist who repurposes ideas into multiple formats.
Given a piece of content, extract the core insight and generate:

1. X THREAD (5-7 tweets)
- First tweet is the hook (must stop the scroll)
- Each tweet can stand alone but builds the narrative
- End with a CTA or takeaway
- Use line breaks for readability
- No hashtags

2. NEWSLETTER SECTION
- Catchy section header
- 2-3 paragraph body
- Include a key quote or stat callout
- End with a question or CTA to drive replies

3. LINKEDIN POST
- Professional but not stuffy
- Use paragraph breaks (2-3 sentences each)
- Include a hook in first line
- End with engagement question

4. VIDEO SCRIPT (30-60 seconds)
- Conversational tone, written for speaking aloud
- Include [VISUAL: description] cues for B-roll
- Hook in first 3 seconds
- Clear takeaway at end
```

## File Structure
```
the-forge/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       └── forge/
│   │           └── route.ts
│   ├── components/
│   │   ├── ForgeInput.tsx
│   │   ├── ForgeResults.tsx
│   │   ├── FormatCard.tsx
│   │   └── Background.tsx
│   └── lib/
│       ├── gemini.ts
│       └── prompts.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Success Criteria
- [ ] Single input generates 4 high-quality outputs
- [ ] Mobile responsive
- [ ] One-click copy for each format
- [ ] History stored in localStorage
- [ ] Build passes, deployed to Vercel
- [ ] Deployed under Ozzy's Vercel account (or Tony's)

## Deployment
1. Create GitHub repo: `ozzy-clawsbourne/the-forge`
2. Push code
3. Import to Vercel
4. Add `GEMINI_API_KEY` env var
5. Deploy
