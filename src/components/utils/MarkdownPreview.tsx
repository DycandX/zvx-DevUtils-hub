"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const SAMPLE_MARKDOWN = `Here's a link to [a website](https://foo.bar). Here's a link to [local doc](local-doc.html). Here's a footnote [^1].

[^1]: Footnote text goes here.

### Preview ###

Tables can look like this:

| size | material | color |
|------|----------|-------|
| 9    | leather  | brown |
| 10   | hemp canvas | natural |
| 11   | glass    | transparent |
| 11   | glass    | transparent |
| 11   | glass    | transparent |

You can specify alignment for each column by adding colons to separator lines. A colon at the left of the separator line will make the column left-aligned; a colon on the right of the line will make the column right-aligned; colons at both side means the column is center-aligned.

| Item | Description | Value |
|:-----|:-----------:|------:|
| Computer | Desktop PC | $1600 |
| Phone | iPhone 5s | $12 |
| Pipe | Steel Pipe | $1 |

You can apply span-level formatting to the text.`;

/**
 * MarkdownPreview Component
 * Renders an interactive markdown editor and parser client-side.
 * Matches the layout and style of the DevUtils macOS application screen.
 */
export default function MarkdownPreview() {
  const [markdownInput, setMarkdownInput] = useState(SAMPLE_MARKDOWN);
  const [outputMode, setOutputMode] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

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
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  // Custom parser logic matching standard GFM features shown in the screenshot
  const parseMarkdownToHtml = (md: string) => {
    if (!md) return "";

    // Escape basic HTML tags to prevent XSS
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-zinc-100 mt-4 mb-2 font-mono">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-zinc-100 mt-6 mb-3 border-b border-white/5 pb-1 font-mono">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold text-zinc-100 mt-8 mb-4 border-b border-white/10 pb-2 font-mono">$1</h1>');

    // Footnote superscripts
    html = html.replace(/\[\^([^\]]+)\]/g, '<sup class="text-emerald-400 font-bold font-mono cursor-pointer" title="Footnote: $1">$1</sup>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-emerald-400 hover:underline font-mono inline-flex items-center gap-0.5">$1</a>');

    // Bold text
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-zinc-100 font-bold">$1</strong>');

    // Parse tables row by row
    const lines = html.split("\n");
    const parsedLines: string[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line.split("|").slice(1, -1).map(c => c.trim());
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
          // Skip the separator line (e.g. |---|---|)
          i++;
        } else {
          tableRows.push(cells);
        }
      } else {
        if (inTable) {
          // Render accumulated table rows into HTML
          let tableHtml = '<table class="w-full border-collapse my-3 font-mono text-xs border border-white/10"><thead class="bg-zinc-900/60 text-zinc-300"><tr>';
          tableHeaders.forEach(h => {
            tableHtml += `<th class="border border-white/10 px-3 py-1.5 text-left font-bold">${h}</th>`;
          });
          tableHtml += '</tr></thead><tbody class="text-zinc-400">';
          tableRows.forEach(row => {
            tableHtml += '<tr class="border-b border-white/5 hover:bg-white/[0.01]">';
            row.forEach(cell => {
              tableHtml += `<td class="border border-white/10 px-3 py-1.5">${cell}</td>`;
            });
            tableHtml += '</tr>';
          });
          tableHtml += '</tbody></table>';
          parsedLines.push(tableHtml);

          inTable = false;
          tableHeaders = [];
          tableRows = [];
        }
        parsedLines.push(line);
      }
    }

    // Clean up line breaks
    return parsedLines.join("\n").replace(/\n/g, "<br/>");
  };

  const renderedHtml = parseMarkdownToHtml(markdownInput);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
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
          {outputMode === "preview" ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
