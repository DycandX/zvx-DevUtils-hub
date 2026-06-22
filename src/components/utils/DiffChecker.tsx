"use client";

import React, { useState } from "react";

/**
 * DiffChecker Component
 * Compares two text blocks line-by-line, displaying the diff table on the right column.
 */
export default function DiffChecker() {
  const [diffTextA, setDiffTextA] = useState(
    "const app = {\n  name: 'zvx-hub',\n  version: '1.0.0',\n  active: true\n};"
  );
  const [diffTextB, setDiffTextB] = useState(
    "const app = {\n  name: 'zvx-hub',\n  version: '1.0.0',\n  active: false,\n  env: 'production'\n};"
  );

  // Computes difference between lines of A and B
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
        isDifferent: lineA !== lineB,
      });
    }
    return results;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
      {/* Input panel (Left) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Inputs (Original &amp; Modified)</span>
          <button
            onClick={() => {
              setDiffTextA("");
              setDiffTextB("");
            }}
            className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer font-semibold"
          >
            Clear
          </button>
        </div>
        {/* Input fields */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
          <div className="flex-1 flex flex-col min-h-[150px]">
            <label className="text-[10px] font-mono text-zinc-500 mb-1 uppercase font-bold">Text Block A (Original)</label>
            <textarea
              value={diffTextA}
              onChange={(e) => setDiffTextA(e.target.value)}
              className="flex-1 w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none resize-none"
              placeholder="Paste original text here..."
            />
          </div>
          <div className="flex-1 flex flex-col min-h-[150px]">
            <label className="text-[10px] font-mono text-zinc-500 mb-1 uppercase font-bold">Text Block B (Modified)</label>
            <textarea
              value={diffTextB}
              onChange={(e) => setDiffTextB(e.target.value)}
              className="flex-1 w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none resize-none"
              placeholder="Paste modified text here..."
            />
          </div>
        </div>
      </div>

      {/* Output Comparison (Right) */}
      <div className="flex flex-col h-full bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center gap-2 text-xs font-mono select-none">
          <span className="text-zinc-500 mr-auto font-bold uppercase tracking-wider text-[10px]">Comparison Result</span>
        </div>
        {/* Comparison Output viewer */}
        <div className="flex-1 p-4 overflow-y-auto leading-relaxed bg-zinc-950/20 space-y-1.5 font-mono text-xs terminal-scroll">
          {getDiffResult().map((res, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 py-0.5 border-b border-white/[0.02]">
              <span className="col-span-1 text-zinc-600 text-right select-none">{res.lineNum}</span>
              <div className="col-span-11 flex flex-col gap-1">
                {res.isDifferent ? (
                  <>
                    <div className="text-red-400 bg-red-950/30 px-1.5 py-0.5 rounded overflow-x-auto break-all">
                      - {res.lineA !== null ? res.lineA : <span className="opacity-30 italic">EOF</span>}
                    </div>
                    <div className="text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded overflow-x-auto break-all">
                      + {res.lineB !== null ? res.lineB : <span className="opacity-30 italic">EOF</span>}
                    </div>
                  </>
                ) : (
                  <div className="text-zinc-400 px-1.5 py-0.5 overflow-x-auto break-all">
                    &nbsp;&nbsp;{res.lineA}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
