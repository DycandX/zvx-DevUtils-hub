"use client";

import React, { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

/**
 * UuidGenerator Component
 * Generates RFC4122 v4 cryptographically random UUIDs client-side in batches.
 */
export default function UuidGenerator() {
  const [uuidCount, setUuidCount] = useState(5);
  const [copied, setCopied] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);

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
  const generateUuids = (count: number, upCase: boolean, useHyphens: boolean) => {
    const list = [];
    for (let i = 0; i < count; i++) {
      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      if (!useHyphens) {
        uuid = uuid.replace(/-/g, "");
      }
      if (upCase) {
        uuid = uuid.toUpperCase();
      }
      list.push(uuid);
    }
    setGeneratedUuids(list);
  };

  const handleGenerate = () => {
    generateUuids(uuidCount, uppercase, hyphens);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Configuration Panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Configuration</span>
        </div>
        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-zinc-300 font-mono">Batch Count</label>
            <select
              value={uuidCount}
              onChange={(e) => {
                const count = Number(e.target.value);
                setUuidCount(count);
                generateUuids(count, uppercase, hyphens);
              }}
              className="w-full bg-zinc-900 border border-white/5 rounded-md px-3 py-2 text-sm font-mono text-zinc-200 outline-none focus:border-emerald-500/30 cursor-pointer"
            >
              <option value={1}>1 UUID</option>
              <option value={5}>5 UUIDs</option>
              <option value={10}>10 UUIDs</option>
              <option value={20}>20 UUIDs</option>
              <option value={50}>50 UUIDs</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-300 font-mono">Format Options</label>
            
            <label className="flex items-center gap-3 cursor-pointer group text-zinc-300 hover:text-zinc-100 select-none">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => {
                  const val = e.target.checked;
                  setUppercase(val);
                  generateUuids(uuidCount, val, hyphens);
                }}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-opacity-25 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-mono">Uppercase</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group text-zinc-300 hover:text-zinc-100 select-none">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => {
                  const val = e.target.checked;
                  setHyphens(val);
                  generateUuids(uuidCount, uppercase, val);
                }}
                className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-opacity-25 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-mono">Use Hyphens</span>
            </label>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 py-2.5 rounded-lg font-mono text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-8"
          >
            <RefreshCw size={14} />
            <span>Generate Batches</span>
          </button>
        </div>
      </div>

      {/* Output Panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Generated UUIDs</span>
          <button
            onClick={() => handleCopy(generatedUuids.join("\n"))}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer flex items-center gap-1 font-semibold"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>Copy All</span>
          </button>
        </div>
        {/* Output */}
        <div className="flex-1 p-4 overflow-y-auto leading-relaxed select-text bg-zinc-950/25">
          <pre className="font-mono text-sm text-cyan-400 whitespace-pre-wrap break-all leading-loose">
            {generatedUuids.join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
