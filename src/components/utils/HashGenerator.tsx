"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

/**
 * HashGenerator Component
 * Computes SHA-256 and SHA-1 cryptographic hashes of input text
 * entirely client-side using browser-native Web Crypto Subtle API.
 */
export default function HashGenerator() {
  const [hashInput, setHashInput] = useState("GeekPort Dashboard");
  const [sha256Output, setSha256Output] = useState("");
  const [sha1Output, setSha1Output] = useState("");
  const [sha512Output, setSha512Output] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setHashInput(text);
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  // Perform web-native cryptographic hashing on input changes
  useEffect(() => {
    const computeHashes = async () => {
      if (!hashInput) {
        setSha256Output("");
        setSha1Output("");
        setSha512Output("");
        return;
      }
      try {
        const msgUint8 = new TextEncoder().encode(hashInput);

        const sha256Buffer = await crypto.subtle.digest("SHA-256", msgUint8);
        const sha256Array = Array.from(new Uint8Array(sha256Buffer));
        setSha256Output(
          sha256Array.map((b) => b.toString(16).padStart(2, "0")).join("")
        );

        const sha1Buffer = await crypto.subtle.digest("SHA-1", msgUint8);
        const sha1Array = Array.from(new Uint8Array(sha1Buffer));
        setSha1Output(
          sha1Array.map((b) => b.toString(16).padStart(2, "0")).join("")
        );

        const sha512Buffer = await crypto.subtle.digest("SHA-512", msgUint8);
        const sha512Array = Array.from(new Uint8Array(sha512Buffer));
        setSha512Output(
          sha512Array.map((b) => b.toString(16).padStart(2, "0")).join("")
        );
      } catch {
        console.error("Cryptographic hash failure");
      }
    };
    computeHashes();
  }, [hashInput]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Plain Text Input</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => setHashInput("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Code area */}
        <textarea
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-zinc-200 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
          placeholder="Type or paste text to compute hashes..."
        />
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Cryptographic Hashes</span>
        </div>
        {/* Content list */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-zinc-950/25">
          {/* SHA-256 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 font-bold">SHA-256 (32 bytes)</span>
              {sha256Output && (
                <button
                  onClick={() => handleCopy(sha256Output, "sha-256")}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5"
                >
                  {copiedId === "sha-256" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>Copy</span>
                </button>
              )}
            </div>
            <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-emerald-400 break-all select-all leading-normal whitespace-pre-wrap">
              {sha256Output || <span className="text-zinc-600 italic">No output yet.</span>}
            </pre>
          </div>

          {/* SHA-1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 font-bold">SHA-1 (20 bytes)</span>
              {sha1Output && (
                <button
                  onClick={() => handleCopy(sha1Output, "sha-1")}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5"
                >
                  {copiedId === "sha-1" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>Copy</span>
                </button>
              )}
            </div>
            <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-cyan-400 break-all select-all leading-normal whitespace-pre-wrap">
              {sha1Output || <span className="text-zinc-600 italic">No output yet.</span>}
            </pre>
          </div>

          {/* SHA-512 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 font-bold">SHA-512 (64 bytes)</span>
              {sha512Output && (
                <button
                  onClick={() => handleCopy(sha512Output, "sha-512")}
                  className="text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5"
                >
                  {copiedId === "sha-512" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  <span>Copy</span>
                </button>
              )}
            </div>
            <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-blue-400 break-all select-all leading-normal whitespace-pre-wrap">
              {sha512Output || <span className="text-zinc-600 italic">No output yet.</span>}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
