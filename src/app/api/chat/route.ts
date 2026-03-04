import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { getExaClient } from "@/lib/exa";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a deep research agent. Your job is to thoroughly research a user's query by searching the web, reading results, and synthesizing a comprehensive research report.

## Your Process:
1. ANALYZE the user's query to identify key research questions and subtopics.
2. SEARCH the web using the searchWeb tool with well-crafted queries. Start broad, then get specific.
3. READ and ANALYZE the search results carefully. Identify key facts, different perspectives, and knowledge gaps.
4. PERFORM FOLLOW-UP SEARCHES to fill any gaps. Use different query phrasings to find diverse sources. You should typically perform 2-4 searches total.
5. SYNTHESIZE all findings into a comprehensive, well-structured research report.

## Report Format:
- Start with a brief executive summary (2-3 sentences)
- Use clear markdown headings (##, ###) to organize by subtopic
- Include specific facts, data points, and quotes from sources
- Cite sources inline using numbered references like [1], [2], etc.
- End with a "## Sources" section listing all referenced URLs with their titles
- Be objective and present multiple viewpoints when they exist
- Note any limitations or areas where information was scarce

## Important Rules:
- ALWAYS search before answering. Never rely solely on your training data.
- Use 2-4 search queries to ensure comprehensive coverage.
- Each search query should target a different aspect of the topic.
- Prefer recent sources when the topic involves current events or evolving fields.
- Be thorough but concise. Aim for depth over breadth.`;

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
