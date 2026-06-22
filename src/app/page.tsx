"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import TerminalUI from "@/components/TerminalUI";
import TelemetryDashboard from "@/components/TelemetryDashboard";
import DevUtils from "@/components/DevUtils";
import { Cpu, Server, Network, Terminal as TermIcon, ShieldAlert } from "lucide-react";

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
          <span>ADMINISTRATOR SESSION CONSOLE ACTIVE. MOCK PRIVILEGED DATABASE LOGS ARE NOW VISIBLE ON THE SYSTEM TERMINAL.</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        
        {/* Hero Section & Overview */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider font-bold">
            <Cpu size={12} className="animate-spin [animation-duration:10s]" />
            <span>zvx.is-a.dev // developer command center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-emerald-400 to-cyan-400 leading-tight">
            ZVX Personal Dev Hub &amp; Dashboard
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-mono">
            A high-performance technical hub consolidating system telemetries of Zulvikar&apos;s active developer ecosystem, combined with interactive client-side developer utility tools running purely in your browser.
          </p>

          {/* Quick Hardware Spec Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-zinc-900/50 border border-white/5">
              <Server size={14} className="text-emerald-500" />
              <div>
                <span className="text-zinc-400 block font-bold">HOST NODE</span>
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
            <span>[F-03] TERMINAL USER INTERFACE</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>
          <TerminalUI onAdminLogin={handleAdminLogin} />
        </section>

        {/* Section 2: Telemetry Dashboard */}
        <section className="pt-4">
          <TelemetryDashboard />
        </section>

        {/* Section 3: Dev Utilities */}
        <section className="pt-4">
          <DevUtils />
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-zinc-950/80 font-mono text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            &copy; 2026 ZVX Hub. Built for the developer community.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-emerald-400 cursor-pointer">zvx.is-a.dev</span>
            <span>&bull;</span>
            <span className="hover:text-cyan-400 cursor-pointer">DycandX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
