"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResearchReportProps {
  content: string;
  isStreaming: boolean;
}

export function ResearchReport({ content, isStreaming }: ResearchReportProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <ScrollArea className="max-h-[70vh]">
        <article className="prose prose-neutral dark:prose-invert prose-genz max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block w-2 h-5 shimmer rounded-sm ml-0.5" />
          )}
        </article>
      </ScrollArea>
    </div>
  );
}
