"use client";

import React, { useState } from "react";
import { Layers, Check, Copy, AlertCircle } from "lucide-react";

interface JwtDecoderProps {
  jwtInput: string;
  setJwtInput: (val: string) => void;
}

/**
 * JwtDecoder Component
 * Decodes JSON Web Tokens (JWT) client-side to expose the header JSON and payload claims JSON.
 * It does not send tokens to any server, keeping credentials entirely secure.
 */
export default function JwtDecoder({ jwtInput, setJwtInput }: JwtDecoderProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Derived state: decode token on-the-fly inside the render block
  let jwtHeader = "";
  let jwtPayload = "";
  let jwtSignature = "";
  let jwtError = "";

  if (jwtInput.trim()) {
    const parts = jwtInput.split(".");
    if (parts.length !== 3) {
      jwtError = "Invalid JWT Token structure. A JWT must consist of three parts separated by dots.";
    } else {
      try {
        const base64UrlDecode = (str: string) => {
          let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
          while (base64.length % 4) base64 += "=";
          return decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
        };

        const headerDec = base64UrlDecode(parts[0]);
        const payloadDec = base64UrlDecode(parts[1]);

        jwtHeader = JSON.stringify(JSON.parse(headerDec), null, 2);
        jwtPayload = JSON.stringify(JSON.parse(payloadDec), null, 2);
        jwtSignature = parts[2];
      } catch {
        jwtError = "Failed to decode token. Ensure the input string is a valid base64-encoded JWT.";
      }
    }
  }

  return (
    <div id="tool-jwt" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">JWT Decoder</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Decode Encrypted JSON Tokens</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input box */}
        <div className="lg:col-span-1">
          <label className="block text-xs font-mono text-zinc-400 mb-1">Encrypted JWT Token</label>
          <textarea
            value={jwtInput}
            onChange={(e) => setJwtInput(e.target.value)}
            placeholder="eyJhbGciOi..."
            rows={8}
            className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
          />
        </div>

        {/* Decoder outputs */}
        <div className="lg:col-span-2 space-y-4">
          {jwtError ? (
            <div className="bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg p-4 font-mono text-xs flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">DECODE ERROR</span>
                <p className="opacity-80 leading-relaxed">{jwtError}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Header decoded panel */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>HEADER: ALGORITHM &amp; TOKEN TYPE</span>
                  {jwtHeader && (
                    <button
                      onClick={() => handleCopy(jwtHeader, "jwt-h")}
                      className="hover:text-emerald-400 cursor-pointer"
                    >
                      {copiedId === "jwt-h" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  )}
                </div>
                <pre className="bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-cyan-400 overflow-auto max-h-[140px] terminal-scroll whitespace-pre-wrap">
                  {jwtHeader || <span className="opacity-30 italic">Header output...</span>}
                </pre>
              </div>

              {/* Payload decoded panel */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                  <span>PAYLOAD: DATA CLAIMS</span>
                  {jwtPayload && (
                    <button
                      onClick={() => handleCopy(jwtPayload, "jwt-p")}
                      className="hover:text-emerald-400 cursor-pointer"
                    >
                      {copiedId === "jwt-p" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  )}
                </div>
                <pre className="bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-violet-400 overflow-auto max-h-[140px] terminal-scroll whitespace-pre-wrap">
                  {jwtPayload || <span className="opacity-30 italic">Payload claims...</span>}
                </pre>
              </div>
            </div>
          )}

          {/* Signature segment */}
          {!jwtError && jwtSignature && (
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-500 block">SIGNATURE HASH STRING</span>
              <div className="bg-zinc-950/50 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-zinc-400 break-all select-all">
                {jwtSignature}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
