"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

interface MarkedCDN {
  parse: (text: string) => string;
}

interface MermaidCDN {
  initialize: (config: {
    startOnLoad: boolean;
    theme: string;
    securityLevel: string;
    flowchart: {
      useMaxWidth: boolean;
      htmlLabels: boolean;
    };
  }) => void;
  parse: (text: string) => Promise<void>;
  render: (id: string, text: string) => Promise<{ svg: string }>;
}

interface ExtendedWindow extends Window {
  marked?: MarkedCDN;
  mermaid?: MermaidCDN;
}


const SAMPLE_MARKDOWN = `# Markdown & Diagram Live Preview

Welcome to the live Markdown & Diagram Preview! Write standard markdown on the left and see it rendered instantly.

## Mermaid Flowcharts & Diagrams

You can write rich flowcharts, sequence diagrams, state diagrams, class diagrams, and more inside \`\`\`mermaid\`\`\` code blocks:

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Render Diagram!]
    B -- No --> D[Show Error Box]
    C --> E[Done]
    D --> E
\`\`\`

## Lists and Checklists

- [x] Standard Markdown features
- [x] Interactive Mermaid flowcharts
- [ ] Auto-scrolling editor layout

## Tables

| size | material | color |
|------|----------|-------|
| 9    | leather  | brown |
| 10   | hemp canvas | natural |
| 11   | glass    | transparent |

Use standard Markdown syntax to experiment!
`;

/**
 * MarkdownPreview Component
 * Renders an interactive markdown editor and parser client-side.
 * Connects marked + mermaid from CDNs to render GFM + diagrams dynamically.
 */
