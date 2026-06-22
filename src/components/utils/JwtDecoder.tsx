"use client";

import React, { useState } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";

interface JwtDecoderProps {
  jwtInput: string;
  setJwtInput: (val: string) => void;
}

/**
 * JwtDecoder Component
 * Decodes JSON Web Tokens (JWT) client-side.
 */
export default function JwtDecoder({ jwtInput, setJwtInput }: JwtDecoderProps) {
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
      if (text) setJwtInput(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  // Derived state: decode token dynamically on render
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Encrypted JWT Input</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => setJwtInput("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Input box */}
        <textarea
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value)}
          placeholder="eyJhbGciOi..."
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-zinc-200 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Decoded Contents</span>
        </div>
        {/* Outputs area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/25">
          {jwtError ? (
            <div className="h-full flex flex-col justify-center items-center p-6 text-center font-mono text-xs text-red-400 space-y-2">
              <AlertCircle size={24} className="text-red-400 animate-pulse" />
              <span className="font-bold">DECODE ERROR</span>
              <p className="max-w-md opacity-85 leading-relaxed">{jwtError}</p>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              {/* Header */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span className="font-bold uppercase tracking-wider">Header: Alg &amp; Type</span>
                  {jwtHeader && (
                    <button
                      onClick={() => handleCopy(jwtHeader, "jwt-h")}
                      className="hover:text-emerald-400 cursor-pointer flex items-center gap-0.5"
                    >
                      {copiedId === "jwt-h" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <pre className="bg-zinc-950/65 border border-white/5 rounded-lg p-3 text-cyan-400 overflow-x-auto whitespace-pre leading-relaxed">
                  {jwtHeader || <span className="opacity-30 italic">No header data...</span>}
                </pre>
              </div>

              {/* Payload */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span className="font-bold uppercase tracking-wider">Payload: Data Claims</span>
                  {jwtPayload && (
                    <button
                      onClick={() => handleCopy(jwtPayload, "jwt-p")}
                      className="hover:text-emerald-400 cursor-pointer flex items-center gap-0.5"
                    >
                      {copiedId === "jwt-p" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>Copy</span>
                    </button>
                  )}
                </div>
                <pre className="bg-zinc-950/65 border border-white/5 rounded-lg p-3 text-violet-400 overflow-x-auto whitespace-pre leading-relaxed">
                  {jwtPayload || <span className="opacity-30 italic">No payload claims...</span>}
                </pre>
              </div>

              {/* Signature */}
              {jwtSignature && (
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Signature String</span>
                  <div className="bg-zinc-950/65 border border-white/5 rounded-lg p-3 text-zinc-400 break-all select-all">
                    {jwtSignature}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
