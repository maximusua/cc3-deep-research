# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Docker development (primary workflow)
docker compose up --build -d    # Start dev server (http://localhost:3001)
docker compose down              # Stop
docker compose logs --tail 20    # View logs

# Local development (alternative)
npm install
npm run dev                      # Start dev server (http://localhost:3000)
npm run build                    # Production build (also runs TypeScript checks)
npm run lint                     # ESLint
```

The Docker setup maps port 3001 (host) to 3000 (container) with volume mounts for hot reload.

## Architecture

This is a **deep research agent** — a Next.js app where users enter a query, an AI agent searches the web via Exa, and streams back a markdown research report with citations.

### Backend: `/src/app/api/chat/route.ts`

The core of the app. A single POST endpoint that:
1. Receives chat messages from the frontend
2. Runs `streamText()` (Vercel AI SDK v6) with the LLM model (`google/gemini-3-flash-preview` via OpenRouter)
3. Provides two tools to the agent: `searchWeb` (Exa `searchAndContents`) and `findSimilar` (Exa `findSimilarAndContents`)
4. Agent performs 2-4 searches, analyzes results, synthesizes a report
5. Streams response back via `toUIMessageStreamResponse()`
6. Limited to 8 steps via `stopWhen: stepCountIs(8)`, 60s max duration

### Frontend: Component hierarchy

```
page.tsx (server) → ResearchInterface (client, orchestrator)
  ├── ResearchInput       — Search bar, submit/stop buttons
  ├── ToolActivity        — Accordion showing search queries + results
  ├── ResearchReport      — Streamed markdown rendered with react-markdown
  └── SourcesPanel        — Deduplicated source URLs from tool outputs
```

`ResearchInterface` uses `useChat` hook with `DefaultChatTransport` (AI SDK v6 pattern). It parses assistant message parts into text, tool invocations, and sources.

### Key libraries

- **Vercel AI SDK v6** (`ai`, `@ai-sdk/react`): Uses `inputSchema` (not `parameters`) for tools, `stopWhen` (not `maxSteps`), `DefaultChatTransport` (not `api` prop on useChat), `convertToModelMessages` returns a Promise
- **OpenRouter** (`@openrouter/ai-sdk-provider`): `createOpenRouter()` in `src/lib/openrouter.ts`
- **Exa** (`exa-js`): Singleton in `src/lib/exa.ts`, uses `searchAndContents` and `findSimilarAndContents`
- **shadcn/ui**: Components in `src/components/ui/`, configured via `components.json` (New York style, neutral base)

## Environment Variables

`.env.local` requires:
```
OPENROUTER_API_KEY=sk-or-v1-...
EXA_API_KEY=...
```

## AI SDK v6 Gotchas

- Tool definitions use `inputSchema` with Zod, not `parameters`
- `useChat` takes `transport: new DefaultChatTransport({ api: "/api/chat" })`, not `api: "/api/chat"`
- `convertToModelMessages()` is async — must be awaited
- Step limiting uses `stopWhen: stepCountIs(n)`, not `maxSteps`
- Tool parts in messages have `type: "tool-{toolName}"` with states: `input-streaming`, `input-available`, `output-available`
- Chat status is `"submitted" | "streaming" | "ready" | "error"`, not a boolean `isLoading`
