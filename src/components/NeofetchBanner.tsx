"use client";

import { ART_LINES } from "./htmlArt";

const INFO_LINES = [
  "zvx@zvx-hub",
  "-----------",
  "OS:        Next.js 16 (App Router)",
  "Host:      zvx.is-a.dev (Production)",
  "Kernel:    React 19 / Tailwind v4",
  "Uptime:    99.98% (Operational)",
  "Shell:     zvx-shell 1.0.0",
  "Memory:    Client-Side State Process",
  "Developer: DycandX",
  "Focus:     Computer Eng. Student @ Polines",
  "Projects:  Full-Stack / Embedded IoT",
];

const LINES = ART_LINES.map((line, i) =>
  i < INFO_LINES.length ? line + INFO_LINES[i] : line
);

export default function NeofetchBanner() {
  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre">
      {LINES.map((line, i) => {
        const art = line.slice(0, 22);
        const info = line.slice(22);
        const isHeader = art.startsWith("Z V X") || art.trim().startsWith("/");
        const isSep = info.trim() === "-----------" || art.trim() === "-------------";
        return (
          <div key={i} className="flex">
            <span className={isHeader ? "text-emerald-400 font-bold" : "text-zinc-500"}>{art}</span>
            <span className={isSep ? "text-zinc-600" : "text-zinc-300"}>{info}</span>
          </div>
        );
      })}
    </div>
  );
}
