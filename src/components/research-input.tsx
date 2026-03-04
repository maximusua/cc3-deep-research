"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, Square, Sparkles } from "lucide-react";

const SUGGESTED_TOPICS = [
  { emoji: "🌌", text: "Why is the sky blue?" },
  { emoji: "🕳️", text: "How do black holes work?" },
  { emoji: "🎮", text: "History of video games" },
  { emoji: "🐙", text: "Coolest animals in the ocean" },
  { emoji: "🤖", text: "How does AI work?" },
  { emoji: "🚀", text: "Space exploration in 2025" },
  { emoji: "🦕", text: "What killed the dinosaurs?" },
  { emoji: "🧬", text: "How does DNA work?" },
];

interface ResearchInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (text?: string) => void;
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
      className={`flex flex-col items-center gap-4 ${!hasResults ? "py-16" : ""}`}
    >
      {!hasResults && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              BrainBlast
            </h2>
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <p className="text-muted-foreground text-lg">
            Your AI homework buddy — ask anything and get the answers!
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
          placeholder="What are you curious about? 🤔"
          className="h-12 text-base rounded-full px-5"
          disabled={isLoading}
        />
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
          <Button
            onClick={() => onSubmit()}
            size="lg"
            className="h-12 px-6 rounded-full bg-gradient-animated text-white border-0 hover:opacity-90"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Blast Off!
          </Button>
        )}
      </div>
      {!hasResults && (
        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic.text}
              onClick={() => onSubmit(topic.text)}
              disabled={isLoading}
              className="topic-chip inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{topic.emoji}</span>
              <span>{topic.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
