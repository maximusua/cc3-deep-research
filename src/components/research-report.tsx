"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResearchReportProps {
  content: string;
  isStreaming: boolean;
}

export function ResearchReport({ content, isStreaming }: ResearchReportProps) {
  return (
    <Card className="p-6 gradient-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📝</span>
        <h3 className="text-sm font-medium text-muted-foreground">
          Your Report
        </h3>
      </div>
      <ScrollArea className="max-h-[70vh]">
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-0.5 rounded-sm" />
          )}
        </article>
      </ScrollArea>
    </Card>
  );
}
