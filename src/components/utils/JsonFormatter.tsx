"use client";

import React, { useState } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";

interface JsonFormatterProps {
  jsonInput: string;
  setJsonInput: (val: string) => void;
}

/**
 * JsonFormatter Component
 * Validates, formats, and minifies JSON strings.
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

  // Clipboard paste helper
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJsonInput(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  // Derived state calculations
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">JSON Raw Input</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => {
              setJsonInput("");
              setJsonSpaces(2);
            }}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Input box */}
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"name": "zvx-hub", "active": true}'
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-zinc-200 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Formatted Code</span>
          <button
            onClick={() => setJsonSpaces(2)}
            className={`px-2 py-1 rounded text-xs transition-all cursor-pointer font-semibold ${
              jsonSpaces === 2 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-850 hover:bg-zinc-800 text-zinc-400"
            }`}
          >
            2 Spaces
          </button>
          <button
            onClick={() => setJsonSpaces(4)}
            className={`px-2 py-1 rounded text-xs transition-all cursor-pointer font-semibold ${
              jsonSpaces === 4 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-850 hover:bg-zinc-800 text-zinc-400"
            }`}
          >
            4 Spaces
          </button>
          <button
            onClick={() => setJsonSpaces("minify")}
            className={`px-2 py-1 rounded text-xs transition-all cursor-pointer font-semibold ${
              jsonSpaces === "minify" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-850 hover:bg-zinc-800 text-zinc-400"
            }`}
          >
            Minify
          </button>
        </div>

        {/* View area */}
        <div className="flex-1 overflow-y-auto relative bg-zinc-950/25">
          {jsonError ? (
            <div className="h-full flex flex-col justify-center items-center p-6 text-center font-mono text-xs text-red-400 space-y-2">
              <AlertCircle size={24} className="text-red-400 animate-pulse" />
              <span className="font-bold">JSON SYNTAX VALIDATION ERROR</span>
              <p className="max-w-md opacity-85 leading-relaxed">{jsonError}</p>
            </div>
          ) : (
            <div className="h-full relative group">
              <pre className="w-full h-full p-4 text-xs font-mono text-zinc-300 overflow-auto whitespace-pre leading-relaxed">
                {jsonOutput || <span className="opacity-30 italic">No output yet. Enter valid JSON on the left.</span>}
              </pre>
              {jsonOutput && (
                <button
                  onClick={() => handleCopy(jsonOutput)}
                  className="absolute top-4 right-4 p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
