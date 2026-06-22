"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TerminalUI from "@/components/TerminalUI";
import DevUtils from "@/components/DevUtils";
import { Cpu, Server, Network, Terminal as TermIcon, ShieldAlert, Mail, Globe, ArrowUpRight } from "lucide-react";

/**
 * Custom SVG GithubIcon to avoid version mismatch issues
 */
const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 bg-dot-grid text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Navbar */}
      <Navbar isAdmin={isAdmin} onAdminLogout={handleAdminLogout} />

      {/* Admin Alert Bar */}
      {isAdmin && (
        <div className="bg-emerald-950/40 border-b border-emerald-500/30 text-emerald-400 py-2.5 px-4 text-xs font-mono text-center flex items-center justify-center gap-2 animate-pulse-soft">
          <ShieldAlert size={14} />
          <span>ADMINISTRATOR SESSION CONSOLE ACTIVE. PRIVILEGED ACCESS GRANTED.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-3 sm:px-4 lg:px-6 py-10 sm:py-16 space-y-16">
        
        {/* Hero Section & Overview (Dev Utilities Focus) */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider font-bold">
            <Cpu size={12} className="animate-spin [animation-duration:10s]" />
            <span>zvx.is-a.dev // developer swiss army knife</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-emerald-400 to-cyan-400 leading-tight">
            ZVX Dev Utilities Hub
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-mono">
            A comprehensive, client-side developer swiss army knife consolidating essential browser tools—from formatting, validating, and token decoding to diff checking, hashing, and batch UUID generation. Built to run entirely offline inside your browser tab, ensuring your sensitive data never leaves your machine.
          </p>

          {/* Quick Hardware Spec Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <Server size={14} className="text-emerald-500" />
              <div>
                <span className="text-zinc-400 block font-bold">HOST DOMAIN</span>
                <span>zvx.is-a.dev</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <Network size={14} className="text-cyan-500" />
              <div>
                <span className="text-zinc-400 block font-bold">ENVIRONMENT</span>
                <span>Vercel Edge Network</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <TermIcon size={14} className="text-violet-500" />
              <div>
                <span className="text-zinc-400 block font-bold">CLI RUNTIME</span>
                <span>zvx-shell 1.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Terminal TUI Emulator */}
        <section id="terminal" className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span>[F-01] INTERACTIVE TERMINAL EMULATOR</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>
          <TerminalUI onAdminLogin={handleAdminLogin} />
        </section>

        {/* Section 2: Dev Utilities */}
        <section className="pt-4">
          <DevUtils />
        </section>

      </main>      {/* Professional Footer (Best Practice) */}
      <footer className="w-full border-t border-white/5 bg-zinc-950/80 font-mono text-sm text-zinc-500 pt-12 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/5">
          {/* Column 1: Brand details */}
          <div className="space-y-3">
            <span className="font-bold text-zinc-300 tracking-wider text-sm flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ZVX Technical Hub
            </span>
            <p className="text-zinc-500 leading-relaxed text-xs sm:text-sm">
              Consolidating mission-critical local client utilities and technical playgrounds for the developer community. No telemetry tracking, zero cookies, 100% browser-contained execution.
            </p>
          </div>

          {/* Column 2: Navigation & Quick Links */}
          <div className="space-y-3">
            <span className="font-bold text-zinc-400 tracking-wider text-xs block uppercase">Quick Navigation</span>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <a href="#terminal" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  &gt; terminal_emulator
                </a>
              </li>
              <li>
                <a href="#utils" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  &gt; dev_utilities_hub
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  &gt; privacy_policy
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  &gt; back_to_top
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-3">
            <span className="font-bold text-zinc-400 tracking-wider text-xs block uppercase">Developer Contact</span>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a 
                  href="mailto:zulvikar.kharisma22@gmail.com" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail size={12} className="text-zinc-500" />
                  <span>zulvikar.kharisma22@gmail.com</span>
                  <ArrowUpRight size={10} className="opacity-50" />
                </a>
              </li>
              <li>
                <a 
                  href="https://zulvikar.is-a.dev" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Globe size={12} className="text-zinc-500" />
                  <span>Main Portfolio (zulvikar.is-a.dev)</span>
                  <ArrowUpRight size={10} className="opacity-50" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/DycandX" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon size={12} />
                  <span>GitHub Profile (DycandX)</span>
                  <ArrowUpRight size={10} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-zinc-650">
          <div>
            &copy; 2026 ZVX Hub. Built for productivity.
          </div>
          <div>
            Status: <span className="text-emerald-500 font-bold uppercase tracking-wider">● All Nodes Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
