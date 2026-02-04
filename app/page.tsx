"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hammer, Sparkles, History, Send, Loader2, Wand2, Film } from "lucide-react";
import Background from "@/components/Background";
import FormatCard from "@/components/FormatCard";

interface ForgeResult {
  id: string;
  timestamp: number;
  input: string;
  insight: string;
  xThread: string[];
  newsletter: string;
  linkedin: string;
  soraPrompt: string;
}

type TabMode = "forge" | "sora";

export default function Home() {
  const [mode, setMode] = useState<TabMode>("forge");
  const [input, setInput] = useState("");
  const [soraInput, setSoraInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForgeResult | null>(null);
  const [soraResult, setSoraResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ForgeResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("forge_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (newResult: ForgeResult) => {
    const updated = [newResult, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("forge_history", JSON.stringify(updated));
  };

  const forgeIt = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 500);

    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (!res.ok) throw new Error("Forging failed");

      const data = await res.json();
      const newResult = {
        ...data,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        input,
      };

      setResult(newResult);
      saveToHistory(newResult);
      setProgress(100);
    } catch (error) {
      console.error(error);
      alert("Failed to forge content. Check your API key or input.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const enhanceSora = async () => {
    if (!soraInput.trim() || loading) return;

    setLoading(true);
    setSoraResult(null);

    try {
      const res = await fetch("/api/sora-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: soraInput }),
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const data = await res.json();
      setSoraResult(data.enhancedPrompt);
    } catch (error) {
      console.error(error);
      alert("Failed to enhance prompt. Check your API key or input.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto relative">
      <Background />

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Hammer className="text-zinc-950" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-outfit font-bold tracking-tight text-white">THE FORGE</h1>
            <p className="text-zinc-500 text-sm font-medium">Content Multiplier Engine</p>
          </div>
        </div>

        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 rounded-full hover:bg-zinc-800/50 text-zinc-400 transition-colors relative"
        >
          <History size={24} />
          {history.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
          )}
        </button>
      </header>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setMode("forge")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "forge"
              ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          <Sparkles size={18} />
          Content Forge
        </button>
        <button
          onClick={() => setMode("sora")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === "sora"
              ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          <Film size={18} />
          Sora Enhancer
        </button>
      </div>

      {mode === "forge" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Sparkles size={18} className="text-amber-500" />
                <span className="text-sm font-semibold uppercase tracking-wider">Source Content</span>
              </div>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste an article, thread, or idea to multiply..."
                className="w-full h-[400px] glass-input rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 resize-none mb-6 font-sans leading-relaxed"
              />

              <button
                onClick={forgeIt}
                disabled={loading || !input.trim()}
                className="w-full py-4 rounded-xl forge-button text-zinc-950 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>FORGING...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>FORGE IT</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {loading && mode === "forge" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden"
                >
                  <motion.div 
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-7">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-2xl p-6 border border-zinc-800/50 mb-6 bg-amber-500/5">
                  <h2 className="text-amber-500 font-outfit text-sm font-bold uppercase tracking-widest mb-2">Core Insight</h2>
                  <p className="text-xl text-white font-medium italic">"{result.insight}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormatCard title="X Thread" content={result.xThread} type="x" />
                  <FormatCard title="LinkedIn" content={result.linkedin} type="linkedin" />
                  <FormatCard title="Newsletter" content={result.newsletter} type="newsletter" />
                  <FormatCard title="Sora Prompt" content={result.soraPrompt || (result as any).videoScript || ""} type="sora" />
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-2xl border border-dashed border-zinc-800/50">
                <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                  <Hammer className="text-zinc-700" size={32} />
                </div>
                <h3 className="text-xl font-outfit font-semibold text-zinc-400 mb-2">The Forge is Cold</h3>
                <p className="text-zinc-600 max-w-xs">Enter your content on the left to fire up the furnace and start multiplying.</p>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* SORA ENHANCER MODE */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Wand2 size={18} className="text-amber-500" />
                <span className="text-sm font-semibold uppercase tracking-wider">Your Video Idea</span>
              </div>
              
              <textarea
                value={soraInput}
                onChange={(e) => setSoraInput(e.target.value)}
                placeholder="Describe your video idea in plain language... e.g. 'a lobster giving a TED talk'"
                className="w-full h-[200px] glass-input rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 resize-none mb-6 font-sans leading-relaxed"
              />

              <button
                onClick={enhanceSora}
                disabled={loading || !soraInput.trim()}
                className="w-full py-4 rounded-xl forge-button text-zinc-950 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>ENHANCING...</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    <span>ENHANCE PROMPT</span>
                  </>
                )}
              </button>
            </div>
          </section>

          <section>
            {soraResult ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-6 border border-zinc-800/50 bg-amber-500/5"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-amber-500 font-outfit text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Film size={16} />
                    Cinematic Sora Prompt
                  </h2>
                  <button
                    onClick={() => copyToClipboard(soraResult)}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-500 text-sm font-bold hover:bg-amber-500/30 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-lg text-white leading-relaxed whitespace-pre-wrap">{soraResult}</p>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card rounded-2xl border border-dashed border-zinc-800/50">
                <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-800">
                  <Film className="text-zinc-700" size={32} />
                </div>
                <h3 className="text-xl font-outfit font-semibold text-zinc-400 mb-2">Sora Enhancer</h3>
                <p className="text-zinc-600 max-w-xs">Type a rough video idea and get a detailed, cinematic, guardrail-dodging Sora 2 prompt.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* History Modal (Simple) */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-zinc-800 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-outfit font-bold text-white flex items-center gap-2">
                  <History className="text-amber-500" />
                  Recent Generations
                </h2>
                <button onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white transition-colors">Close</button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {history.length > 0 ? history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setResult(h);
                      setMode("forge");
                      setShowHistory(false);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-zinc-500">{new Date(h.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-zinc-300 line-clamp-2 text-sm">{h.input}</p>
                  </button>
                )) : (
                  <p className="text-center py-12 text-zinc-600">No history yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
