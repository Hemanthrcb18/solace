import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Settings() {
  return (
    <>
      <Head><title>Settings — Mentora AI</title></Head>
      <div className="min-h-screen" style={{ background: "#050810" }}>
        <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(5,8,16,.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>M</div>
            <span className="font-bold text-white text-lg">Mentora AI</span>
          </div>
          <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">← Back</Link>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-black text-white mb-8">Settings</h1>
          <div className="glass p-6 space-y-4">
            <div><div className="text-sm font-semibold text-slate-300 mb-1">API Endpoint</div><div className="font-mono text-purple-400 text-sm">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}</div></div>
            <div><div className="text-sm font-semibold text-slate-300 mb-1">Version</div><div className="text-slate-400 text-sm">Mentora AI v3.0 — Team SOLACE</div></div>
            <div><div className="text-sm font-semibold text-slate-300 mb-1">Team</div><div className="text-slate-400 text-sm">Preetam Hosamani (Leader) · Hemanth Kumar</div></div>
          </div>
        </main>
      </div>
    </>
  );
}
