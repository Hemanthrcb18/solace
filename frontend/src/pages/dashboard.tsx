import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const MOCK: any = {
  evaluation_id: 'demo-001',
  scores: { engagement_score: 7.8, clarity_score: 6.5, concept_coverage_score: 7.0, pedagogy_score: 8.2, overall_score: 7.4 },
  reasoning: 'Strong engagement signals detected through interactive language patterns. Some syllabus topics appear underrepresented in the lecture content. Clarity could improve with better structure and transitions.',
  suggestions: [
    'Add 2-3 rhetorical questions per major topic to boost engagement',
    'Use concept → example → application structure for each topic',
    'Map content to syllabus objectives before each lecture',
    'Incorporate real-world case studies and scaffolded practice',
  ],
  sentiment: { sentiment_score: 8.2, emotion_label: 'engaging', engagement_ratio: 0.12, question_density: 0.15, positive_ratio: 0.09, confusion_ratio: 0.01 },
  ai_coach: {
    primary_tip: 'Add a rhetorical question every 3-4 minutes to re-engage students.',
    if_i_were_teacher: "I would open with a provocative question like 'Have you ever wondered why...?' and use think-pair-share activities to make students active participants.",
    recommended_strategy: 'Socratic Method — guide students to discover answers rather than stating them directly.',
    emotion_advice: 'Great engagement energy detected. Channel this into structured activities to maximize learning outcomes.',
    improvement_priority: ['clarity', 'coverage', 'engagement', 'pedagogy'],
    strength_to_leverage: 'pedagogy',
    overall_coaching: 'Focus on clarity first — a 20% improvement here has the highest impact on student outcomes. Your pedagogy is already strong; use it as a foundation.',
  },
  improvement_priority: ['clarity', 'coverage', 'engagement', 'pedagogy'],
  evaluation_source: 'nlp_engine',
  evaluated_at: new Date().toISOString(),
};

const SCORE_META: Record<string, { label: string; icon: string; color: string; key: string }> = {
  engagement: { label: 'Engagement',  icon: '🎯', color: '#7c3aed', key: 'engagement_score' },
  clarity:    { label: 'Clarity',     icon: '💡', color: '#3b82f6', key: 'clarity_score' },
  coverage:   { label: 'Coverage',    icon: '📚', color: '#10b981', key: 'concept_coverage_score' },
  pedagogy:   { label: 'Pedagogy',    icon: '👨‍🏫', color: '#f59e0b', key: 'pedagogy_score' },
};

const EMOTION_COLORS: Record<string, string> = {
  engaging: '#10b981', confident: '#3b82f6', confusing: '#ef4444', informative: '#a78bfa', neutral: '#64748b',
};

function scoreColor(s: number) { return s >= 8 ? '#10b981' : s >= 6.5 ? '#f59e0b' : '#ef4444'; }
function scoreLabel(s: number) { return s >= 8 ? 'Excellent' : s >= 6.5 ? 'Good' : 'Needs Work'; }
function pct(s: number) { return Math.round(s * 10); }

