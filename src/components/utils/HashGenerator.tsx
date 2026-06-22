"use client";

import React, { useState, useEffect } from "react";
import { Hash, Check, Copy } from "lucide-react";

/**
 * HashGenerator Component
 * Computes SHA-256 and SHA-1 cryptographic hashes of input text
 * entirely client-side using browser-native Web Crypto Subtle API.
 */
export default function HashGenerator() {
  const [hashInput, setHashInput] = useState("GeekPort Dashboard");
  const [sha256Output, setSha256Output] = useState("");
  const [sha1Output, setSha1Output] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Perform web-native cryptographic hashing on input changes
  useEffect(() => {
    const computeHashes = async () => {
      if (!hashInput) {
        setSha256Output("");
        setSha1Output("");
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
      } catch (err) {
        console.error("Cryptographic hash failure", err);
      }
    };
    computeHashes();
  }, [hashInput]);

  return (
    <div id="tool-hash" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Hash size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">Hash Generator</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Secure Cryptographic Hashes</span>
      </div>

      <div className="space-y-4">
        {/* Input box */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Plain Text Input</label>
          <input
            type="text"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Output list */}
        <div className="space-y-2">
          {/* SHA-256 output container */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-0.5">
              <span>SHA-256 (32 bytes)</span>
              {sha256Output && (
                <button
                  onClick={() => handleCopy(sha256Output, "hash-256")}
                  className="hover:text-emerald-400 cursor-pointer"
                >
                  {copiedId === "hash-256" ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                </button>
              )}
            </div>
            <div className="bg-zinc-950/50 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-zinc-300 break-all select-all">
              {sha256Output || <span className="opacity-30 italic">hash output...</span>}
            </div>
          </div>

          {/* SHA-1 output container */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-0.5">
              <span>SHA-1 (20 bytes)</span>
              {sha1Output && (
                <button
                  onClick={() => handleCopy(sha1Output, "hash-1")}
                  className="hover:text-emerald-400 cursor-pointer"
                >
                  {copiedId === "hash-1" ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                </button>
              )}
            </div>
            <div className="bg-zinc-950/50 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-zinc-300 break-all select-all">
              {sha1Output || <span className="opacity-30 italic">hash output...</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
