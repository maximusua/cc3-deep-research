"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔗</span>
        <h3 className="text-sm font-medium text-muted-foreground">
          Where We Found This
        </h3>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {uniqueSources.length}
        </Badge>
      </div>
      <Separator className="mb-3" />
      <ul className="space-y-2">
        {uniqueSources.map((source, index) => (
          <li key={index} className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5 shrink-0 border-primary/30 text-primary">
              {index + 1}
            </Badge>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline break-all"
            >
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