function ScoreCard({ dim, score, animated }: { dim: string; score: number; animated: boolean }) {
  const m = SCORE_META[dim];
  const p = pct(score);
  return (
    <div className="glass glass-hover" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: m.color + '20', border: `1px solid ${m.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{m.icon}</div>
        <span className="badge" style={{ background: scoreColor(score) + '15', color: scoreColor(score), border: `1px solid ${scoreColor(score)}30`, fontSize: 11 }}>{scoreLabel(score)}</span>
      </div>
      <div>
        <div style={{ fontSize: 40, fontWeight: 900, fontFamily: 'monospace', color: m.color, lineHeight: 1 }}>{p}<span style={{ fontSize: 18, color: '#64748b' }}>%</span></div>
        <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{m.label}</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: animated ? `${p}%` : '0%', background: `linear-gradient(90deg, ${m.color}, ${m.color}99)` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [animated, setAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'coach' | 'insights'>('overview');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('mentora_result');
      setData(stored ? JSON.parse(stored) : MOCK);
    } catch { setData(MOCK); }
    setTimeout(() => setAnimated(true), 300);
  }, []);

  if (!data) return null;

  const { scores, reasoning, suggestions, sentiment, ai_coach, improvement_priority, evaluation_source, evaluated_at } = data;
  const overall = scores.overall_score;
  const eColor = EMOTION_COLORS[sentiment?.emotion_label] || '#64748b';

  const chartData = [
    { name: 'Pedagogy',   value: pct(scores.pedagogy_score),          fill: '#f59e0b' },
    { name: 'Engagement', value: pct(scores.engagement_score),         fill: '#7c3aed' },
    { name: 'Coverage',   value: pct(scores.concept_coverage_score),   fill: '#10b981' },
    { name: 'Clarity',    value: pct(scores.clarity_score),            fill: '#3b82f6' },
  ];

  return (
    <>
      <Head><title>Dashboard — Mentora AI</title></Head>

      {/* Nav */}
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontWeight: 700, color: '#fff' }}>Mentora AI</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/evaluate" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>+ New Evaluation</Link>
          <Link href="/aws" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>☁️ AWS</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

        {/* Header row */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 6 }}>
              <span className="gradient-text">Evaluation Dashboard</span>
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(124,58,237,.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.2)', fontSize: 12 }}>
                Source: {evaluation_source}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,.05)', color: '#64748b', border: '1px solid rgba(255,255,255,.08)', fontSize: 12 }}>
                {new Date(evaluated_at).toLocaleString()}
              </span>
            </div>
          </div>
          {/* Overall score */}
          <div className="glass" style={{ padding: '20px 32px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(124,58,237,.1),rgba(59,130,246,.05))', border: '1px solid rgba(124,58,237,.2)' }}>
            <div style={{ fontSize: 56, fontWeight: 900, fontFamily: 'monospace', color: scoreColor(overall), lineHeight: 1 }}>{pct(overall)}<span style={{ fontSize: 24, color: '#64748b' }}>%</span></div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Overall Score</div>
            <div style={{ fontSize: 12, color: scoreColor(overall), fontWeight: 600, marginTop: 4 }}>{scoreLabel(overall)}</div>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid-4 fade-up delay-1" style={{ marginBottom: 28 }}>
          {Object.keys(SCORE_META).map(dim => (
            <ScoreCard key={dim} dim={dim} score={scores[SCORE_META[dim].key]} animated={animated} />
          ))}
        </div>

        {/* Tabs */}
        <div className="fade-up delay-2" style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,.03)', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid var(--border)' }}>
          {(['overview', 'coach', 'insights'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .2s', textTransform: 'capitalize',
              background: activeTab === t ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
              color: activeTab === t ? '#fff' : '#64748b',
            }}>
              {t === 'overview' ? '📊 Overview' : t === 'coach' ? '🎯 AI Coach' : '🧠 Insights'}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Radial chart */}
            <div className="glass" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Score Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(255,255,255,.04)' }} />
                  <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#e2e8f0' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                {chartData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.fill }} />
                    <span style={{ color: '#94a3b8' }}>{d.name}: <strong style={{ color: '#fff' }}>{d.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotion + Sentiment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="glass" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Emotion Detection</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: eColor + '20', border: `2px solid ${eColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {sentiment?.emotion_label === 'engaging' ? '🔥' : sentiment?.emotion_label === 'confident' ? '💪' : sentiment?.emotion_label === 'confusing' ? '😕' : '😐'}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: eColor, textTransform: 'capitalize' }}>{sentiment?.emotion_label}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>Teaching tone detected</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    ['Sentiment', `${sentiment?.sentiment_score}/10`],
                    ['Engagement', `${((sentiment?.engagement_ratio || 0) * 100).toFixed(0)}%`],
                    ['Questions/min', sentiment?.question_density],
                    ['Positive signals', `${((sentiment?.positive_ratio || 0) * 100).toFixed(0)}%`],
                  ].map(([l, v]) => (
                    <div key={String(l)} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div className="glass" style={{ padding: 24, flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>AI Analysis</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{reasoning}</p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass" style={{ padding: 24, gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>📈 Improvement Suggestions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {suggestions?.map((s: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(255,255,255,.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: AI Coach */}
        {activeTab === 'coach' && ai_coach && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero coaching card */}
            <div className="glass" style={{ padding: 32, background: 'linear-gradient(135deg,rgba(124,58,237,.08),rgba(59,130,246,.04))', border: '1px solid rgba(124,58,237,.2)' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,58,237,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🎯</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Overall Coaching</div>
                  <p style={{ fontSize: 16, color: '#e2e8f0', lineHeight: 1.7 }}>{ai_coach.overall_coaching}</p>
                </div>
              </div>
            </div>

            <div className="grid-2">
              {[
                { label: 'Primary Tip', icon: '💡', content: ai_coach.primary_tip, color: '#f59e0b' },
                { label: 'If I Were The Teacher...', icon: '👨‍🏫', content: ai_coach.if_i_were_teacher, color: '#3b82f6' },
                { label: 'Recommended Strategy', icon: '📐', content: ai_coach.recommended_strategy, color: '#10b981' },
                { label: 'Emotion Insight', icon: '🧠', content: ai_coach.emotion_advice, color: '#ec4899' },
              ].map(c => (
                <div key={c.label} className="glass" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.color, textTransform: 'uppercase', letterSpacing: .5 }}>{c.label}</div>
                  </div>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{c.content}</p>
                </div>
              ))}
            </div>

            {/* Priority ranking */}
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>🏆 Improvement Priority Order</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {improvement_priority?.map((p: string, i: number) => {
                  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
                  const labels = ['Fix First', 'High Priority', 'Medium', 'Maintain'];
                  return (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 12, background: colors[i] + '10', border: `1px solid ${colors[i]}30` }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: colors[i] }}>{i + 1}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>{p}</div>
                        <div style={{ fontSize: 11, color: colors[i] }}>{labels[i]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <Link href="/evaluate" className="btn-primary">Run Another Evaluation →</Link>
            </div>
          </div>
        )}

        {/* Tab: Insights */}
        {activeTab === 'insights' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* All scores with bars */}
            <div className="glass" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Detailed Score Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {Object.entries(SCORE_META).map(([dim, m]) => {
                  const s = scores[m.key];
                  const p = pct(s);
                  return (
                    <div key={dim}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span>{m.icon}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{m.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: '#64748b' }}>{s.toFixed(1)}/10</span>
                          <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: m.color }}>{p}%</span>
                        </div>
                      </div>
                      <div className="progress-track" style={{ height: 10 }}>
                        <div className="progress-fill" style={{ width: animated ? `${p}%` : '0%', background: `linear-gradient(90deg,${m.color},${m.color}88)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentiment breakdown */}
            <div className="glass" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Sentiment Analysis</h3>
              <div className="grid-4">
                {[
                  { label: 'Sentiment Score', value: `${sentiment?.sentiment_score}/10`, color: '#a78bfa' },
                  { label: 'Emotion', value: sentiment?.emotion_label, color: eColor },
                  { label: 'Engagement Ratio', value: `${((sentiment?.engagement_ratio || 0) * 100).toFixed(1)}%`, color: '#3b82f6' },
                  { label: 'Question Density', value: sentiment?.question_density, color: '#10b981' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: item.color, textTransform: 'capitalize', marginBottom: 4 }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation metadata */}
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Evaluation Metadata</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Evaluation ID', data.evaluation_id?.slice(0, 16) + '...'],
                  ['Source', evaluation_source],
                  ['Timestamp', new Date(evaluated_at).toLocaleString()],
                  ['Strongest Dimension', ai_coach?.strength_to_leverage],
                ].map(([l, v]) => (
                  <div key={String(l)} style={{ padding: '12px 16px', background: 'rgba(255,255,255,.03)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, textTransform: 'capitalize' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
