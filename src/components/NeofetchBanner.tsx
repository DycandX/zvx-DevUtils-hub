"use client";

import { motion } from "framer-motion";
import { htmlArt } from "./htmlArt";

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

export default function NeofetchBanner() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 mb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-full overflow-x-auto rounded border border-neutral-800/50"
        dangerouslySetInnerHTML={{ __html: htmlArt }}
      />
      <div className="font-mono text-sm leading-relaxed whitespace-pre text-zinc-300">
        {INFO_LINES.join("\n")}
      </div>
    </div>
  );
}
