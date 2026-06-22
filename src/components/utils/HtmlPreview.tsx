"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const SAMPLE_HTML = `<div style="font-family: system-ui, sans-serif; padding: 20px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);">
  <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Live HTML Preview</h1>
  <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.6;">
    Modify this HTML code on the left and see it update instantly inside this sandboxed container!
  </p>
  <button style="margin-top: 15px; padding: 8px 16px; background: white; border: none; border-radius: 6px; color: #10b981; font-weight: bold; font-size: 12px; cursor: pointer; transition: all 0.2s;" onclick="alert('Hello from preview!')">
    Interactive Button
  </button>
</div>`;

/**
 * HtmlPreview Component
 * Renders raw HTML code inside a sandboxed iframe to allow secure live web page prototyping.
 */
export default function HtmlPreview() {
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);
  const [copied, setCopied] = useState(false);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setHtmlInput(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  // Safe frame rendering
  const getIframeSrcDoc = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 12px; background: transparent; color: #e4e4e7; }
          </style>
        </head>
        <body>
          ${htmlInput}
        </body>
      </html>
    `;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input Panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">HTML Input Code</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => setHtmlInput(SAMPLE_HTML)}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Sample
          </button>
          <button
            onClick={() => setHtmlInput("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Text Area */}
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-cyan-400 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
          placeholder="Paste or write HTML here..."
        />
      </div>

      {/* Output Preview (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Live Render Panel</span>
          <button
            onClick={() => handleCopy(htmlInput)}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer flex items-center gap-1 font-semibold"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>Copy Code</span>
          </button>
        </div>
        {/* IFrame Viewport */}
        <iframe
          title="live-html-preview"
          srcDoc={getIframeSrcDoc()}
          sandbox="allow-scripts"
          className="flex-1 bg-zinc-950/30 border-none p-2 w-full h-full"
        />
      </div>
    </div>
  );
}
