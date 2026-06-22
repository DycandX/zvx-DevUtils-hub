"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

type BaseType = "dec" | "hex" | "bin" | "oct";

/**
 * NumberBaseConverter Component
 * Performs client-side mathematical conversions between decimal, hexadecimal, binary, and octal formats.
 */
export default function NumberBaseConverter() {
  const [inputValue, setInputValue] = useState("255");
  const [inputBase, setInputBase] = useState<BaseType>("dec");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert inputs dynamically on render
  const getConversions = () => {
    if (!inputValue.trim()) {
      return { dec: "", hex: "", bin: "", oct: "", error: "" };
    }

    const cleanInput = inputValue.trim();
    let num = NaN;

    try {
      if (inputBase === "dec") {
        num = parseInt(cleanInput, 10);
      } else if (inputBase === "hex") {
        num = parseInt(cleanInput, 16);
      } else if (inputBase === "bin") {
        num = parseInt(cleanInput, 2);
      } else if (inputBase === "oct") {
        num = parseInt(cleanInput, 8);
      }
    } catch {
      return { dec: "", hex: "", bin: "", oct: "", error: "Parsing calculation error." };
    }

    if (isNaN(num)) {
      return { dec: "", hex: "", bin: "", oct: "", error: `Invalid ${inputBase.toUpperCase()} number format.` };
    }

    return {
      dec: num.toString(10),
      hex: num.toString(16).toUpperCase(),
      bin: num.toString(2),
      oct: num.toString(8),
      error: "",
    };
  };

  const conversions = getConversions();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Input Configuration</span>
          <button
            onClick={() => setInputValue("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Main form */}
        <div className="p-6 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 uppercase font-bold text-[10px]">Select Input Base</label>
            <div className="grid grid-cols-4 gap-2">
              {(["dec", "hex", "bin", "oct"] as BaseType[]).map((base) => (
                <button
                  key={base}
                  onClick={() => setInputBase(base)}
                  className={`py-1.5 rounded font-bold uppercase transition-all cursor-pointer text-center border ${
                    inputBase === base
                      ? "bg-emerald-500 text-zinc-950 border-emerald-500"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-white/5"
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1.5 uppercase font-bold text-[10px]">
              Input Number ({inputBase.toUpperCase()})
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
              placeholder={`Enter a ${inputBase.toUpperCase()} value...`}
            />
          </div>

          <div className="text-[11px] text-zinc-500 leading-relaxed border-t border-white/5 pt-4">
            <span className="font-bold text-zinc-400 block mb-1">Supported Formats:</span>
            * Decimal: standard numeric characters (e.g. 255)<br />
            * Hexadecimal: digits 0-9 and letters A-F (e.g. FF)<br />
            * Binary: bits 0 and 1 (e.g. 11111111)<br />
            * Octal: digits 0-7 (e.g. 377)
          </div>
        </div>
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Conversion Outputs</span>
        </div>
        {/* Output table */}
        <div className="flex-1 p-6 space-y-4 font-mono text-xs overflow-y-auto">
          {conversions.error ? (
            <div className="bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg p-4 text-center">
              {conversions.error}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Decimal (Base 10)", id: "dec", val: conversions.dec },
                { label: "Hexadecimal (Base 16)", id: "hex", val: conversions.hex },
                { label: "Binary (Base 2)", id: "bin", val: conversions.bin },
                { label: "Octal (Base 8)", id: "oct", val: conversions.oct },
              ].map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span className="font-bold">{item.label}</span>
                    {item.val && (
                      <button
                        onClick={() => handleCopy(item.val, item.id)}
                        className="hover:text-emerald-400 cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === item.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                  <div className="bg-zinc-950/60 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 break-all select-all font-semibold min-h-[38px] flex items-center">
                    {item.val || <span className="opacity-30 italic">No output...</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
