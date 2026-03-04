"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Globe } from "lucide-react";
import type { UIMessagePart } from "./research-interface";

interface ToolActivityProps {
  toolParts: UIMessagePart[];
  isLoading: boolean;
}

export function ToolActivity({ toolParts, isLoading }: ToolActivityProps) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground/80">
          Research Activity
        </h3>
        {isLoading && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full shimmer text-white">
            Searching...
          </span>
        )}
      </div>
      <Accordion type="multiple" className="w-full">
        {toolParts.map((part, index) => {
          const isSearch = part.toolName === "searchWeb";
          const query = isSearch
            ? part.args?.query
            : part.args?.url;
          const isComplete = part.state === "result";
          const resultCount =
            isComplete && Array.isArray(part.result)
              ? part.result.length
              : 0;

          return (
            <AccordionItem key={index} value={`tool-${index}`}>
              <AccordionTrigger className="text-sm py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full badge-gradient text-[10px] font-bold shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-left truncate">
                    {isSearch ? "Searched" : "Found similar"}:{" "}
                    &ldquo;{query}&rdquo;
                  </span>
                  {isComplete ? (
                    <Badge variant="outline" className="ml-2 shrink-0 rounded-full">
                      {resultCount} results
                    </Badge>
                  ) : (
                    <Skeleton className="h-4 w-16 ml-2 shrink-0 rounded-full" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {isComplete && Array.isArray(part.result) ? (
                  <ul className="space-y-1.5 pl-7">
                    {part.result.map((result: any, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {result.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Skeleton className="h-12 w-full rounded-xl" />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
