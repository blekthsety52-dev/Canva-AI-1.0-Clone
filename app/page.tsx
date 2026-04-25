'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Code, 
  Video,
  ArrowUp,
  Sparkles,
  Loader2,
  RefreshCcw,
  Palette,
  Layers,
  FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateDesignConcept } from '@/lib/gemini';

// Types for categories
interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DesignResult {
  title: string;
  description: string;
  elements: string[];
  colors: string[];
}

const CATEGORIES: Category[] = [
  { id: 'design', label: 'Design', icon: <Plus className="w-5 h-5" /> },
  { id: 'image', label: 'Image', icon: <ImageIcon className="w-5 h-5" /> },
  { id: 'doc', label: 'Doc', icon: <FileText className="w-5 h-5" /> },
  { id: 'code', label: 'Code', icon: <Code className="w-5 h-5" /> },
  { id: 'video', label: 'Video clip', icon: <Video className="w-5 h-5" /> },
];

export default function CanvaAI() {
  const [prompt, setPrompt] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DesignResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    
    try {
      const data = await generateDesignConcept(prompt, activeCategory);
      setResult(data);
    } catch (error) {
      console.error("Generation failed", error);
      // Fallback
      setResult({
        title: "Creative Concept",
        description: "We had a bit of trouble with the AI, but here's a fresh starting point for you.",
        elements: ["Vibrant textures", "Golden ratio layout", "Serif headers"],
        colors: ["#7D2AE8", "#00C4CC", "#FFFFFF"]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex flex-col items-center selection:bg-purple-500/30 selection:text-white pb-20 relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#18181b] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-outfit font-semibold text-sm">Canva AI 2.0 is coming soon with more magic!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className="w-full h-16 px-8 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-outfit font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="hidden md:inline">Studio AI</span>
          </div>
          <div className="hidden md:block h-4 w-[1px] bg-white/20"></div>
          <button 
            onClick={() => setShowToast(true)}
            className="hidden md:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <FileSearch className="w-4 h-4" />
            Sneak Peek
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white">
            Sign in
          </button>
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform">
            Start trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={cn(
        "w-full flex flex-col items-center px-6 transition-all duration-1000 z-10",
        result || isGenerating ? "pt-12" : "flex-1 justify-center translate-y-[-24px]"
      )}>
        <motion.div
          animate={result || isGenerating ? { scale: 0.8, opacity: 0.6 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-7xl font-outfit font-bold tracking-tighter leading-tight text-white mb-4">
            What will we <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">design</span> today?
          </h1>
        </motion.div>

        {/* Input Container */}
        <div className="w-full max-w-3xl relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#18181b] rounded-2xl border border-white/10 p-3 shadow-2xl transition-all focus-within:border-white/20">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 px-4 py-2">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Describe your idea, and I'll bring it to life..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl text-white placeholder-white/30 resize-none overflow-hidden min-h-[44px]"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pr-2">
              <div className="flex items-center gap-1">
                <button className="p-2.5 rounded-xl text-white/50 hover:bg-white/5 transition-colors" title="Upload">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl text-white/50 hover:bg-white/5 transition-colors" title="Voice">
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-12 h-12 flex items-center justify-center text-purple-400"
                    >
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.button
                      key="button"
                      disabled={!prompt.trim()}
                      onClick={handleSubmit}
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-all",
                        prompt.trim() 
                          ? "bg-white text-black hover:bg-neutral-200 shadow-lg" 
                          : "bg-white/5 text-white/20 cursor-not-allowed"
                      )}
                    >
                      <ArrowUp className="w-6 h-6" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {!result && !isGenerating && (
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all hover:-translate-y-1",
                    activeCategory === cat.id
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className={cn(
                    "transition-colors",
                    idx === 0 ? "text-purple-400" :
                    idx === 1 ? "text-indigo-400" :
                    idx === 2 ? "text-emerald-400" :
                    idx === 3 ? "text-amber-400" : "text-rose-400"
                  )}>
                    {idx === 0 ? "✨" : idx === 1 ? "🖼️" : idx === 2 ? "📄" : idx === 3 ? "💻" : "🎬"}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[1, 2].map((i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-8 border border-white/10 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-1/3 mb-6" />
                  <div className="space-y-3 mb-8">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {result && !isGenerating && (
            <motion.div
              key="result-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Card */}
                <div className="md:col-span-2 bg-[#18181b] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="aspect-[16/9] bg-gradient-to-br from-indigo-900 to-purple-900 p-12 flex flex-col justify-end text-white relative">
                    <div className="absolute top-8 left-8 flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      AI Synthesized
                    </div>
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-5xl md:text-6xl font-outfit font-black mb-4 tracking-tighter"
                    >
                      {result.title}
                    </motion.h2>
                    <p className="text-white/60 text-lg max-w-lg leading-relaxed">{result.description}</p>
                  </div>
                  <div className="p-8 px-10 bg-black/20 backdrop-blur-sm border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {result.colors.map((color, idx) => (
                          <div 
                            key={idx} 
                            style={{ backgroundColor: color }} 
                            className="w-12 h-12 rounded-full border-[6px] border-[#18181b] shadow-xl"
                            title={color}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setResult(null)}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        <RefreshCcw className="w-4 h-4" />
                        New Concept
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                  <div className="bg-[#18181b] rounded-3xl p-8 border border-white/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 text-indigo-400">
                      <Layers className="w-5 h-5" />
                      <h3 className="font-outfit font-bold text-lg text-white">Visual Assets</h3>
                    </div>
                    <ul className="space-y-4">
                      {result.elements.map((el, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-white/50 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 group-hover:scale-150 transition-transform" />
                          {el}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-[#18181b] to-black rounded-3xl p-8 border border-white/5 overflow-hidden relative group cursor-pointer hover:border-white/20 transition-all">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500 opacity-10 blur-3xl rounded-full" />
                    <div className="flex items-center gap-3 mb-6">
                      <Palette className="w-5 h-5 text-pink-400" />
                      <h3 className="font-outfit font-bold text-lg">Palette</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {result.colors.map((color, idx) => (
                        <div key={idx} className="space-y-3">
                          <div style={{ backgroundColor: color }} className="aspect-square rounded-2xl shadow-inner border border-white/10" />
                          <p className="text-[10px] font-mono opacity-30 text-center tracking-tighter">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5">
                  <Plus className="w-5 h-5" />
                  Customize Design
                </button>
                <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 active:scale-95 transition-all">
                  <span className="text-indigo-400">⚡</span>
                  Quick Export
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-black/40 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3 text-sm text-white/50 mb-4 md:mb-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>This is Studio AI 1.0. A faster, smarter 2.0 is coming soon.</span>
          <a href="https://www.canva.com/canva-ai/" className="text-white/80 underline underline-offset-4 hover:text-white transition-colors">Learn more</a>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-neutral-800 flex items-center justify-center text-[10px] font-bold">JD</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-neutral-700 flex items-center justify-center text-[10px] font-bold">AS</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-neutral-600 flex items-center justify-center text-[10px] font-bold">+12</div>
          </div>
          <div className="hidden sm:block text-xs text-white/30 font-mono tracking-widest">v1.1.2-STABLE</div>
        </div>
      </footer>
    </main>

  );
}

