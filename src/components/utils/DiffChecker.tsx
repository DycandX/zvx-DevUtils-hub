"use client";

import React, { useState } from "react";
import { Layers } from "lucide-react";

/**
 * DiffChecker Component
 * Performs a line-by-line comparison between two text blocks,
 * highlighting additions in green (+) and deletions in red (-).
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
    <div id="tool-diff" className="glass-panel p-6 rounded-xl space-y-4">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-emerald-400" />
          <h3 className="font-mono font-bold text-base text-zinc-100">Diff Checker</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Line-by-Line Code Comparison</span>
      </div>

      {/* Input textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Text Block A (Original)
          </label>
          <textarea
            value={diffTextA}
            onChange={(e) => setDiffTextA(e.target.value)}
            rows={6}
            className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Text Block B (Modified)
          </label>
          <textarea
            value={diffTextB}
            onChange={(e) => setDiffTextB(e.target.value)}
            rows={6}
            className="w-full bg-zinc-950/70 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:border-emerald-500/50 outline-none"
          />
        </div>
      </div>

      {/* Diff comparison output list */}
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
  );
}
