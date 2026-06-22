import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool — ZVX Hub",
  description: "Developer utility tool",
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
      {children}
      <footer className="fixed bottom-3 right-4 z-50 flex items-center gap-3 text-[10px] font-mono text-zinc-700">
        <a
          href="https://zulvikar.is-a.dev"
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-400 transition-colors"
        >
          dev by zulvikar.is-a.dev
        </a>
        <span className="text-zinc-800">|</span>
        <a
          href="https://github.com/DycandX"
          target="_blank"
          rel="noreferrer"
          className="hover:text-emerald-400 transition-colors"
          aria-label="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
        </a>
      </footer>
    </div>
  );
}
