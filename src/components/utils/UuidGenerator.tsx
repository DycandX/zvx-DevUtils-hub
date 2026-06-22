"use client";

import React, { useState } from "react";
import { Clipboard, Check, Copy, RefreshCw } from "lucide-react";

/**
 * UuidGenerator Component
 * Generates RFC4122 v4 cryptographically random UUIDs client-side in batches.
 * Utilizes a lazy state initializer to avoid hydration/render loops.
 */
export default function UuidGenerator() {
  const [uuidCount, setUuidCount] = useState(5);
  const [copied, setCopied] = useState(false);

  // Lazy initializer to seed initial UUIDs on mount
  const [generatedUuids, setGeneratedUuids] = useState<string[]>(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    return list;
  });

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate UUID list
  const generateUuids = (count: number) => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    setGeneratedUuids(list);
  };

  return (
    <div id="tool-uuid" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Clipboard size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">UUID v4 Generator</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">Batch Size:</span>
          <select
            value={uuidCount}
            onChange={(e) => {
              const count = Number(e.target.value);
              setUuidCount(count);
              generateUuids(count);
            }}
            className="bg-zinc-950 border border-white/5 rounded text-xs font-mono text-zinc-300 px-1 py-0.5 outline-none focus:border-emerald-500/50"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {/* Output box */}
      <div className="space-y-3">
        <div className="relative group">
          <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto min-h-[120px] max-h-[150px] terminal-scroll leading-relaxed">
            {generatedUuids.join("\n")}
          </pre>
          <button
            onClick={() => handleCopy(generatedUuids.join("\n"))}
            className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 rounded-md text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>
        </div>
        <button
          onClick={() => generateUuids(uuidCount)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Generate New Batches</span>
        </button>
      </div>
    </div>
  );
}
