"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface FormatCardProps {
  title: string;
  content: string | string[];
  type: "x" | "newsletter" | "facebook" | "sora";
}

export default function FormatCard({ title, content, type }: FormatCardProps) {
  const [copied, setCopied] = useState(false);

  const fullContent = Array.isArray(content) ? content.join("\n\n") : content;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWordCount = (str: string) => str.trim().split(/\s+/).length;
  const getCharCount = (str: string) => str.length;

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col h-full border border-zinc-800/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-outfit text-xl font-semibold text-amber-500">{title}</h3>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {Array.isArray(content) ? (
          <div className="space-y-4">
            {content.map((tweet, i) => (
              <div key={i} className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/30 text-sm leading-relaxed whitespace-pre-wrap">
                {tweet}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
            {content}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex gap-4 text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
        <span>{getWordCount(fullContent)} Words</span>
        <span>{getCharCount(fullContent)} Characters</span>
        <span className="ml-auto text-amber-500/50">{type}</span>
      </div>
    </div>
  );
}
