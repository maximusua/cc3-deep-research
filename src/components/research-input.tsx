"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Square } from "lucide-react";

interface ResearchInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onStop: () => void;
  hasResults: boolean;
}

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
      className={`flex flex-col items-center gap-4 ${!hasResults ? "py-20" : ""}`}
    >
      {!hasResults && (
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold tracking-tight mb-2">
            Deep Research Agent
          </h2>
          <p className="text-muted-foreground text-lg">
            Enter a topic and get a comprehensive, source-backed research
            report.
          </p>
        </div>
      )}
      <div className="flex w-full max-w-2xl gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) onSubmit();
          }}
          placeholder="What would you like to research?"
          className="h-12 text-base"
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            onClick={onStop}
            variant="destructive"
            size="lg"
            className="h-12 px-6"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        ) : (
          <Button onClick={onSubmit} size="lg" className="h-12 px-6">
            <Search className="h-4 w-4 mr-2" />
            Research
          </Button>
        )}
      </div>
    </div>
  );
}
