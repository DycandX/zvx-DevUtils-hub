"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Shield, FileText, Mail } from "lucide-react";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-dot-grid text-zinc-200 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400 font-sans">
      {/* Privacy Policy Header */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center transition-all duration-300 group-hover:border-emerald-500/60 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Terminal size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-base tracking-wider text-zinc-100 group-hover:text-emerald-400 transition-colors">
                ZVX.HUB
              </span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider -mt-1">
                Privacy Policy
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 space-y-12 leading-relaxed">
        {/* Title Block */}
        <div className="space-y-3 border-b border-white/5 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono tracking-wider font-bold">
            <FileText size={12} />
            <span>zvx.is-a.dev // policies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 font-mono">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-mono">
            Last updated: 2026-06-22 &middot; Effective immediately
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-zinc-300 text-sm sm:text-base">
          {/* 1. Summary */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Summary
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                ZVX Hub runs entirely in your browser. All tool inputs, transformations, and outputs stay on your device. We do not operate servers that receive, process, or store your data. No accounts. No logins. No tracking.
              </p>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4 text-emerald-400 text-sm space-y-1">
                <p className="font-bold flex items-center gap-2">
                  <Shield size={14} />
                  Zero-Trust Architecture
                </p>
                <p className="text-emerald-400/70">
                  Your sensitive data — JWTs, API keys, certificates, database credentials — never leaves this browser tab.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Data We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Data We Collect
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                We collect <strong className="text-zinc-200">zero personal data</strong>. Specifically:
              </p>
              <ul className="space-y-2 text-zinc-400 list-disc pl-5 font-mono text-sm">
                <li className="pl-2">No personal identifiers (name, email, phone, address)</li>
                <li className="pl-2">No tool inputs or outputs</li>
                <li className="pl-2">No IP address logging</li>
                <li className="pl-2">No user-agent tracking</li>
                <li className="pl-2">No session recording or replay</li>
                <li className="pl-2">No analytics or telemetry</li>
              </ul>
              <p className="text-zinc-500 text-sm">
                The only data that exists is what you choose to type into a tool. That data exists exclusively in browser memory and is discarded on page refresh or navigation.
              </p>
            </div>
          </section>

          {/* 3. Local Storage */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Local Storage
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                Some tools may use your browser&apos;s <code className="text-emerald-400 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">localStorage</code> to persist non-sensitive preferences (e.g., theme selection, collapsed sidebar state). This data:
              </p>
              <ul className="space-y-2 text-zinc-400 list-disc pl-5 font-mono text-sm">
                <li className="pl-2">Stays on your device — never transmitted</li>
                <li className="pl-2">Can be cleared at any time via browser settings</li>
                <li className="pl-2">Contains no personal information or tool data</li>
              </ul>
            </div>
          </section>

          {/* 4. Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Cookies
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                ZVX Hub does <strong className="text-zinc-200">not</strong> use cookies for tracking, profiling, or analytics. No first-party or third-party tracking cookies are set.
              </p>
              <p className="text-zinc-500 text-sm">
                If deployed behind Vercel or Cloudflare, their edge network may set strictly-essential HTTP cookies for CDN functionality (load balancing, caching). These cookies contain no personal data and are not used for tracking.
              </p>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Third-Party Services
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                ZVX Hub loads no third-party scripts, fonts, or analytics. All dependencies are bundled at build time and served from the same origin.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                The site is hosted on <strong className="text-zinc-200">Vercel</strong>. Vercel&apos;s edge network processes HTTP requests to serve static assets but does not log tool inputs or user activity. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Vercel&apos;s Privacy Policy</a> for their handling of edge-network metadata.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                External links (GitHub, email) are provided for user convenience. Their respective privacy policies apply once you navigate away from ZVX Hub.
              </p>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Data Retention &amp; Deletion
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                Since we do not collect or store any personal data on servers, there is nothing to retain or delete on our end. Tool inputs exist only in browser memory during your session and are permanently lost on:
              </p>
              <ul className="space-y-2 text-zinc-400 list-disc pl-5 font-mono text-sm">
                <li className="pl-2">Page refresh or navigation away</li>
                <li className="pl-2">Closing the browser tab</li>
                <li className="pl-2">Clearing browser local storage</li>
              </ul>
            </div>
          </section>

          {/* 7. Children's Privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Children&apos;s Privacy
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                ZVX Hub is a developer tooling site and is not directed at children under 13 (or under 16 in the EU). We do not knowingly collect any information from children. If you believe a child has used our tools with personal data, simply refresh the page — all data is immediately cleared.
              </p>
            </div>
          </section>

          {/* 8. Your Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Your Rights (GDPR / CCPA)
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to:
              </p>
              <ul className="space-y-2 text-zinc-400 list-disc pl-5 font-mono text-sm">
                <li className="pl-2"><strong className="text-zinc-200">Access</strong> — Request what data we hold (answer: none)</li>
                <li className="pl-2"><strong className="text-zinc-200">Deletion</strong> — Request data deletion (no server data to delete)</li>
                <li className="pl-2"><strong className="text-zinc-200">Portability</strong> — Receive your data in a portable format (no data collected)</li>
                <li className="pl-2"><strong className="text-zinc-200">Object</strong> — Object to data processing (no processing occurs)</li>
              </ul>
              <p className="text-zinc-500 text-sm">
                Because we collect no personal data, exercising these rights is trivially satisfied: there is nothing to access, delete, or port. For local-storage preferences, use your browser&apos;s Clear Site Data feature.
              </p>
            </div>
          </section>

          {/* 9. Security */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Security
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                ZVX Hub&apos;s architecture eliminates the most common attack vectors by design:
              </p>
              <ul className="space-y-2 text-zinc-400 list-disc pl-5 font-mono text-sm">
                <li className="pl-2"><strong className="text-zinc-200">No data transmission</strong> — All processing is client-side; no data leaves your device</li>
                <li className="pl-2"><strong className="text-zinc-200">No accounts</strong> — No passwords, sessions, or token storage</li>
                <li className="pl-2"><strong className="text-zinc-200">No databases</strong> — No server-side persistence of any kind</li>
                <li className="pl-2"><strong className="text-zinc-200">Isolated execution</strong> — Each tool runs in its own React component tree</li>
                <li className="pl-2"><strong className="text-zinc-200">HTTPS-only</strong> — Served over TLS via Vercel&apos;s edge network</li>
              </ul>
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 text-amber-400 text-sm">
                <p className="font-bold">Recommendation</p>
                <p className="text-amber-400/70 mt-1">
                  Keep your browser and OS updated. Avoid pasting sensitive credentials on shared or untrusted devices. Refresh the tab after handling sensitive data to clear memory.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Changes to Policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Changes to This Policy
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-3">
              <p className="text-zinc-400 leading-relaxed">
                If this policy changes, the &ldquo;Last updated&rdquo; date at the top of this page will reflect the revision. Material changes will be announced via the site&apos;s status indicator or a notice banner. Continued use after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* 11. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Contact
            </h2>
            <div className="pl-4 border-l border-white/5 space-y-4">
              <p className="text-zinc-400 leading-relaxed">
                For questions, concerns, or data-related inquiries:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:zulvikar.kharisma22@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-mono text-sm"
                >
                  <Mail size={16} />
                  zulvikar.kharisma22@gmail.com
                </a>
                <a
                  href="https://github.com/DycandX"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-all font-mono text-sm"
                >
                  <GithubIcon size={16} />
                  @DycandX
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Back navigation footer */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-mono text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 inline-flex items-center gap-1.5"
          >
            &larr; Back to Home
          </Link>
          <span className="text-xs text-zinc-600 font-mono">
            v1.0
          </span>
        </div>
      </main>

      {/* Footer copy */}
      <footer className="py-6 border-t border-white/5 bg-zinc-950/40 text-center text-xs text-zinc-600 font-mono leading-relaxed">
        <p>&copy; 2026 ZVX Hub. Built for productivity &middot; No data collected.</p>
      </footer>
    </div>
  );
}
