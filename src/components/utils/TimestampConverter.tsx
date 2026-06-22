"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";

interface TimestampConverterProps {
  timestampInput: string;
  setTimestampInput: (val: string) => void;
}

/**
 * TimestampConverter Component
 * Convers UNIX Epoch timestamps (seconds or milliseconds) to readable ISO calendars and local timezones,
 * as well as generating Unix timestamps from calendar dates.
 */
export default function TimestampConverter({
  timestampInput,
  setTimestampInput,
}: TimestampConverterProps) {
  const [dateInput, setDateInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");

  // Derived state: calculate readable calendar strings dynamically during render
  let dateOutput = "";
  if (timestampInput.trim()) {
    try {
      let ts = parseInt(timestampInput);
      if (!isNaN(ts)) {
        // If 13 digits (ms), convert to seconds for display
        if (timestampInput.length === 13) ts = Math.floor(ts / 1000);
        const date = new Date(ts * 1000);
        dateOutput = date.toISOString() + "\n" + date.toString();
      }
    } catch {
      dateOutput = "Invalid Epoch Timestamp";
    }
  }

  // Converts standard date formats (like ISO, UTC, Local string) to Unix epoch seconds
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

  // Seeding input with the current timestamp
  const useCurrentTime = () => {
    setTimestampInput(Math.floor(Date.now() / 1000).toString());
  };

  return (
    <div id="tool-timestamp" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">Epoch Timestamp</h3>
        </div>
        <button
          onClick={useCurrentTime}
          className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 px-2.5 py-1 rounded font-mono font-bold tracking-wider cursor-pointer"
        >
          Current Epoch
        </button>
      </div>

      <div className="space-y-4">
        {/* Epoch -> ISO Date segment */}
        <div className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-2">
            <label className="block text-xs font-mono text-zinc-400 mb-1">Epoch Seconds/Ms</label>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
            />
          </div>
          <pre className="col-span-3 bg-zinc-950/80 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-zinc-400 overflow-x-auto min-h-[50px] leading-relaxed">
            {dateOutput}
          </pre>
        </div>

        {/* ISO Date -> Epoch segment */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="block text-xs font-mono text-zinc-500">ISO / CALENDAR DATE TO UNIX EPOCH</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 2026-06-22T07:30:00Z"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-1 bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={convertDateToTimestamp}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded font-mono cursor-pointer"
            >
              Convert
            </button>
          </div>
          {timestampOutput && (
            <div className="flex items-center justify-between bg-zinc-950/50 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono">
              <span className="text-zinc-500">Epoch Timestamp:</span>
              <span className="text-emerald-400 font-bold">{timestampOutput}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
