"use client";

import React, { useState } from "react";
import { Layers, Check, Copy } from "lucide-react";

interface Base64TransmuterProps {
  base64Input: string;
  setBase64Input: (val: string) => void;
}

/**
 * Base64Transmuter Component
 * Encodes and decodes standard Base64 string formats and URI components.
 * Performed entirely client-side using native window APIs (btoa, atob, encodeURIComponent, decodeURIComponent).
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
    <div id="tool-base64" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">Base64 / URL Transmuter</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Encode &amp; Decode Strings</span>
      </div>

      <div className="space-y-4">
        {/* Input area */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Input Text</label>
          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            rows={3}
            className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
          />
        </div>

        {/* Action button toggles */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBase64Action("encode")}
            className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${
              base64Action === "encode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            Base64 Encode
          </button>
          <button
            onClick={() => setBase64Action("decode")}
            className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${
              base64Action === "decode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            Base64 Decode
          </button>
          <button
            onClick={() => setBase64Action("urlEncode")}
            className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${
              base64Action === "urlEncode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            URL Encode
          </button>
          <button
            onClick={() => setBase64Action("urlDecode")}
            className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${
              base64Action === "urlDecode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            URL Decode
          </button>
        </div>

        {/* Output pane */}
        <div className="relative group">
          <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto max-h-[100px] terminal-scroll break-all leading-normal">
            {base64Output}
          </pre>
          {base64Output && (
            <button
              onClick={() => handleCopy(base64Output)}
              className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 rounded-md text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
