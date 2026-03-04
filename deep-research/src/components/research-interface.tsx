"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ResearchInput } from "./research-input";
import { ResearchReport } from "./research-report";
import { ToolActivity } from "./tool-activity";
import { SourcesPanel } from "./sources-panel";
import { ThemeToggle } from "./theme-toggle";

// Simplified type for tool parts extracted from message parts
export interface UIMessagePart {
  toolName: string;
  args: any;
  state: string;
  result?: any;
}

export function ResearchInterface() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  // Extract data from assistant messages
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const lastAssistant = assistantMessages[assistantMessages.length - 1];

  const toolParts: UIMessagePart[] = [];
  const textParts: string[] = [];
  const sources: { title: string; url: string }[] = [];

  if (lastAssistant) {
    for (const part of lastAssistant.parts) {
      if (part.type === "text") {
        textParts.push(part.text);
      } else if (
        part.type.startsWith("tool-") &&
        part.type !== "tool-result"
      ) {
        const toolPart = part as any;
        const toolName = part.type.replace("tool-", "");
        toolParts.push({
          toolName,
          args: toolPart.input,
          state: toolPart.state,
          result: toolPart.output,
        });

        // Extract sources from completed searchWeb or findSimilar calls
        if (
          toolPart.state === "output-available" &&
          Array.isArray(toolPart.output)
        ) {
          for (const result of toolPart.output) {
            if (result.url && result.title) {
              sources.push({ title: result.title, url: result.url });
            }
          }
        }
      }
    }
  }

  const hasResults = assistantMessages.length > 0;
  const reportText = textParts.join("");

  return (
    <div className="flex flex-col items-center min-h-screen">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-14 items-center justify-between max-w-4xl mx-auto px-4">
          <h1 className="text-xl font-semibold">Deep Research</h1>
          <ThemeToggle />
        </div>
      </header>

      <div
        className={`container max-w-4xl flex flex-col gap-6 py-8 px-4 ${!hasResults ? "flex-1 justify-center" : ""}`}
      >
        <ResearchInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onStop={stop}
          hasResults={hasResults}
        />

        {hasResults && (
          <div className="flex flex-col gap-6">
            {toolParts.length > 0 && (
              <ToolActivity toolParts={toolParts} isLoading={isLoading} />
            )}

            {reportText && (
              <ResearchReport content={reportText} isStreaming={isLoading} />
            )}

            {sources.length > 0 && !isLoading && (
              <SourcesPanel sources={sources} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
