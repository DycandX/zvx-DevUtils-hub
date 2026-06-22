"use client";

import React, { useState } from "react";
import { 
  Search, Sparkles, BookOpen, Code2, Split, Braces, 
  KeyRound, Clock, Fingerprint, Layers, Hash, Calculator 
} from "lucide-react";

// Import modular utility components
import MarkdownPreview from "./utils/MarkdownPreview";
import HtmlPreview from "./utils/HtmlPreview";
import NumberBaseConverter from "./utils/NumberBaseConverter";
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
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Meta-data list of all available dev tools
const TOOLS_LIST: ToolItem[] = [
  { id: "markdown", name: "Markdown Preview", icon: BookOpen, description: "Live preview Markdown content and export HTML" },
  { id: "html", name: "HTML Preview", icon: Code2, description: "Secure interactive HTML sandboxed workspace preview" },
  { id: "diff", name: "Diff Checker", icon: Split, description: "Compare two code blocks or text passages side-by-side" },
  { id: "json", name: "JSON Formatter", icon: Braces, description: "Beautify, minify, and validate JSON syntax structures" },
  { id: "jwt", name: "JWT Decoder", icon: KeyRound, description: "Decode and inspect JSON Web Token headers & payloads" },
  { id: "timestamp", name: "Timestamp Converter", icon: Clock, description: "Convert Unix Epoch timestamps to calendar dates" },
  { id: "uuid", name: "UUID Generator", icon: Fingerprint, description: "Generate v4 random UUIDs in single or bulk batches" },
  { id: "base64", name: "Base64 / URL", icon: Layers, description: "Encode and decode Base64 strings or URL formats" },
  { id: "hash", name: "Hash Generator", icon: Hash, description: "Compute native SHA-256, SHA-1, and SHA-512 hashes" },
  { id: "number-base", name: "Number Base Converter", icon: Calculator, description: "Convert values between Decimal, Hex, Binary, and Octal" }
];

/**
 * DevUtils Container Component
 * Orchestrates individual developer tools in a macOS-styled window wrapper.
 * Integrates the smart paste auto-detector globally.
 */
