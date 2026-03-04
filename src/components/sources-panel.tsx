"use client";

import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

interface Source {
  title: string;
  url: string;
}

interface SourcesPanelProps {
  sources: Source[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  const uniqueSources = sources.filter(
    (source, index, self) =>
      index === self.findIndex((s) => s.url === source.url)
  );

  if (uniqueSources.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <ExternalLink className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground/80">
          Sources Referenced
        </h3>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full badge-gradient">
          {uniqueSources.length}
        </span>
      </div>
      <Separator className="mb-3 opacity-30" />
      <ul className="space-y-2">
        {uniqueSources.map((source, index) => (
          <li key={index} className="flex items-start gap-2.5 group">
            <span className="flex h-5 w-5 items-center justify-center rounded-full badge-gradient text-[10px] font-bold shrink-0 mt-0.5">
              {index + 1}
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 group-hover:text-primary transition-colors break-all"
            >
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
