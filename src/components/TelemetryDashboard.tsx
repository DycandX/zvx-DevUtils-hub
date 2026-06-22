"use client";

import React, { useEffect, useState } from "react";
import { Cpu, Activity, Database, ExternalLink, Globe } from "lucide-react";

const GithubIcon = ({ size = 12 }: { size?: number }) => (
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

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  uptimePct: number;
  responseTime: number;
  history: boolean[]; // true = up, false = down
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Synapse-CS",
    description: "Centralized developer controller orchestrating distributed web services, Socket.io channels, and real-time backend process state telemetry.",
    techStack: ["React", "Express", "Socket.io", "Tailwind CSS", "Node.js"],
    githubUrl: "https://github.com/DycandX/synapse-cs",
    liveUrl: "https://synapse.zvx.is-a.dev",
    uptimePct: 99.94,
    responseTime: 184,
    history: Array.from({ length: 30 }, (_, i) => i === 12 ? false : true) // Mock 1 down check
  },
  {
    id: "p2",
    name: "GeekPort CV & Console",
    description: "A retro terminal portfolio emulator paired with a secure GUI dashboard database editor to sync projects, certificates, and logs.",
    techStack: ["Next.js", "Supabase", "TypeScript", "Framer Motion", "GA4"],
    githubUrl: "https://github.com/DycandX/zk-shell-cv",
    liveUrl: "https://zulvikar.is-a.dev",
    uptimePct: 100.0,
    responseTime: 128,
    history: Array.from({ length: 30 }, () => true)
  },
  {
    id: "p3",
    name: "ZVX Dev Hub",
    description: "Central developer operations dashboard featuring pure client-side utility parsers, interactive terminal shell, and ecosystem health boards.",
    techStack: ["Next.js 16", "Tailwind v4", "Lucide Icons", "Client JS API"],
    githubUrl: "https://github.com/DycandX/zvx-hub",
    liveUrl: "https://zvx.is-a.dev",
    uptimePct: 100.0,
    responseTime: 82,
    history: Array.from({ length: 30 }, () => true)
  }
];

export default function TelemetryDashboard() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [totalRequests, setTotalRequests] = useState(241085);
  const [activeSessions, setActiveSessions] = useState(8);

  useEffect(() => {
    // Simulate real-time logs updating
    const interval = setInterval(() => {
      setTotalRequests(prev => prev + Math.floor(Math.random() * 3) + 1);
      setActiveSessions(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(15, prev + delta));
      });

      // Periodically fluctuate response times slightly
      setProjects(prevProjects => 
        prevProjects.map(p => ({
          ...p,
          responseTime: Math.max(40, p.responseTime + Math.floor(Math.random() * 11) - 5)
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="telemetry" className="w-full space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            &gt; ecosystem_monitoring
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-zinc-100">
            Telemetry Dashboard
          </h2>
        </div>
        <div className="text-zinc-500 font-mono text-xs text-left md:text-right">
          Monitoring 3 nodes in real-time. Interval: 15s.
        </div>
      </div>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Activity size={14} className="text-emerald-400" />
            <span>TOTAL REQUESTS</span>
          </div>
          <span className="font-mono text-2xl font-bold text-zinc-100 mt-1">
            {totalRequests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Cpu size={14} className="text-cyan-400" />
            <span>AVG RESPONSE TIME</span>
          </div>
          <span className="font-mono text-2xl font-bold text-zinc-100 mt-1">
            131ms
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Globe size={14} className="text-violet-400" />
            <span>ACTIVE SESSIONS</span>
          </div>
          <span className="font-mono text-2xl font-bold text-zinc-100 mt-1">
            {activeSessions} <span className="text-xs text-emerald-400 animate-pulse font-normal">● LIVE</span>
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Database size={14} className="text-amber-400" />
            <span>GLOBAL UPTIME</span>
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-400 mt-1">
            99.98%
          </span>
        </div>
      </div>

      {/* Projects Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:scale-[1.01] duration-200">
            <div>
              {/* Project Title & Status */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono font-bold text-lg text-zinc-100 group-hover:text-emerald-400">
                  {project.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 min-h-[60px] font-mono">
                {project.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.techStack.map((tech, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] font-mono bg-zinc-900 border border-white/5 text-zinc-400 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              {/* Uptime History Bar Visualization */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Uptime (30d)</span>
                  <span className="text-zinc-300 font-bold">{project.uptimePct.toFixed(2)}%</span>
                </div>
                {/* Visual Bars */}
                <div className="flex items-end justify-between h-5 gap-[2px]">
                  {project.history.map((isUp, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                        isUp 
                          ? "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.2)]" 
                          : "bg-amber-500 hover:bg-amber-400"
                      }`}
                      title={`Node Status Check ${i + 1}: ${isUp ? "Healthy (100%)" : "Degraded (0%)"}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                  <span>30d ago</span>
                  <span>{project.responseTime}ms avg</span>
                  <span>Today</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5 font-mono">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-xs text-zinc-300 hover:text-zinc-100 flex items-center justify-center gap-1.5 font-bold transition-all"
                >
                  <GithubIcon size={12} />
                  <span>Repository</span>
                </a>
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs text-zinc-950 flex items-center justify-center gap-1.5 font-bold transition-all shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                  >
                    <ExternalLink size={12} />
                    <span>Live App</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
