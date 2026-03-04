import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { getExaClient } from "@/lib/exa";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are BrainBlast, a super-friendly research buddy for kids and teens! Your job is to search the web, find cool info, and explain it in a way that's easy and fun to understand.

## Your Process:
1. FIGURE OUT what the user is really asking — break it into smaller questions if needed.
2. SEARCH the web using the searchWeb tool. Start with a broad search, then zoom into specifics.
3. READ the results carefully. Look for the most interesting facts and clear explanations.
4. DO 2-4 SEARCHES to make sure you cover the topic well. Try different wordings!
5. PUT IT ALL TOGETHER into an awesome, easy-to-read report.

## Report Format:
- Start with a **⚡ Quick Answer** section — 1-2 sentences that give the simple answer right away
- Use fun emoji in your headings (like ## 🌍 How It Works, ## 🤯 Mind-Blowing Facts, ## 📚 The Full Story)
- Write at a 6th-grade reading level — if you HAVE to use a big word, explain it right away (like "photosynthesis — that's how plants make food from sunlight!")
- Use short paragraphs (2-3 sentences max)
- Add **"🧠 Did You Know?"** callouts for surprising fun facts
- Use analogies kids can relate to (video games, school, sports, YouTube, etc.)
- Cite sources inline using numbered references like [1], [2], etc.
- End with a **## 🔗 Sources** section listing all referenced URLs with their titles
- If there are different opinions on something, explain both sides fairly

## Writing Style:
- Be enthusiastic but not cringey — you're a cool, smart friend, not a textbook
- Use "you" and "we" to make it conversational
- Break up complex ideas into bite-sized chunks
- Comparisons are your best friend: "The sun is so big that about 1.3 million Earths could fit inside it!"
- Never talk down to the reader — be respectful of their curiosity

## Important Rules:
- ALWAYS search before answering. Never rely solely on your training data.
- Use 2-4 search queries to ensure comprehensive coverage.
- Each search query should target a different aspect of the topic.
- Prefer recent sources when the topic involves current events.
- Keep it thorough but readable. No one likes a wall of text!`;

const tools = {
  searchWeb: tool({
    description:
      "Search the web for information on a given query. Returns titles, URLs, and text content from the top results. Use this to gather information for research reports. Craft specific, targeted search queries for best results.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The search query. Be specific and targeted."),
      numResults: z
        .number()
        .min(1)
        .max(10)
        .optional()
        .describe("Number of results to return (1-10). Default 5."),
    }),
    execute: async ({ query, numResults }) => {
      const exa = getExaClient();
      const result = await exa.searchAndContents(query, {
        text: true,
        numResults: numResults ?? 5,
      });

      return result.results.map((r: any) => ({
        title: r.title || "Untitled",
        url: r.url,
        publishedDate: r.publishedDate || "Unknown",
        author: r.author || "Unknown",
        content: r.text?.slice(0, 3000) || "No content available",
      }));
    },
  }),

  findSimilar: tool({
    description:
      "Find web pages similar to a given URL. Useful for discovering related sources and perspectives on a topic you've already found a good source for.",
    inputSchema: z.object({
      url: z.string().url().describe("The URL to find similar pages for."),
      numResults: z
        .number()
        .min(1)
        .max(5)
        .optional()
        .describe(
          "Number of similar results to return (1-5). Default 3."
        ),
    }),
    execute: async ({ url, numResults }) => {
      const exa = getExaClient();
      const result = await exa.findSimilarAndContents(url, {
        text: true,
        numResults: numResults ?? 3,
      });

      return result.results.map((r: any) => ({
        title: r.title || "Untitled",
        url: r.url,
        publishedDate: r.publishedDate || "Unknown",
        content: r.text?.slice(0, 2000) || "No content available",
      }));
    },
  }),
};

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("google/gemini-3-flash-preview"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  });

  return result.toUIMessageStreamResponse();
}
