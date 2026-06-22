"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Base64TransmuterProps {
  base64Input: string;
  setBase64Input: (val: string) => void;
}

/**
 * Base64Transmuter Component
 * Encodes and decodes standard Base64 string formats and URI components.
 */
export default function Base64Transmuter({
  base64Input,
  setBase64Input,
}: Base64TransmuterProps) {
  const [base64Action, setBase64Action] = useState<"encode" | "decode" | "urlEncode" | "urlDecode">(
    "encode"
  );
  const [copied, setCopied] = useState(false);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setBase64Input(text);
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  // Derived state: calculate encoded/decoded output dynamically on render
  const getBase64Output = () => {
    if (!base64Input) return "";
    try {
      if (base64Action === "encode") {
        return btoa(base64Input);
      } else if (base64Action === "decode") {
        return atob(base64Input);
      } else if (base64Action === "urlEncode") {
        return encodeURIComponent(base64Input);
      } else if (base64Action === "urlDecode") {
        return decodeURIComponent(base64Input);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      return "Error: " + error;
    }
    return "";
  };

  const base64Output = getBase64Output();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Input String</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => setBase64Input("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Code area */}
        <textarea
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-zinc-200 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
          placeholder="Type or paste text to transmute..."
        />
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Output Preview</span>
          {base64Output && (
            <button
              onClick={() => handleCopy(base64Output)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer flex items-center gap-1 font-semibold"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>Copy</span>
            </button>
          )}
          <select
            value={base64Action}
            onChange={(e) => setBase64Action(e.target.value as "encode" | "decode" | "urlEncode" | "urlDecode")}
            className="bg-zinc-800 border border-white/5 text-zinc-300 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500/30 cursor-pointer font-semibold"
          >
            <option value="encode">Base64 Encode</option>
            <option value="decode">Base64 Decode</option>
            <option value="urlEncode">URL Encode</option>
            <option value="urlDecode">URL Decode</option>
          </select>
        </div>
        {/* View area */}
        <div className="flex-1 p-4 overflow-y-auto leading-relaxed select-text bg-zinc-950/25">
          <pre className="font-mono text-sm text-cyan-400 whitespace-pre-wrap break-all leading-loose">
            {base64Output || <span className="text-zinc-600 italic">No output yet.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}
