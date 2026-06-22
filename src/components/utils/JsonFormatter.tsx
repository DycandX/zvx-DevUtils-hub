"use client";

import React, { useState } from "react";
import { FileJson, Check, Copy, AlertCircle } from "lucide-react";

interface JsonFormatterProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
}

/**
 * JsonFormatter Component
 * Validates, formats (with configurable indentation), and minifies JSON strings.
 * Built with derived rendering logic to prevent state synchronization issues.
 */
export default function JsonFormatter({ jsonInput, setJsonInput }: JsonFormatterProps) {
  const [jsonSpaces, setJsonSpaces] = useState<number | "minify">(2);
  const [copied, setCopied] = useState(false);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derived state: compute formatted output or error dynamically on render
  let jsonOutput = "";
  let jsonError = "";
  if (jsonInput.trim()) {
    try {
      const parsed = JSON.parse(jsonInput);
      if (jsonSpaces === "minify") {
        jsonOutput = JSON.stringify(parsed);
      } else {
        jsonOutput = JSON.stringify(parsed, null, jsonSpaces);
      }
    } catch (err) {
      jsonError = err instanceof Error ? err.message : "Invalid JSON syntax.";
    }
  }

  return (
    <div id="tool-json" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <FileJson size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">JSON Formatter &amp; Validator</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Format, Minify &amp; Lint</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input box & controls */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Input Raw String</label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"name": "zvx-hub", "active": true}'
              rows={8}
              className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setJsonSpaces(2)}
              className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                jsonSpaces === 2 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              Format (2 Spaces)
            </button>
            <button
              onClick={() => setJsonSpaces(4)}
              className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                jsonSpaces === 4 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              Format (4 Spaces)
            </button>
            <button
              onClick={() => setJsonSpaces("minify")}
              className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${
                jsonSpaces === "minify" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              }`}
            >
              Minify
            </button>
            <button
              onClick={() => {
                setJsonInput("");
                setJsonSpaces(2);
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded font-mono text-xs font-bold transition-all ml-auto cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output box with validation check */}
        <div className="flex flex-col">
          <span className="text-xs font-mono text-zinc-400 mb-1">Output Formatted Code</span>
          {jsonError ? (
            <div className="flex-1 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg p-4 font-mono text-xs space-y-2 flex flex-col justify-center items-center text-center">
              <AlertCircle size={24} className="text-red-400 mb-1" />
              <span className="font-bold">JSON SYNTAX VALIDATION ERROR</span>
              <p className="max-w-md opacity-85 leading-relaxed">{jsonError}</p>
            </div>
          ) : (
            <div className="flex-1 relative group">
              <pre className="w-full h-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto max-h-[220px] terminal-scroll">
                {jsonOutput || <span className="opacity-30 italic">No output yet. Enter valid JSON left.</span>}
              </pre>
              {jsonOutput && (
                <button
                  onClick={() => handleCopy(jsonOutput)}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
