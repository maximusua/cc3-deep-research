"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { UIMessagePart } from "./research-interface";

interface ToolActivityProps {
  toolParts: UIMessagePart[];
  isLoading: boolean;
}

export function ToolActivity({ toolParts, isLoading }: ToolActivityProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔍</span>
        <h3 className="text-sm font-medium text-muted-foreground">
          Research Activity
        </h3>
        {isLoading && (
          <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary">
            Searching the web...
          </Badge>
        )}
      </div>
      <Accordion type="multiple" className="w-full">
        {toolParts.map((part, index) => {
          const isSearch = part.toolName === "searchWeb";
          const query = isSearch
            ? part.args?.query
            : part.args?.url;
          const isComplete = part.state === "output-available";
          const resultCount =
            isComplete && Array.isArray(part.result)
              ? part.result.length
              : 0;

          return (
            <AccordionItem key={index} value={`tool-${index}`}>
              <AccordionTrigger className="text-sm py-2">
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 shrink-0 text-primary" />
                  <span className="text-left truncate">
                    {isSearch ? "Searched" : "Found similar"}:{" "}
                    &ldquo;{query}&rdquo;
                  </span>
                  {isComplete ? (
                    <Badge variant="outline" className="ml-2 shrink-0 border-primary/30 text-primary">
                      {resultCount} results
                    </Badge>
                  ) : (
                    <Skeleton className="h-4 w-16 ml-2 shrink-0" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {isComplete && Array.isArray(part.result) ? (
                  <ul className="space-y-1">
                    {part.result.map((result: any, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                        >
                          {result.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Skeleton className="h-12 w-full" />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}