export default function DevUtils() {
  const [activeTool, setActiveTool] = useState("markdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [smartPasteText, setSmartPasteText] = useState("");
  const [detectedType, setDetectedType] = useState<string | null>(null);

  // Shared state hooks passed to child components to support Smart Auto-Detect integration
  const [jsonInput, setJsonInput] = useState('{"name":"zvx-hub","details":{"status":"active","tools":10}}');
  const [jwtInput, setJwtInput] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR5Y2FuZFgiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [timestampInput, setTimestampInput] = useState("1782087430");
  const [base64Input, setBase64Input] = useState("Welcome to ZVX Hub!");

  // Listen for navigation event from TerminalUI or external triggers
  React.useEffect(() => {
    const handleSelectTool = (e: Event) => {
      const toolId = (e as CustomEvent).detail;
      if (toolId && TOOLS_LIST.some((t) => t.id === toolId)) {
        setActiveTool(toolId);
      }
    };
    window.addEventListener("select-dev-tool", handleSelectTool);
    return () => {
      window.removeEventListener("select-dev-tool", handleSelectTool);
    };
  }, []);

  // Handles pasting text into the universal input, auto-detecting the data shape,
  // populating the target tool's state, and switching active tab to it.
  const handleSmartPaste = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setActiveTool("jwt");
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
        setActiveTool("json");
      } catch {
        // Ignored: Not valid JSON
      }
    }
    // 3. Detect Epoch Timestamps (10 or 13 numeric digits)
    else if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
      setDetectedType("timestamp");
      setTimestampInput(trimmed);
      setActiveTool("timestamp");
    }
    // 4. Fallback default to Base64/URL input
    else {
      setDetectedType("base64");
      setBase64Input(trimmed);
      setActiveTool("base64");
    }
  };

  // Filters the visible tools based on the search query
  const filteredTools = TOOLS_LIST.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="utils" className="w-full space-y-6 scroll-mt-20">
      {/* Title Header */}
      <div>
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          &gt; developer_utilities
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100">
          Dev Utils Hub
        </h2>
      </div>

      {/* macOS Window App Container */}
      <div className="w-full rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[630px] bg-zinc-950/65 backdrop-blur-md text-zinc-300 font-sans">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-zinc-900/90 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-3.5 shrink-0 h-[220px] md:h-full">
          {/* macOS Dots at top-left (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 mb-5 px-1">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-zinc-950/80 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-500 mb-4 focus-within:border-emerald-500/50">
            <Search size={14} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-zinc-300 placeholder:text-zinc-600 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* List of active tools */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 md:max-h-[380px] scrollbar-thin">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer group ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
                  }`}
                >
                  <IconComponent size={14} className={isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"} />
                  <span className="truncate">{tool.name}</span>
                </button>
              );
            })}
            {filteredTools.length === 0 && (
              <div className="text-[10px] font-mono text-zinc-600 italic px-2 py-4">No tools found.</div>
            )}
          </div>

          {/* Sidebar Bottom */}
          <div className="mt-auto pt-3 border-t border-white/5 flex flex-col items-center gap-2 hidden md:flex">
            <a
              href="mailto:zulvikar.kharisma22@gmail.com"
              className="w-full py-1.5 rounded bg-zinc-850 hover:bg-zinc-850 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Send Feedback
            </a>
            <span className="text-[9px] font-mono text-zinc-600">DevUtils.app 1.11.1 (ZVX)</span>
          </div>
        </div>

        {/* Main Workspace (Right) */}
        <div className="flex-1 flex flex-col h-[410px] md:h-full bg-[#181825]/95 overflow-hidden">
          {/* Workspace Top Header (Title Bar) */}
          <div className="h-12 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-4 select-none shrink-0 font-mono text-xs text-zinc-400">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              Workspace // {TOOLS_LIST.find((t) => t.id === activeTool)?.name}
            </span>
            {detectedType && (
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold animate-pulse">
                Smart Paste Switched: {detectedType.toUpperCase()}
              </span>
            )}
          </div>

          {/* Universal Smart Paste Bar */}
          <div className="px-4 py-2 bg-zinc-950/30 border-b border-white/5 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold shrink-0 uppercase tracking-wider">
              <Sparkles size={11} className="animate-pulse" />
              Smart Paste
            </div>
            <input
              type="text"
              placeholder="Paste JSON, JWT, Epoch Timestamp, or Base64 here to auto-detect and configure workspace..."
              value={smartPasteText}
              onChange={handleSmartPaste}
              className="flex-1 bg-zinc-900/60 border border-white/5 rounded px-2.5 py-1 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 outline-none"
            />
            {smartPasteText && (
              <button
                onClick={() => {
                  setSmartPasteText("");
                  setDetectedType(null);
                }}
                className="text-[10px] font-mono text-red-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Workspace Workspace Content Area */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            {activeTool === "markdown" && <MarkdownPreview />}
            {activeTool === "html" && <HtmlPreview />}
            {activeTool === "number-base" && <NumberBaseConverter />}
            {activeTool === "diff" && <DiffChecker />}
            {activeTool === "json" && (
              <JsonFormatter jsonInput={jsonInput} setJsonInput={setJsonInput} />
            )}
            {activeTool === "jwt" && (
              <JwtDecoder jwtInput={jwtInput} setJwtInput={setJwtInput} />
            )}
            {activeTool === "timestamp" && (
              <TimestampConverter timestampInput={timestampInput} setTimestampInput={setTimestampInput} />
            )}
            {activeTool === "uuid" && <UuidGenerator />}
            {activeTool === "base64" && (
              <Base64Transmuter base64Input={base64Input} setBase64Input={setBase64Input} />
            )}
            {activeTool === "hash" && <HashGenerator />}
          </div>
        </div>
      </div>
    </div>
  );
}
