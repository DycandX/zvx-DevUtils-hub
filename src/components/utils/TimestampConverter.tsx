"use client";

import React, { useState } from "react";

interface TimestampConverterProps {
  timestampInput: string;
  setTimestampInput: (val: string) => void;
}

/**
 * TimestampConverter Component
 * Converts UNIX Epoch timestamps to calendar formats, and vice-versa.
 */
export default function TimestampConverter({
  timestampInput,
  setTimestampInput,
}: TimestampConverterProps) {
  const [dateInput, setDateInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");

  // Derived date string values computed dynamically during render
  let dateOutput = "";
  if (timestampInput.trim()) {
    try {
      let ts = parseInt(timestampInput);
      if (!isNaN(ts)) {
        if (timestampInput.length === 13) ts = Math.floor(ts / 1000);
        const date = new Date(ts * 1000);
        dateOutput = date.toISOString() + "\n" + date.toString();
      }
    } catch {
      dateOutput = "Invalid Epoch Timestamp";
    }
  }

  // Converts date string to Epoch seconds
  const convertDateToTimestamp = () => {
    try {
      const dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) {
        setTimestampOutput("Invalid Calendar Date format.");
        return;
      }
      setTimestampOutput(Math.floor(dateObj.getTime() / 1000).toString());
    } catch {
      setTimestampOutput("Error converting date.");
    }
  };

  // Seed input with the current epoch
  const useCurrentTime = () => {
    setTimestampInput(Math.floor(Date.now() / 1000).toString());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Converter Configurations</span>
          <button
            onClick={useCurrentTime}
            className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer font-bold"
          >
            Current Time
          </button>
          <button
            onClick={() => setTimestampInput("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Form Inputs */}
        <div className="p-6 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 uppercase font-bold text-[10px]">
              Epoch Timestamp (Seconds or Ms)
            </label>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
              placeholder="e.g. 1782087430..."
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="block text-zinc-400 mb-1.5 uppercase font-bold text-[10px]">
              Calendar / ISO Date String
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 2026-06-22T07:30:00Z"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="flex-1 bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={convertDateToTimestamp}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-2 rounded font-mono cursor-pointer"
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Computed Dates / Timestamps</span>
        </div>
        {/* Output view */}
        <div className="flex-1 p-6 space-y-4 font-mono text-xs overflow-y-auto bg-zinc-950/25">
          {/* Epoch to ISO Date Output */}
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Date Representation</span>
            <pre className="bg-zinc-950/60 border border-white/5 rounded-lg p-3 text-sm text-zinc-300 min-h-[58px] leading-relaxed whitespace-pre-wrap">
              {dateOutput || <span className="opacity-30 italic">No output...</span>}
            </pre>
          </div>

          {/* ISO Date to Epoch Output */}
          {timestampOutput && (
            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Generated UNIX Epoch</span>
              <div className="bg-zinc-950/60 border border-white/5 rounded-lg p-3 text-sm text-emerald-400 font-bold">
                {timestampOutput}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
