"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Copy, Check, RefreshCw, Hash, Calendar, FileJson, Layers, Clipboard, AlertCircle } from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  description: string;
}

const TOOLS_LIST: ToolItem[] = [
  { id: "diff", name: "Diff Checker", description: "Compare two code blocks or text passages line-by-line" },
  { id: "json", name: "JSON Formatter", description: "Beautify, minify, and validate JSON syntax" },
  { id: "jwt", name: "JWT Decoder", description: "Decode and inspect JSON Web Token headers & payloads" },
  { id: "timestamp", name: "Timestamp Converter", description: "Convert Unix Epoch timestamps to calendar dates" },
  { id: "uuid", name: "UUID Generator", description: "Generate v4 random UUIDs in single or bulk batches" },
  { id: "base64", name: "Base64 / URL", description: "Encode and decode Base64 strings or URL formats" },
  { id: "hash", name: "Hash Generator", description: "Compute native SHA-256 and SHA-1 cryptographic hashes" }
];

export default function DevUtils() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [smartPasteText, setSmartPasteText] = useState("");
  const [detectedType, setDetectedType] = useState<string | null>(null);

  // Tool 1: Diff Checker State
  const [diffTextA, setDiffTextA] = useState("const app = {\n  name: 'zvx-hub',\n  version: '1.0.0',\n  active: true\n};");
  const [diffTextB, setDiffTextB] = useState("const app = {\n  name: 'zvx-hub',\n  version: '1.0.0',\n  active: false,\n  env: 'production'\n};");

  // Tool 2: JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{"name":"zvx-hub","details":{"status":"active","tools":7}}');
  const [jsonSpaces, setJsonSpaces] = useState<number | "minify">(2);

  // Tool 3: JWT State
  const [jwtInput, setJwtInput] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkR5Y2FuZFgiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");

  // Tool 4: Timestamp Converter State
  const [timestampInput, setTimestampInput] = useState("1782087430");
  const [dateInput, setDateInput] = useState("");
  const [timestampOutput, setTimestampOutput] = useState("");

  // Tool 5: UUID State
  const [uuidCount, setUuidCount] = useState(5);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>(() => {
    const list = [];
    for (let i = 0; i < 5; i++) {
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    return list;
  });

  // Tool 6: Base64 & URL State
  const [base64Input, setBase64Input] = useState("Welcome to ZVX Hub!");
  const [base64Action, setBase64Action] = useState<"encode" | "decode" | "urlEncode" | "urlDecode">("encode");

  // Tool 7: Hash State
  const [hashInput, setHashInput] = useState("GeekPort Dashboard");
  const [sha256Output, setSha256Output] = useState("");
  const [sha1Output, setSha1Output] = useState("");

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ----------------------------------------------------
  // SMART AUTO-DETECT INPUT
  // ----------------------------------------------------
  const handleSmartPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSmartPasteText(val);
    if (!val.trim()) {
      setDetectedType(null);
      return;
    }

    const trimmed = val.trim();

    // 1. Detect JWT
    if (trimmed.startsWith("eyJ") && trimmed.split(".").length === 3) {
      setDetectedType("jwt");
      setJwtInput(trimmed);
      scrollToAndHighlight("jwt");
    }
    // 2. Detect JSON
    else if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        JSON.parse(trimmed);
        setDetectedType("json");
        setJsonInput(trimmed);
        scrollToAndHighlight("json");
      } catch {
        // Not valid JSON
      }
    }
    // 3. Detect Epoch Timestamp (10 or 13 digits)
    else if (/^\d{10}$/.test(trimmed) || /^\d{13}$/.test(trimmed)) {
      setDetectedType("timestamp");
      setTimestampInput(trimmed);
      scrollToAndHighlight("timestamp");
    }
    // 4. Default Base64 / URL
    else {
      setDetectedType("base64");
      setBase64Input(trimmed);
      scrollToAndHighlight("base64");
    }
  };

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

  // ----------------------------------------------------
  // TOOL 1: DIFF CHECKER LOGIC
  // ----------------------------------------------------
  const getDiffResult = () => {
    const linesA = diffTextA.split("\n");
    const linesB = diffTextB.split("\n");
    const maxLength = Math.max(linesA.length, linesB.length);
    const results = [];

    for (let i = 0; i < maxLength; i++) {
      const lineA = linesA[i];
      const lineB = linesB[i];

      results.push({
        lineNum: i + 1,
        lineA: lineA !== undefined ? lineA : null,
        lineB: lineB !== undefined ? lineB : null,
        isDifferent: lineA !== lineB
      });
    }
    return results;
  };

  // ----------------------------------------------------
  // TOOL 2: JSON FORMATTER LOGIC (Derived State)
  // ----------------------------------------------------
  let jsonOutput = "";
  let jsonError = "";
  if (jsonInput.trim()) {
    try {
      const parsed = JSON.parse(jsonInput);
      if (jsonSpaces === "minify") {
        jsonOutput = JSON.stringify(parsed);
      } else {
        jsonOutput = JSON.stringify(parsed, null, jsonSpaces);
      }
    } catch (err) {
      jsonError = err instanceof Error ? err.message : "Invalid JSON syntax.";
    }
  }

  // ----------------------------------------------------
  // TOOL 3: JWT DECODER LOGIC (Derived State)
  // ----------------------------------------------------
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
              .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
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

  // ----------------------------------------------------
  // TOOL 4: TIMESTAMP CONVERTER LOGIC (Derived State)
  // ----------------------------------------------------
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

  const useCurrentTime = () => {
    setTimestampInput(Math.floor(Date.now() / 1000).toString());
  };

  // ----------------------------------------------------
  // TOOL 5: UUID GENERATOR LOGIC
  // ----------------------------------------------------
  const generateUuids = (count: number) => {
    const list = [];
    for (let i = 0; i < count; i++) {
      // Simple RFC4122 v4 UUID generator in pure JS
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    setGeneratedUuids(list);
  };



  // ----------------------------------------------------
  // TOOL 6: BASE64 & URL ENCODER/DECODER LOGIC
  // ----------------------------------------------------
  const getBase64Output = () => {
    if (!base64Input) return "";
    try {
      if (base64Action === "encode") {
        return btoa(base64Input);
      } else if (base64Action === "decode") {
        return atob(base64Input);
      } else if (base64Action === "urlEncode") {
        return encodeURIComponent(base64Input);
      } else if (base64Action === "urlDecode") {
        return decodeURIComponent(base64Input);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      return "Error: " + error;
    }
    return "";
  };

  const base64Output = getBase64Output();

  // ----------------------------------------------------
  // TOOL 7: HASH GENERATOR LOGIC
  // ----------------------------------------------------
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
        setSha256Output(sha256Array.map(b => b.toString(16).padStart(2, "0")).join(""));

        const sha1Buffer = await crypto.subtle.digest("SHA-1", msgUint8);
        const sha1Array = Array.from(new Uint8Array(sha1Buffer));
        setSha1Output(sha1Array.map(b => b.toString(16).padStart(2, "0")).join(""));
      } catch (err) {
        console.error("Cryptographic hash failure", err);
      }
    };
    computeHashes();
  }, [hashInput]);

  // Search filtering
  const filteredTools = TOOLS_LIST.filter(tool => 
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
        {/* Tool 1: Diff Checker */}
        {filteredTools.some(t => t.id === "diff") && (
          <div id="tool-diff" className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-emerald-400" />
                <h3 className="font-mono font-bold text-base text-zinc-100">Diff Checker</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Line-by-Line Code Comparison</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Text Block A (Original)</label>
                <textarea 
                  value={diffTextA}
                  onChange={(e) => setDiffTextA(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Text Block B (Modified)</label>
                <textarea 
                  value={diffTextB}
                  onChange={(e) => setDiffTextB(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
                />
              </div>
            </div>

            {/* Comparison Viewer Output */}
            <div className="space-y-1.5 font-mono text-xs max-h-[300px] overflow-y-auto border border-white/5 rounded-lg bg-zinc-950/80 p-3 terminal-scroll">
              {getDiffResult().map((res, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-0.5 border-b border-white/[0.02]">
                  <span className="col-span-1 text-zinc-600 text-right select-none">{res.lineNum}</span>
                  <div className="col-span-11 flex flex-col md:flex-row gap-2">
                    {res.isDifferent ? (
                      <>
                        <div className="flex-1 text-red-400 bg-red-950/30 px-1 py-0.5 rounded overflow-x-auto">
                          - {res.lineA !== null ? res.lineA : <span className="opacity-30 italic">EOF</span>}
                        </div>
                        <div className="flex-1 text-emerald-400 bg-emerald-950/30 px-1 py-0.5 rounded overflow-x-auto">
                          + {res.lineB !== null ? res.lineB : <span className="opacity-30 italic">EOF</span>}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 text-zinc-400 px-1 py-0.5 overflow-x-auto">
                        &nbsp;&nbsp;{res.lineA}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool 2: JSON Formatter & Validator */}
        {filteredTools.some(t => t.id === "json") && (
          <div id="tool-json" className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <FileJson size={18} className="text-emerald-400" />
                <h3 className="font-mono font-bold text-base text-zinc-100">JSON Formatter &amp; Validator</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Format, Minify &amp; Lint</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Input Raw String</label>
                  <textarea 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"name": "zvx-hub", "active": true}'
                    rows={8}
                    className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
                  />
                </div>
                 <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setJsonSpaces(2)} 
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${jsonSpaces === 2 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}
                  >
                    Format (2 Spaces)
                  </button>
                  <button 
                    onClick={() => setJsonSpaces(4)} 
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${jsonSpaces === 4 ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}
                  >
                    Format (4 Spaces)
                  </button>
                  <button 
                    onClick={() => setJsonSpaces("minify")} 
                    className={`px-3 py-1.5 rounded font-mono text-xs font-bold transition-all cursor-pointer ${jsonSpaces === "minify" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}
                  >
                    Minify
                  </button>
                  <button 
                    onClick={() => { setJsonInput(""); setJsonSpaces(2); }} 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded font-mono text-xs font-bold transition-all ml-auto cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-400 mb-1">Output Formatted Code</span>
                {jsonError ? (
                  <div className="flex-1 bg-red-950/20 border border-red-500/20 text-red-400 rounded-lg p-4 font-mono text-xs space-y-2 flex flex-col justify-center items-center text-center">
                    <AlertCircle size={24} className="text-red-400 mb-1" />
                    <span className="font-bold">JSON SYNTAX VALIDATION ERROR</span>
                    <p className="max-w-md opacity-85 leading-relaxed">{jsonError}</p>
                  </div>
                ) : (
                  <div className="flex-1 relative group">
                    <pre className="w-full h-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto max-h-[220px] terminal-scroll">
                      {jsonOutput || <span className="opacity-30 italic">No output yet. Enter valid JSON left.</span>}
                    </pre>
                    {jsonOutput && (
                      <button 
                        onClick={() => handleCopy(jsonOutput, "json-copy")}
                        className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to Clipboard"
                      >
                        {copiedId === "json-copy" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tool 3: JWT Decoder */}
        {filteredTools.some(t => t.id === "jwt") && (
          <div id="tool-jwt" className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-emerald-400" />
                <h3 className="font-mono font-bold text-base text-zinc-100">JWT Decoder</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Decode Encrypted JSON Tokens</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                    {/* Header */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                        <span>HEADER: ALGORITHM &amp; TOKEN TYPE</span>
                        {jwtHeader && (
                          <button onClick={() => handleCopy(jwtHeader, "jwt-h")} className="hover:text-emerald-400">
                            {copiedId === "jwt-h" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        )}
                      </div>
                      <pre className="bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-cyan-400 overflow-auto max-h-[140px] terminal-scroll whitespace-pre-wrap">
                        {jwtHeader || <span className="opacity-30 italic">Header output...</span>}
                      </pre>
                    </div>

                    {/* Payload */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                        <span>PAYLOAD: DATA CLAIMS</span>
                        {jwtPayload && (
                          <button onClick={() => handleCopy(jwtPayload, "jwt-p")} className="hover:text-emerald-400">
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

                {/* Signature Signature Section */}
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
        )}

        {/* Tools row 4 & 5 (Timestamp & UUID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 4: Timestamp Converter */}
          {filteredTools.some(t => t.id === "timestamp") && (
            <div id="tool-timestamp" className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-400" />
                  <h3 className="font-mono font-bold text-base text-zinc-100">Epoch Timestamp</h3>
                </div>
                <button 
                  onClick={useCurrentTime}
                  className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 px-2.5 py-1 rounded font-mono font-bold tracking-wider"
                >
                  Current Epoch
                </button>
              </div>

              <div className="space-y-4">
                {/* Epoch -> ISO Date */}
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Epoch Seconds/Ms</label>
                    <input 
                      type="text" 
                      value={timestampInput}
                      onChange={(e) => setTimestampInput(e.target.value)}
                      className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none"
                    />
                  </div>
                  <pre className="col-span-3 bg-zinc-950/80 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-zinc-400 overflow-x-auto min-h-[50px] leading-relaxed">
                    {dateOutput}
                  </pre>
                </div>

                {/* ISO Date -> Epoch */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="block text-xs font-mono text-zinc-500">ISO / CALENDAR DATE TO UNIX EPOCH</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. 2026-06-22T07:30:00Z"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="flex-1 bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none"
                    />
                    <button 
                      onClick={convertDateToTimestamp} 
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded font-mono"
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
          )}

          {/* Tool 5: UUID Generator */}
          {filteredTools.some(t => t.id === "uuid") && (
            <div id="tool-uuid" className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Clipboard size={18} className="text-emerald-400" />
                  <h3 className="font-mono font-bold text-base text-zinc-100">UUID v4 Generator</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-mono">Batch Size:</span>
                  <select 
                    value={uuidCount} 
                    onChange={(e) => {
                      const count = Number(e.target.value);
                      setUuidCount(count);
                      generateUuids(count);
                    }}
                    className="bg-zinc-950 border border-white/5 rounded text-xs font-mono text-zinc-300 px-1 py-0.5 outline-none"
                  >
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative group">
                  <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto min-h-[120px] max-h-[150px] terminal-scroll leading-relaxed">
                    {generatedUuids.join("\n")}
                  </pre>
                  <button 
                    onClick={() => handleCopy(generatedUuids.join("\n"), "uuid-copy")}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 rounded-md text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === "uuid-copy" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
                <button 
                  onClick={() => generateUuids(uuidCount)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Generate New Batches</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tools row 6 & 7 (Base64 & Hash Generator) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 6: Base64 / URL Encoder & Decoder */}
          {filteredTools.some(t => t.id === "base64") && (
            <div id="tool-base64" className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-emerald-400" />
                  <h3 className="font-mono font-bold text-base text-zinc-100">Base64 / URL Transmuter</h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Encode &amp; Decode Strings</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Input Text</label>
                  <textarea 
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setBase64Action("encode")} className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${base64Action === "encode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>Base64 Encode</button>
                  <button onClick={() => setBase64Action("decode")} className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${base64Action === "decode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>Base64 Decode</button>
                  <button onClick={() => setBase64Action("urlEncode")} className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${base64Action === "urlEncode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>URL Encode</button>
                  <button onClick={() => setBase64Action("urlDecode")} className={`px-2.5 py-1.5 rounded font-mono text-[10px] font-bold transition-colors cursor-pointer ${base64Action === "urlDecode" ? "bg-emerald-500 text-zinc-950" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>URL Decode</button>
                </div>

                <div className="relative group">
                  <pre className="w-full bg-zinc-950/80 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-auto max-h-[100px] terminal-scroll break-all leading-normal">
                    {base64Output}
                  </pre>
                  {base64Output && (
                    <button 
                      onClick={() => handleCopy(base64Output, "b64-copy")}
                      className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-white/5 rounded-md text-zinc-400 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === "b64-copy" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tool 7: Hash Generator */}
          {filteredTools.some(t => t.id === "hash") && (
            <div id="tool-hash" className="glass-panel p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Hash size={18} className="text-emerald-400" />
                  <h3 className="font-mono font-bold text-base text-zinc-100">Hash Generator</h3>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Secure Cryptographic Hashes</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Plain Text Input</label>
                  <input 
                    type="text" 
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full bg-zinc-950/70 border border-white/5 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  {/* SHA-256 */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-0.5">
                      <span>SHA-256 (32 bytes)</span>
                      {sha256Output && (
                        <button onClick={() => handleCopy(sha256Output, "hash-256")} className="hover:text-emerald-400">
                          {copiedId === "hash-256" ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        </button>
                      )}
                    </div>
                    <div className="bg-zinc-950/50 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-zinc-300 break-all select-all">
                      {sha256Output || <span className="opacity-30 italic">hash output...</span>}
                    </div>
                  </div>

                  {/* SHA-1 */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-0.5">
                      <span>SHA-1 (20 bytes)</span>
                      {sha1Output && (
                        <button onClick={() => handleCopy(sha1Output, "hash-1")} className="hover:text-emerald-400">
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
          )}
        </div>
      </div>
    </div>
  );
}
