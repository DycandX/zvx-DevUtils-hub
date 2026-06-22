"use client";

import React, { useState, useEffect, useCallback } from "react";
import NextLink from "next/link";
import {
  Search, Sparkles, BookOpen, Code2, Split, Braces,
  KeyRound, Clock, Fingerprint, Layers, Hash, Calculator,
  Timer, FileSpreadsheet, FileCode, FileText, Database, Binary,
  ArrowLeftRight, Terminal, FileCode2, Shield, Key, FileImage,
  Sigma, Type, Image, RotateCw, Lock, Code,
  Palette, ArrowUpDown, Link, Globe2, ExternalLink
} from "lucide-react";

const GithubIcon = ({ size = 12, className = "" }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import ToolRenderer from "./ToolRenderer";

interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// Meta-data list of all available dev tools
const TOOLS_LIST: ToolItem[] = [
  // Existing customized tools
  { id: "markdown", name: "Markdown Preview", icon: BookOpen, description: "Live preview Markdown content and export HTML" },
  { id: "html", name: "HTML Preview", icon: Code2, description: "Secure interactive HTML sandboxed workspace preview" },
  { id: "diff", name: "Diff Checker", icon: Split, description: "Compare two code blocks or text passages side-by-side" },
  { id: "json", name: "JSON Formatter", icon: Braces, description: "Beautify, minify, and validate JSON syntax structures" },
  { id: "jwt", name: "JWT Decoder", icon: KeyRound, description: "Decode and inspect JSON Web Token headers & payloads" },
  { id: "timestamp", name: "Timestamp Converter", icon: Clock, description: "Convert Unix Epoch timestamps to calendar dates" },
  { id: "uuid", name: "UUID Generator", icon: Fingerprint, description: "Generate v4 random UUIDs in single or bulk batches" },
  { id: "base64", name: "Base64 / URL", icon: Layers, description: "Encode and decode Base64 strings or URL formats" },
  { id: "hash", name: "Hash Generator", icon: Hash, description: "Compute native SHA-256, SHA-1, and SHA-512 hashes" },
  { id: "number-base", name: "Number Base Converter", icon: Calculator, description: "Convert values between Decimal, Hex, Binary, and Octal" },

  // New tools from nadimtuhin/devutils repo
  { id: "cron-parser", name: "Cron Job Parser", icon: Timer, description: "Parse and explain cron expressions" },
  { id: "yaml-json", name: "YAML to JSON", icon: FileSpreadsheet, description: "Convert YAML configurations to JSON format" },
  { id: "yaml-formatter", name: "YAML Formatter", icon: FileCode, description: "Beautify, format, and validate YAML structure" },
  { id: "makefile-validator", name: "Makefile Validator", icon: FileText, description: "Validate syntax of Makefiles" },
  { id: "sql-formatter", name: "SQL Formatter", icon: Database, description: "Format and beautify SQL queries" },
  { id: "php-serializer", name: "PHP Serializer", icon: Binary, description: "Serialize and deserialize PHP data structures" },
  { id: "php-json", name: "PHP ↔ JSON Converter", icon: ArrowLeftRight, description: "Convert between PHP array/serialize and JSON" },
  { id: "curl-code", name: "cURL to Code", icon: Terminal, description: "Generate code snippets from cURL commands" },
  { id: "csv-json", name: "CSV to JSON", icon: FileCode2, description: "Convert CSV records to JSON format" },
  { id: "json-csv", name: "JSON to CSV", icon: FileCode, description: "Convert JSON array to CSV format" },
  { id: "json-code", name: "JSON to Code", icon: Code, description: "Generate TypeScript/Go/Java models from JSON" },
  { id: "cert-decoder", name: "Certificate Decoder", icon: Shield, description: "Decode X.509 PEM certificates details" },
  { id: "cert-generator", name: "Certificate Generator", icon: Key, description: "Generate self-signed SSL/TLS certificates" },
  { id: "svg-css", name: "SVG to CSS", icon: FileImage, description: "Convert SVG to CSS background-image URL" },
  { id: "hex-ascii", name: "Hex ↔ ASCII", icon: Sigma, description: "Convert hex codes to ASCII text and vice-versa" },
  { id: "string-case", name: "String Case Converter", icon: Type, description: "Transform text between camel, snake, pascal, etc. cases" },
  { id: "base64-image", name: "Base64 Image Encoder", icon: Image, description: "Convert image files to base64 Data URLs" },
  { id: "regexp", name: "RegExp Tester", icon: Search, description: "Test and debug regular expressions" },
  { id: "html-entity", name: "HTML Entity Converter", icon: Code, description: "Encode or decode HTML entity characters" },
  { id: "backslash", name: "Backslash Escape", icon: Braces, description: "Escape or unescape backslash characters in strings" },
  { id: "lorem-ipsum", name: "Lorem Ipsum", icon: RotateCw, description: "Generate placeholder lorem ipsum text passages" },
  { id: "html-jsx", name: "HTML to JSX", icon: Code2, description: "Convert standard HTML layout code to React JSX syntax" },
  { id: "css-minify-beautify", name: "CSS Minify/Beautify", icon: FileText, description: "Minify or format CSS stylesheet files" },
  { id: "js-minify-beautify", name: "JS Minify/Beautify", icon: Code, description: "Minify or format JavaScript source files" },
  { id: "html-minify-beautify", name: "HTML Minify/Beautify", icon: Code2, description: "Minify or format HTML template markup" },
  { id: "k8s-secret-decoder", name: "K8s Secret Decoder", icon: Lock, description: "Decode base64 encoded Kubernetes secret YAML files" },

  // Bonus tools
  { id: "color-converter", name: "Color Converter", icon: Palette, description: "Convert colors between HEX, RGB, HSL, HWB, CMYK and name formats" },
  { id: "line-sorter", name: "Line Sorter", icon: ArrowUpDown, description: "Sort lines alphabetically, numerically, or by length" },
  { id: "url-encoder", name: "URL Encoder/Decoder", icon: Link, description: "Encode or decode URL strings" },
  { id: "url-parser", name: "URL Parser", icon: Globe2, description: "Parse and inspect URL components and query parameters" }
];

/**
 * DevUtils Container Component
 * Orchestrates individual developer tools in a macOS-styled window wrapper.
 * Integrates the smart paste auto-detector globally.
 */
export default function DevUtils({ standalone }: { standalone?: boolean } = {}) {
  const [activeTool, setActiveTool] = useState("markdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [smartPasteText, setSmartPasteText] = useState("");
  const [detectedType, setDetectedType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tool = params.get("tool");
      if (tool && TOOLS_LIST.some(t => t.id === tool)) setActiveTool(tool);
    }
  }, []);

  const updateUrl = useCallback((tool: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tool", tool);
    window.history.replaceState({}, "", url.toString());
  }, []);

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
        updateUrl(toolId);
      }
    };
    window.addEventListener("select-dev-tool", handleSelectTool);
    return () => {
      window.removeEventListener("select-dev-tool", handleSelectTool);
    };
  }, [updateUrl]);

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
    const selectTool = (id: string) => {
      setActiveTool(id);
      updateUrl(id);
    };
    if (trimmed.startsWith("eyJ") && trimmed.split(".").length === 3) {
      setDetectedType("jwt");
      setJwtInput(trimmed);
      selectTool("jwt");
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
        selectTool("json");
      } catch {
        // Ignored: Not valid JSON
      }
    }
    // 3. Detect Epoch Timestamps (10 or 13 numeric digits)
    else if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
      setDetectedType("timestamp");
      setTimestampInput(trimmed);
      selectTool("timestamp");
    }
    // 4. Fallback default to Base64/URL input
    else {
      setDetectedType("base64");
      setBase64Input(trimmed);
      selectTool("base64");
    }
  };

  // Filters the visible tools based on the search query
  const filteredTools = TOOLS_LIST.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="utils" className={`w-full ${standalone ? "flex-1 flex flex-col min-h-0" : "space-y-6 scroll-mt-20"}`}>
      {/* Title Header — hidden in standalone mode */}
      {!standalone && (
        <div>
          <div className="text-sm sm:text-base font-mono text-emerald-400 uppercase tracking-wider mb-1.5">
            &gt; developer_utilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-zinc-100">
            Dev Utils Hub
          </h2>
        </div>
      )}

      {/* macOS Window App Container */}
      <div className={`w-full rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row bg-zinc-950/75 text-zinc-300 font-sans min-h-0 ${
        standalone ? "flex-1" : "h-[700px]"
      }`}>
        {/* Left Sidebar */}
        <div className="w-full md:w-72 bg-zinc-900/90 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 shrink-0 h-[250px] md:h-full">
          {/* macOS Dots at top-left (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1.5 mb-5 px-1">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-zinc-950/80 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-500 mb-4 focus-within:border-emerald-500/50">
            <Search size={16} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-zinc-300 placeholder:text-zinc-650 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* List of active tools */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); updateUrl(tool.id); }}
                  aria-current={isActive ? "true" : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-mono transition-all text-left cursor-pointer group ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  }`}
                >
                  <IconComponent size={16} className={isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"} />
                  <span className="truncate">{tool.name}</span>
                </button>
              );
            })}
            {filteredTools.length === 0 && (
              <div className="text-xs font-mono text-zinc-600 italic px-2 py-4">No tools found.</div>
            )}
          </div>

          {/* Sidebar Bottom */}
          <div className="mt-auto pt-3 border-t border-white/5 flex flex-col items-center gap-2 hidden md:flex">
            <a
              href="https://github.com/DycandX/zvx-DevUtils-hub"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <GithubIcon size={13} className="text-zinc-400" />
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Main Workspace (Right) */}
        <div className="flex-1 flex flex-col bg-[#181825]/95 overflow-hidden min-h-0">
          {/* Workspace Top Header (Title Bar) */}
          <div className="h-14 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-5 select-none shrink-0 font-mono text-sm text-zinc-400">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Workspace // {TOOLS_LIST.find((t) => t.id === activeTool)?.name}
            </span>
            <div className="flex items-center gap-3">
              {detectedType && !standalone && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold motion-safe:animate-pulse">
                  Smart Paste Switched: {detectedType.toUpperCase()}
                </span>
              )}
              {standalone ? (
                <NextLink href="/" className="text-xs font-mono text-zinc-500 hover:text-emerald-400 transition-colors" aria-label="Back to home">
                  &larr; Back to Hub
                </NextLink>
              ) : (
                <NextLink
                  href={`/tool/${activeTool}`}
                  className="text-zinc-500 hover:text-zinc-200 transition-colors"
                  aria-label="Open in full page"
                  target="_blank"
                >
                  <ExternalLink size={16} />
                </NextLink>
              )}
            </div>
          </div>

          {/* Universal Smart Paste Bar — hidden in standalone mode */}
          {!standalone && (
          <div className="px-5 py-2.5 bg-zinc-950/30 border-b border-white/5 flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold shrink-0 uppercase tracking-wider">
              <Sparkles size={12} className="motion-safe:animate-pulse" />
              Smart Paste
            </div>
            <input
              type="text"
              placeholder="Paste JSON, JWT, Epoch Timestamp, or Base64 here to auto-detect and configure workspace..."
              value={smartPasteText}
              onChange={handleSmartPaste}
              className="flex-1 bg-zinc-900/60 border border-white/5 rounded px-3 py-1.5 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 outline-none"
            />
            {smartPasteText && (
              <button
                onClick={() => {
                  setSmartPasteText("");
                  setDetectedType(null);
                }}
                className="text-xs font-mono text-red-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          )}

          {/* Workspace Content Area */}
          <div className="flex-1 p-5 overflow-y-auto min-h-0 select-text workspace-content">
            <ToolRenderer
              key={activeTool}
              toolId={activeTool}
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
              jwtInput={jwtInput}
              setJwtInput={setJwtInput}
              timestampInput={timestampInput}
              setTimestampInput={setTimestampInput}
              base64Input={base64Input}
              setBase64Input={setBase64Input}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
