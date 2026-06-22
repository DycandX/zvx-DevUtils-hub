"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, CornerDownLeft } from "lucide-react";
import { NEOFETCH } from "./htmlarts";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info";
  text: string;
  isHtml?: boolean;
}

const COMMANDS = [
  "help",
  "neofetch",
  "clear",
  "date",
  "projects",
  "github",
  "markdown",
  "html",
  "number-base",
  "diff",
  "json",
  "jwt",
  "uuid",
  "base64",
  "hash",
  "timestamp",
];

const WELCOME_LINES: TerminalLine[] = [
  { type: "info", text: "ZVX Technical Command Shell v1.0.0" },
  { type: "info", text: "Type 'help' to see all available commands. Press [Tab] to autocomplete." },
  { type: "info", text: "---" }
];

export default function TerminalUI({
  onAdminLogin
}: {
  onAdminLogin: () => void;
}) {
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Password Mode States
  const [isPasswordMode, setIsPasswordMode] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll output buffer to bottom without scrolling the whole webpage
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [lines, isPasswordMode]);

  // Focus terminal input on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? -1 : historyIndex + 1;
      if (newIndex >= history.length || newIndex === -1) {
        setHistoryIndex(-1);
        setInputValue("");
      } else {
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      autocompleteCommand();
    }
  };

  const autocompleteCommand = () => {
    if (isPasswordMode) return;
    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput) return;

    const matchedCmds = COMMANDS.filter((cmd) => cmd.startsWith(trimmedInput));
    if (matchedCmds.length > 0) {
      setInputValue(matchedCmds[0]);
    }
  };

  const executeCommand = () => {
    const rawInput = inputValue;
    const cleanInput = rawInput.trim();
    setInputValue("");
    setHistoryIndex(-1);

    if (isPasswordMode) {
      handlePasswordInput(rawInput);
      return;
    }

    if (!cleanInput) return;

    // Save history
    setHistory(prev => [...prev, cleanInput]);

    // Append user input line
    setLines(prev => [...prev, { type: "input", text: `> ${cleanInput}` }]);

    const args = cleanInput.toLowerCase().split(" ");
    const cmd = args[0];

    switch (cmd) {
      case "help":
        setLines(prev => [
          ...prev,
          { type: "output", text: "Available Commands:" },
          { type: "output", text: "  neofetch    - Show system details and avatar info" },
          { type: "output", text: "  projects    - List active development ecosystem projects" },
          { type: "output", text: "  github      - Open Zulvikar's GitHub profile in a new tab" },
          { type: "output", text: "  clear       - Clear the screen buffer" },
          { type: "output", text: "  date        - Display current UTC and local timestamps" },
          { type: "output", text: "  " },
          { type: "output", text: "Workspace Tool Shortcuts (Opens & Switches Tab):" },
          { type: "output", text: "  markdown | html | number-base | diff | json | jwt | uuid | base64 | hash | timestamp" }
        ]);
        break;

      case "clear":
        setLines([]);
        break;

      case "date":
        setLines(prev => [
          ...prev,
          { type: "output", text: `Local Time: ${new Date().toLocaleString()}` },
          { type: "output", text: `UTC Epoch:  ${Math.floor(Date.now() / 1000)}` }
        ]);
        break;

      case "neofetch":
        setLines(prev => [
          ...prev,
          { type: "output", text: NEOFETCH }
        ]);
        break;

      case "projects":
        setLines(prev => [
          ...prev,
          { type: "output", text: "Active Ecosystem Repositories:" },
          { type: "output", text: "  [Online] Synapse-CS   - Web Terminal Admin & Controller -> github.com/DycandX/synapse-cs" },
          { type: "output", text: "  [Online] GeekPort CV  - Terminal portfolio website -> github.com/DycandX/zk-shell-cv" },
          { type: "output", text: "  [Online] ZVX Dev Hub  - Dynamic client utility dashboard -> github.com/DycandX/zvx-hub" },
          { type: "info", text: "Use dev_utils tool shortcuts to activate specific workspace modules." }
        ]);
        break;

      case "github":
        setLines(prev => [
          ...prev,
          { type: "success", text: "Opening github.com/DycandX in a new tab..." }
        ]);
        window.open("https://github.com/DycandX", "_blank");
        break;

      // Scroll shortcuts
      case "markdown":
      case "html":
      case "number-base":
      case "diff":
      case "json":
      case "jwt":
      case "uuid":
      case "base64":
      case "hash":
      case "timestamp":
        setLines(prev => [
          ...prev,
          { type: "success", text: `Opening developer tool: ${cmd.toUpperCase()}...` }
        ]);
        window.dispatchEvent(new CustomEvent("select-dev-tool", { detail: cmd }));
        setTimeout(() => {
          const el = document.getElementById("utils");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
        break;

      // Secret Admin Entrypoints
      case "su":
      case "admin":
      case "sudo":
        if (cmd === "sudo" && !["login", "admin"].includes(args[1])) {
          setLines(prev => [...prev, { type: "error", text: "Usage: sudo login | sudo admin" }]);
          break;
        }
        setIsPasswordMode(true);
        setLines(prev => [...prev, { type: "info", text: "Enter Password:" }]);
        break;

      default:
        // Try suggesting nearest command
        const suggestion = COMMANDS.find(c => c.startsWith(cmd) || cmd.startsWith(c));
        setLines(prev => [
          ...prev,
          {
            type: "error",
            text: `zvx-shell: Command not found: '${cmd}'. ${suggestion ? `Did you mean '${suggestion}'? ` : ""
              }Type 'help' for commands.`
          }
        ]);
        break;
    }
  };

  const handlePasswordInput = (pwd: string) => {
    setIsPasswordMode(false);

    // Check credentials (mocking for frontend-only view: password is 'zvx2026')
    if (pwd.trim() === "zvx2026") {
      setLines(prev => [
        ...prev,
        { type: "success", text: "Password verified. Access granted." },
        { type: "success", text: "Admin command dashboard session initialized. Welcome Zulvikar!" }
      ]);
      onAdminLogin();
    } else {
      setLines(prev => [
        ...prev,
        { type: "error", text: "Access Denied. Incorrect security credentials." }
      ]);
    }
  };

  // Inline ghost suggestion matching
  const getGhostSuggestion = () => {
    if (isPasswordMode || !inputValue.trim()) return "";
    const val = inputValue.trim().toLowerCase();
    const match = COMMANDS.find((cmd) => cmd.startsWith(val));
    if (match && match !== val) {
      return match.slice(val.length);
    }
    return "";
  };
  const ghostText = getGhostSuggestion();

  // Suggestion chips matching
  const getAutocompleteMatches = () => {
    if (isPasswordMode || !inputValue.trim()) return [];
    const val = inputValue.trim().toLowerCase();
    if (COMMANDS.includes(val)) return [];
    return COMMANDS.filter((cmd) => cmd.startsWith(val));
  };
  const suggestionMatches = getAutocompleteMatches();

  return (
    <div
      className="w-full glass-panel rounded-xl overflow-hidden border border-white/5 shadow-2xl flex flex-col h-[420px]"
      onClick={focusInput}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-emerald-400" />
          <span className="font-mono text-xs text-zinc-400 select-none">zvx-shell@dycandx: ~</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
        </div>
      </div>

      {/* Terminal Output Buffer */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto terminal-scroll font-mono text-sm sm:text-base space-y-2 select-text bg-zinc-950/45"
      >
        {lines.map((line, idx) => {
          if (line.isHtml) {
            return <div key={idx} dangerouslySetInnerHTML={{ __html: line.text }} />;
          }

          let colorClass = "text-zinc-300";
          if (line.type === "input") colorClass = "text-emerald-400 font-bold";
          else if (line.type === "error") colorClass = "text-red-400";
          else if (line.type === "success") colorClass = "text-emerald-400";
          else if (line.type === "info") colorClass = "text-cyan-400 italic";

          return (
            <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Autocomplete suggestion chips */}
      {!isPasswordMode && suggestionMatches.length > 0 && (
        <div className="px-4 py-2 bg-zinc-950/60 border-t border-white/5 flex flex-wrap items-center gap-1.5 font-mono text-xs sm:text-sm select-none">
          <span className="text-zinc-500 mr-1 font-bold">Suggestions:</span>
          {suggestionMatches.map((match) => (
            <button
              key={match}
              onClick={() => {
                setInputValue(match);
                inputRef.current?.focus();
              }}
              className="px-2.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-xs cursor-pointer animate-fade-in"
            >
              {match}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Command Input Field */}
      <div className="px-4 py-3 bg-zinc-950/80 border-t border-white/5 flex items-center gap-2">
        <span className="font-mono text-sm sm:text-base text-emerald-400 font-bold select-none">
          {isPasswordMode ? "Password: " : ">"}
        </span>
        <div className="flex-1 relative flex items-center">
          {/* Ghost Suggestion Overlay */}
          {ghostText && (
            <div className="absolute left-0 top-0 text-zinc-600 font-mono text-sm sm:text-base pointer-events-none select-none whitespace-pre flex items-center">
              <span className="opacity-0">{inputValue}</span>
              <span>{ghostText}</span>
            </div>
          )}
          <input
            ref={inputRef}
            type={isPasswordMode ? "password" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none font-mono text-sm sm:text-base text-zinc-100 caret-emerald-400 focus:ring-0 focus:outline-none p-0 select-text relative z-10"
            placeholder={isPasswordMode ? "••••••••" : "type a command (e.g. 'help', 'neofetch')..."}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {!inputValue && !isPasswordMode && (
            <div className="absolute right-0 text-[10px] sm:text-xs text-zinc-500 font-mono flex items-center gap-1 select-none pointer-events-none">
              <CornerDownLeft size={10} />
              <span>Enter to execute</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
