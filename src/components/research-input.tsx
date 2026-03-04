"use client";

import { Button } from "@/components/ui/button";
import { Search, Square, Sparkles } from "lucide-react";

interface ResearchInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text?: string) => void;
  isLoading: boolean;
  onStop: () => void;
  hasResults: boolean;
}

const suggestions = [
  "AI impact on climate change",
  "Best productivity frameworks 2026",
  "How do mRNA vaccines work?",
  "History of internet culture",
];

export function ResearchInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  hasResults,
}: ResearchInputProps) {
  return (
    <div
      className={`flex flex-col items-center gap-5 ${!hasResults ? "py-12" : ""}`}
    >
      {!hasResults && (
        <div className="text-center mb-4">
          <h2 className="text-5xl font-extrabold tracking-tight mb-3 gradient-text">
            Deep Research
          </h2>
          <p className="text-muted-foreground text-lg">
            Drop a topic, get the full picture
          </p>
        </div>
      )}
      <div className="flex w-full max-w-2xl gap-3">
        <div className="flex-1 relative glow-ring rounded-full glass">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) onSubmit();
            }}
            placeholder="What are you curious about?"
            className="w-full h-12 pl-11 pr-4 bg-transparent rounded-full text-base outline-none placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
        </div>
        {isLoading ? (
          <Button
            onClick={onStop}
            variant="destructive"
            size="lg"
            className="h-12 px-6 rounded-full"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        ) : (
          <button
            onClick={() => onSubmit()}
            className="h-12 px-6 rounded-full btn-gradient font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Research
          </button>
        )}
      </div>

      {/* Suggestion chips */}
      {!hasResults && (
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSubmit(s)}
              className="chip text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground cursor-pointer bg-transparent"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
