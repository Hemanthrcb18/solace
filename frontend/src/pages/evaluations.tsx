import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { apiService } from "../services/api";

const scoreColor = (s: number) => s >= 8 ? "#10b981" : s >= 6.5 ? "#f59e0b" : "#ef4444";

export default function Evaluations() {
  const [evals, setEvals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getHistory().then(r => { setEvals(r.evaluations); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Evaluation History — Mentora AI</title></Head>
      <div className="min-h-screen" style={{ background: "#050810" }}>
        <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: "rgba(5,8,16,.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>M</div>
            <span className="font-bold text-white text-lg">Mentora AI</span>
          </div>
          <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">← Back to Evaluation</Link>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-black text-white mb-2">Evaluation History</h1>
          <p className="text-slate-400 mb-8">All past teaching evaluations</p>
          {loading ? (
            <div className="glass p-12 text-center text-slate-400">Loading...</div>
          ) : evals.length === 0 ? (
            <div className="glass p-12 text-center">
              <div className="text-5xl mb-4">📊</div>
              <div className="text-white font-semibold mb-2">No evaluations yet</div>
              <Link href="/" className="text-purple-400 text-sm">Run your first evaluation →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {evals.map((e: any) => {
                const s = e.scores || {};
                const overall = s.overall_score || 0;
                return (
                  <div key={e.id} className="glass p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-white">{e.videos?.filename || e.video_filename || "Direct Input"}</div>
                        <div className="text-xs text-slate-500 mt-1">{new Date(e.evaluated_at).toLocaleString()}</div>
                      </div>
                      <div className="text-3xl font-black font-mono" style={{ color: scoreColor(overall) }}>{overall.toFixed(1)}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[["Engagement", s.engagement_score], ["Clarity", s.clarity_score], ["Coverage", s.concept_coverage_score], ["Pedagogy", s.pedagogy_score]].map(([l, v]: any) => (
                        <div key={l} className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,.04)" }}>
                          <div className="text-lg font-bold font-mono" style={{ color: scoreColor(v || 0) }}>{(v || 0).toFixed(1)}</div>
                          <div className="text-xs text-slate-500">{l}</div>
                        </div>
                      ))}
                    </div>
                    {(e.reasoning || e.summary) && <p className="text-sm text-slate-400 line-clamp-2">{e.reasoning || e.summary}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
