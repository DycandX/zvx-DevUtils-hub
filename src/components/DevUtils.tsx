"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

// Import modular utility components
import DiffChecker from "./utils/DiffChecker";
import JsonFormatter from "./utils/JsonFormatter";
import JwtDecoder from "./utils/JwtDecoder";
import TimestampConverter from "./utils/TimestampConverter";
import UuidGenerator from "./utils/UuidGenerator";
import Base64Transmuter from "./utils/Base64Transmuter";
import HashGenerator from "./utils/HashGenerator";

interface ToolItem {
  id: string;
  name: string;
  description: string;
}

// Meta-data list of all available dev tools
const TOOLS_LIST: ToolItem[] = [
  { id: "diff", name: "Diff Checker", description: "Compare two code blocks or text passages line-by-line" },
  { id: "json", name: "JSON Formatter", description: "Beautify, minify, and validate JSON syntax" },
  { id: "jwt", name: "JWT Decoder", description: "Decode and inspect JSON Web Token headers & payloads" },
  { id: "timestamp", name: "Timestamp Converter", description: "Convert Unix Epoch timestamps to calendar dates" },
  { id: "uuid", name: "UUID Generator", description: "Generate v4 random UUIDs in single or bulk batches" },
  { id: "base64", name: "Base64 / URL", description: "Encode and decode Base64 strings or URL formats" },
  { id: "hash", name: "Hash Generator", description: "Compute native SHA-256 and SHA-1 cryptographic hashes" },
];

/**
 * DevUtils Container Component
 * Orchestrates individual developer tools, implements the smart paste auto-detector,
 * and handles global tool search/filtering.
 */
export default function DevUtils() {
  const [searchQuery, setSearchQuery] = useState("");
  const [smartPasteText, setSmartPasteText] = useState("");
  const [detectedType, setDetectedType] = useState<string | null>(null);

  // Parent state hooks passed to child components to support Smart Auto-Detect integration
  const [jsonInput, setJsonInput] = useState('{"name":"zvx-hub","details":{"status":"active","tools":7}}');
  const [jwtInput, setJwtInput] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR5Y2FuZFgiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [timestampInput, setTimestampInput] = useState("1782087430");
  const [base64Input, setBase64Input] = useState("Welcome to ZVX Hub!");

  // Handles pasting text into the universal input, auto-detecting the data shape,
  // populating the target tool's state, and focusing the view on the matching card.
  const handleSmartPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSmartPasteText(val);
    if (!val.trim()) {
      setDetectedType(null);
      return;
    }

    const trimmed = val.trim();

    // 1. Detect JWT structure (header.payload.signature)
    if (trimmed.startsWith("eyJ") && trimmed.split(".").length === 3) {
      setDetectedType("jwt");
      setJwtInput(trimmed);
      scrollToAndHighlight("jwt");
    }
    // 2. Detect JSON objects/arrays
    else if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        JSON.parse(trimmed);
        setDetectedType("json");
        setJsonInput(trimmed);
        scrollToAndHighlight("json");
      } catch {
        // Ignored: Not valid JSON
      }
    }
    // 3. Detect Epoch Timestamps (10 or 13 numeric digits)
    else if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
      setDetectedType("timestamp");
      setTimestampInput(trimmed);
      scrollToAndHighlight("timestamp");
    }
    // 4. Fallback default to Base64/URL input
    else {
      setDetectedType("base64");
      setBase64Input(trimmed);
      scrollToAndHighlight("base64");
    }
  };

  // Scrolls viewport to focus on the active tool and triggers a brief visual highlight ring
  const scrollToAndHighlight = (id: string) => {
    const el = document.getElementById(`tool-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-emerald-500/50");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-emerald-500/50");
      }, 3000);
    }
  };

  // Filters the visible tools based on the search query
  const filteredTools = TOOLS_LIST.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="utils" className="w-full space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            &gt; developer_utilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100">
            Dev Utils Hub
          </h2>
        </div>
        <div className="flex items-center gap-2 max-w-sm w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-sm font-mono">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            placeholder="search utilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-zinc-300 placeholder:text-zinc-600 focus:ring-0"
          />
        </div>
      </div>

      {/* Universal Smart Paste Area */}
      <div className="glass-panel p-5 rounded-xl border border-white/5 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            Smart Auto-Detect Input Area
          </span>
          {detectedType && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-bounce">
              [Auto-Detected: {detectedType.toUpperCase()}]
            </span>
          )}
        </div>
        <textarea
          placeholder="Paste strings (JSON object, JWT token, Epoch digits, etc.) here to automatically parse and scroll to the appropriate tool..."
          value={smartPasteText}
          onChange={handleSmartPaste}
          rows={2}
          className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-4 py-3 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 outline-none resize-none"
        />
      </div>

      {/* Utilities Container */}
      <div className="space-y-12">
        {filteredTools.some((t) => t.id === "diff") && <DiffChecker />}

        {filteredTools.some((t) => t.id === "json") && (
          <JsonFormatter jsonInput={jsonInput} setJsonInput={setJsonInput} />
        )}

        {filteredTools.some((t) => t.id === "jwt") && (
          <JwtDecoder jwtInput={jwtInput} setJwtInput={setJwtInput} />
        )}

        {filteredTools.some((t) => t.id === "timestamp") && (
          <TimestampConverter timestampInput={timestampInput} setTimestampInput={setTimestampInput} />
        )}

        {filteredTools.some((t) => t.id === "uuid") && <UuidGenerator />}

        {filteredTools.some((t) => t.id === "base64") && (
          <Base64Transmuter base64Input={base64Input} setBase64Input={setBase64Input} />
        )}

        {filteredTools.some((t) => t.id === "hash") && <HashGenerator />}
      </div>
    </div>
  );
}
