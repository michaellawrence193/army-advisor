# ⚔️ WH40k Army Advisor

A Warhammer 40,000 10th Edition army advisor powered by Claude AI. Select your faction, describe your playstyle and budget, and get a personalized army list with unit recommendations, synergies, and strategic tips. Ask follow-up questions in a built-in chat interface.

**Live demo:** (https://army-advisor.vercel.app/)

---

## Features

- **28 factions** covering all Imperium, Chaos, and Xenos armies
- **Personalized advice** based on experience level, playstyle, budget, and points limit
- **AI-powered responses** with unit lists, synergies, beginner tips, and competitive tips
- **Follow-up chat** — ask questions after your initial advice to dig deeper
- **Faction filter & search** — quickly find any army in the list
- **Fully deployed** — live on Vercel with a secure serverless API proxy

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Build tool | Vite |
| Deployment | Vercel |
| API proxy | Vercel Serverless Functions |

---

## How It Works

1. User selects a faction from the full 10th Edition roster
2. User fills out a playstyle form — experience, preferred style, budget, and points limit
3. The app sends a structured prompt to Claude via a secure Vercel serverless function
4. Claude returns a detailed army recommendation with unit lists and strategy tips
5. User can ask follow-up questions in a chat interface with full conversation history

The API key is stored as a Vercel environment variable and never exposed to the browser — all requests are proxied through a serverless function in `api/chat.ts`.

---

## Running Locally

**Prerequisites:** Node.js 18+, an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/army-advisor.git
cd army-advisor

# Install dependencies
npm install

# Add your API key to vite.config.ts (local dev only)
# Replace the empty apiKey string with your key

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** For local development the API key is hardcoded into `vite.config.ts` which is excluded from git. For production the key is stored as a Vercel environment variable.

---

## Project Structure
army-advisor/
├── api/
│   └── chat.ts          # Vercel serverless function — secure API proxy
├── src/
│   ├── components/
│   │   ├── FactionPicker.tsx   # Step 1 — faction selection grid
│   │   ├── PlaystyleForm.tsx   # Step 2 — playstyle questionnaire
│   │   └── AdvicePanel.tsx     # Step 3 — AI response + follow-up chat
│   ├── lib/
│   │   ├── claude.ts           # Anthropic API integration
│   │   └── factions.ts         # Faction data and types
│   ├── App.tsx                 # Root component and step state
│   ├── index.css               # Global styles
│   └── main.tsx                # App entry point
└── vercel.json                 # Vercel deployment config

---

## Disclaimer

This app uses AI-generated advice for entertainment and hobby planning purposes. Always verify points costs against the official Warhammer Community points documents and your local game store's house rules. Warhammer 40,000 is © Games Workshop.