export default function MarkdownPreview() {
  const [markdownInput, setMarkdownInput] = useState(SAMPLE_MARKDOWN);
  const [outputMode, setOutputMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState("");

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Trigger clipboard paste
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setMarkdownInput(text);
    } catch {
      console.error("Failed to read clipboard");
    }
  };

  // Load marked and mermaid from CDN dynamically
  useEffect(() => {
    let active = true;
    const loadScripts = async () => {
      try {
        const win = window as unknown as ExtendedWindow;
        // Load marked
        if (!win.marked) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
          });
        }
        // Load mermaid
        if (!win.mermaid) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
          });
        }

        // Initialize mermaid
        if (win.mermaid) {
          win.mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            securityLevel: "loose",
            flowchart: { useMaxWidth: true, htmlLabels: true }
          });
        }

        if (active) {
          setLibsLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load marked or mermaid from CDN", err);
      }
    };
    loadScripts();
    return () => {
      active = false;
    };
  }, []);

  // Parse markdown and render mermaid blocks asynchronously on change
  useEffect(() => {
    if (!libsLoaded) return;

    let active = true;
    const renderMarkdown = async () => {
      try {
        const win = window as unknown as ExtendedWindow;
        const marked = win.marked;
        const mermaid = win.mermaid;

        if (!marked) return;

        // Parse markdown with marked
        let htmlContent = marked.parse(markdownInput);

        // Render mermaid blocks asynchronously
        if (mermaid) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, "text/html");
          const codeElements = doc.querySelectorAll("pre code.language-mermaid");

          for (let i = 0; i < codeElements.length; i++) {
            const codeEl = codeElements[i];
            const codeText = codeEl.textContent || "";
            const id = `mermaid-diag-${Date.now()}-${i}`;

            try {
              // Parse syntax
              await mermaid.parse(codeText);
              // Render SVG
              const { svg } = await mermaid.render(id, codeText);
              const parent = codeEl.parentElement;
              if (parent) {
                const wrapper = doc.createElement("div");
                wrapper.className = "mermaid-diagram flex justify-center my-4 p-4 bg-zinc-900/30 rounded-lg border border-white/5 overflow-x-auto";
                wrapper.innerHTML = svg;
                parent.replaceWith(wrapper);
              }
            } catch (err) {
              console.warn("Failed to render diagram element:", err);
              // Fallback to error warning
              const errorWrapper = doc.createElement("pre");
              errorWrapper.className = "text-red-400 bg-red-950/20 border border-red-500/20 rounded p-3 text-xs font-mono my-2 whitespace-pre-wrap break-all";
              errorWrapper.innerText = `[Mermaid Render Error]:\n${err instanceof Error ? err.message : String(err)}`;
              codeEl.parentElement?.replaceWith(errorWrapper);
            }
          }
          htmlContent = doc.body.innerHTML;
        }

        if (active) {
          setRenderedHtml(htmlContent);
        }
      } catch (err) {
        console.error("Markdown parse exception:", err);
      }
    };

    renderMarkdown();

    return () => {
      active = false;
    };
  }, [markdownInput, libsLoaded]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Scoped CSS styling for preview container */}
      <style jsx global>{`
        .markdown-rendered-body h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #f4f4f5;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.4rem;
          margin-top: 1.4rem;
          margin-bottom: 0.8rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .markdown-rendered-body h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #f4f4f5;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.2rem;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .markdown-rendered-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f4f4f5;
          margin-top: 1.1rem;
          margin-bottom: 0.5rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .markdown-rendered-body p {
          line-height: 1.6;
          margin-bottom: 0.8rem;
          color: #d4d4d8;
        }
        .markdown-rendered-body ul {
          list-style-type: disc;
          padding-left: 1.3rem;
          margin-bottom: 0.8rem;
          color: #d4d4d8;
        }
        .markdown-rendered-body ol {
          list-style-type: decimal;
          padding-left: 1.3rem;
          margin-bottom: 0.8rem;
          color: #d4d4d8;
        }
        .markdown-rendered-body li {
          margin-bottom: 0.2rem;
        }
        .markdown-rendered-body table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0.8rem;
          font-size: 0.8rem;
        }
        .markdown-rendered-body th, .markdown-rendered-body td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.4rem 0.6rem;
          text-align: left;
        }
        .markdown-rendered-body th {
          background-color: rgba(255, 255, 255, 0.05);
          font-weight: bold;
          color: #e4e4e7;
        }
        .markdown-rendered-body blockquote {
          border-left: 4px solid #10b981;
          background-color: rgba(16, 185, 129, 0.05);
          padding: 0.6rem 0.8rem;
          margin-bottom: 0.8rem;
          color: #a1a1aa;
        }
        .markdown-rendered-body code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.8rem;
          background-color: rgba(255, 255, 255, 0.08);
          padding: 0.1rem 0.25rem;
          border-radius: 0.2rem;
          color: #67e8f9;
        }
        .markdown-rendered-body pre {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.8rem;
          border-radius: 0.4rem;
          overflow-x: auto;
          margin-bottom: 0.8rem;
        }
        .markdown-rendered-body pre code {
          background-color: transparent;
          padding: 0;
          color: #e4e4e7;
        }
        .markdown-rendered-body a {
          color: #34d399;
          text-decoration: underline;
        }
        .markdown-rendered-body a:hover {
          color: #6ee7b7;
        }
        .markdown-rendered-body input[type="checkbox"] {
          margin-right: 0.4rem;
          accent-color: #10b981;
        }
      `}</style>

      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Input Markdown</span>
          <button
            onClick={handlePasteFromClipboard}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Clipboard
          </button>
          <button
            onClick={() => setMarkdownInput(SAMPLE_MARKDOWN)}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer font-semibold"
          >
            Sample
          </button>
          <button
            onClick={() => setMarkdownInput("")}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Code area */}
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="flex-1 bg-transparent p-4 outline-none font-mono text-sm text-zinc-200 resize-none overflow-y-auto leading-relaxed border-none focus:ring-0 focus:outline-none"
          placeholder="Type or paste markdown string here..."
        />
      </div>

      {/* Output panel (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Output Preview</span>
          {outputMode === "html" && (
            <button
              onClick={() => handleCopy(renderedHtml)}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer flex items-center gap-1 font-semibold"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>Copy HTML</span>
            </button>
          )}
          <select
            value={outputMode}
            onChange={(e) => setOutputMode(e.target.value as "preview" | "html")}
            className="bg-zinc-800 border border-white/5 text-zinc-300 rounded px-2 py-1 text-xs outline-none focus:border-emerald-500/30 cursor-pointer font-semibold"
          >
            <option value="preview">Preview Mode</option>
            <option value="html">Raw HTML Code</option>
          </select>
        </div>
        {/* View area */}
        <div className="flex-1 p-4 overflow-y-auto leading-relaxed select-text bg-zinc-950/25">
          {!libsLoaded ? (
            <div className="h-full flex items-center justify-center font-mono text-xs text-zinc-500 animate-pulse">
              <span>Loading markdown & diagram engine...</span>
            </div>
          ) : (
            outputMode === "preview" ? (
              renderedHtml ? (
                <div
                  className="font-sans text-sm text-zinc-300 space-y-4 markdown-rendered-body"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              ) : (
                <span className="font-mono text-xs text-zinc-600 italic">No preview output yet.</span>
              )
            ) : (
              <pre className="font-mono text-xs text-cyan-400 whitespace-pre-wrap break-all">
                {renderedHtml || <span className="text-zinc-600 italic">No output yet.</span>}
              </pre>
            )
          )}
        </div>
      </div>
    </div>
  );
}
