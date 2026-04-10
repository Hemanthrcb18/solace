import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SERVICES = [
  {
    id: 's3', name: 'Amazon S3', icon: '🗄️', color: '#f59e0b',
    desc: 'Secure, scalable object storage for lecture videos.',
    details: ['Stores MP4, MOV, AVI lecture files', 'Generates pre-signed URLs for secure access', 'Lifecycle policies for cost optimization', 'Cross-region replication ready'],
    status: 'Demo Mode', statusColor: '#f59e0b',
    metric: '100MB max upload',
  },
  {
    id: 'transcribe', name: 'Amazon Transcribe', icon: '🎙️', color: '#3b82f6',
    desc: 'Automatic speech recognition converts lecture audio to text.',
    details: ['Real-time transcription pipeline', 'Speaker diarization support', 'Custom vocabulary for academic terms', 'Confidence scores per word'],
    status: 'Simulated', statusColor: '#3b82f6',
    metric: '~2min per lecture',
  },
  {
    id: 'bedrock', name: 'Amazon Bedrock', icon: '🤖', color: '#7c3aed',
    desc: 'Claude AI model for deep teaching quality reasoning.',
    details: ['Claude 3 Haiku for fast evaluation', 'Structured JSON output parsing', 'Prompt engineering for education domain', 'Fallback to NLP engine if unavailable'],
    status: 'Mocked', statusColor: '#7c3aed',
    metric: 'Claude 3 Haiku',
  },
  {
    id: 'rekognition', name: 'Amazon Rekognition', icon: '👁️', color: '#10b981',
    desc: 'Visual analysis of lecture video for engagement signals.',
    details: ['Facial expression analysis', 'Gesture and movement detection', 'Attention level estimation', 'Frame-by-frame engagement scoring'],
    status: 'Ready', statusColor: '#10b981',
    metric: 'Visual AI layer',
  },
];

const FLOW_STEPS = [
  { icon: '🎥', label: 'Video Upload', sub: 'MP4/MOV/AVI', color: '#f59e0b' },
  { icon: '🗄️', label: 'Amazon S3',   sub: 'Storage',     color: '#f59e0b' },
  { icon: '🎙️', label: 'Transcribe',  sub: 'Speech→Text', color: '#3b82f6' },
  { icon: '🤖', label: 'Bedrock AI',  sub: 'Reasoning',   color: '#7c3aed' },
  { icon: '📊', label: 'Dashboard',   sub: 'Results',     color: '#10b981' },
];

export default function AWSPage() {
  const [health, setHealth] = useState<any>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'demo', aws_s3_enabled: false, aws_bedrock_enabled: false }));
  }, []);

  return (
    <>
      <Head><title>AWS Architecture — Mentora AI</title></Head>

      {/* Nav */}
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontWeight: 700, color: '#fff' }}>Mentora AI</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/evaluate" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>🚀 Evaluate</Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>📊 Dashboard</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge" style={{ background: 'rgba(245,158,11,.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,.2)', marginBottom: 16 }}>
            ☁️ Cloud Architecture
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16 }}>
            <span className="gradient-text">AWS Architecture</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
            S3 · Transcribe · Bedrock · Rekognition — built for scale, running in demo mode
          </p>
        </div>

        {/* Live status bar */}
        {health && (
          <div className="glass fade-up delay-1" style={{ padding: '16px 24px', marginBottom: 40, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>System Online</span>
            </div>
            {[
              ['S3', health.aws_s3_enabled],
              ['Bedrock', health.aws_bedrock_enabled],
              ['Database', health.database_enabled],
            ].map(([label, enabled]) => (
              <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: enabled ? '#10b981' : '#f59e0b' }} />
                <span style={{ fontSize: 12, color: '#64748b' }}>{label}: <span style={{ color: enabled ? '#10b981' : '#f59e0b' }}>{enabled ? 'Active' : 'Demo'}</span></span>
              </div>
            ))}
            <span style={{ fontSize: 12, color: '#334155', marginLeft: 'auto' }}>v{health.version || '3.0.0'}</span>
          </div>
        )}

        {/* Flow diagram */}
        <div className="glass fade-up delay-2" style={{ padding: 36, marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 32, textAlign: 'center' }}>Data Flow Pipeline</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap', rowGap: 16 }}>
            {FLOW_STEPS.map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '16px 20px', borderRadius: 14, background: s.color + '15', border: `1px solid ${s.color}30`, minWidth: 100, transition: 'all .2s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${s.color}30`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.sub}</div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                    <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg,rgba(124,58,237,.4),rgba(59,130,246,.4))' }} />
                    <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid rgba(124,58,237,.6)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service cards */}
        <div className="grid-2 fade-up delay-3">
          {SERVICES.map(s => (
            <div key={s.id} className="glass glass-hover" style={{ padding: 28, cursor: 'pointer', border: active === s.id ? `1px solid ${s.color}50` : undefined }}
              onClick={() => setActive(active === s.id ? null : s.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: s.color + '20', border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{s.name}</h3>
                    <span className="badge" style={{ background: s.statusColor + '15', color: s.statusColor, border: `1px solid ${s.statusColor}30`, fontSize: 11 }}>{s.status}</span>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', background: 'rgba(255,255,255,.04)', padding: '4px 10px', borderRadius: 8 }}>{s.metric}</span>
              </div>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: active === s.id ? 16 : 0 }}>{s.desc}</p>
              {active === s.id && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 16, marginTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Capabilities</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {s.details.map(d => (
                      <li key={d} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94a3b8' }}>
                        <span style={{ color: s.color }}>✓</span>{d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div style={{ fontSize: 12, color: '#334155', marginTop: 12, textAlign: 'right' }}>
                {active === s.id ? '▲ Less' : '▼ Details'}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture note */}
        <div className="glass fade-up" style={{ padding: 28, marginTop: 28, background: 'linear-gradient(135deg,rgba(124,58,237,.06),rgba(59,130,246,.03))', border: '1px solid rgba(124,58,237,.15)', textAlign: 'center' }}>
          <div style={{ fontSize: 20, marginBottom: 12 }}>🏗️</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Production-Ready Architecture</h3>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            All AWS services are integrated and ready. Currently running in demo mode — add your AWS credentials to <code style={{ color: '#a78bfa', background: 'rgba(124,58,237,.1)', padding: '2px 6px', borderRadius: 4 }}>backend/.env</code> to activate live cloud processing.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/evaluate" className="btn-primary" style={{ fontSize: 14, padding: '12px 24px' }}>
              🚀 Try Demo Evaluation
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
