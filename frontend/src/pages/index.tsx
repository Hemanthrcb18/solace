import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'AWS', href: '#aws' },
  { label: 'Dashboard', href: '/dashboard' },
];

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Evaluation Engine',
    desc: 'Multi-dimensional scoring across Engagement, Clarity, Pedagogy, and Coverage using explainable NLP.',
    color: '#7c3aed',
  },
  {
    icon: '💡',
    title: 'Emotion Detection',
    desc: 'Detects teaching tone — confident, engaging, confusing, or neutral — from transcript analysis.',
    color: '#3b82f6',
  },
  {
    icon: '🎯',
    title: 'AI Teaching Coach',
    desc: '"If I were the teacher…" — personalized coaching with strategy recommendations and improvement priorities.',
    color: '#10b981',
  },
  {
    icon: '☁️',
    title: 'AWS Powered',
    desc: 'S3 for video storage, Bedrock for AI reasoning, Transcribe for speech-to-text, Rekognition for visual analysis.',
    color: '#f59e0b',
  },
  {
    icon: '📊',
    title: 'Explainable Results',
    desc: 'Every score comes with human-readable reasoning. No black-box AI — full transparency for educators.',
    color: '#ec4899',
  },
  {
    icon: '⚡',
    title: 'Instant Analysis',
    desc: 'Upload a lecture, paste your syllabus, and get a full teaching quality report in seconds.',
    color: '#06b6d4',
  },
];

const STEPS = [
  { n: '01', title: 'Upload Lecture', desc: 'Upload your lecture video or paste the transcript directly.' },
  { n: '02', title: 'Add Syllabus', desc: 'Paste your course syllabus and learning objectives.' },
  { n: '03', title: 'Run AI Evaluation', desc: 'Our NLP engine + AWS Bedrock analyzes teaching quality.' },
  { n: '04', title: 'Get Coached', desc: 'Receive scores, emotion insights, and personalized AI coaching.' },
];

const AWS_SERVICES = [
  { name: 'Amazon S3', icon: '🗄️', desc: 'Secure lecture video storage', status: 'Demo Mode', color: '#f59e0b' },
  { name: 'Amazon Transcribe', icon: '🎙️', desc: 'Speech-to-text conversion', status: 'Simulated', color: '#3b82f6' },
  { name: 'Amazon Bedrock', icon: '🤖', desc: 'Claude AI reasoning engine', status: 'Mocked', color: '#7c3aed' },
  { name: 'Amazon Rekognition', icon: '👁️', desc: 'Visual engagement analysis', status: 'Ready', color: '#10b981' },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll('.fade-up, .fade-in');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = '1'; }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Mentora AI — AI-Powered Teaching Intelligence System</title>
        <meta name="description" content="Evaluate and improve teaching quality using explainable AI, emotion detection, and AWS infrastructure." />
      </Head>

      {/* ── NAV ── */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>M</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>Mentora AI</span>
          <span className="badge" style={{ background: 'rgba(124,58,237,.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.3)', marginLeft: 4 }}>v3.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href} style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/evaluate" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
          🚀 Start Evaluation
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,.3) 0%, transparent 70%)' }}>
        {/* bg orbs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.12) 0%, transparent 70%)', top: '10%', left: '10%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)', bottom: '10%', right: '10%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <div className="badge fade-up delay-1" style={{ background: 'rgba(124,58,237,.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.3)', marginBottom: 24, fontSize: 13 }}>
            ✦ AI-Powered Teaching Intelligence System
          </div>

          <h1 className="fade-up delay-2" style={{ fontSize: 'clamp(42px,7vw,80px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>
            <span className="gradient-text">Mentora AI</span>
            <br />
            <span style={{ color: '#e2e8f0' }}>Evaluate. Coach. Improve.</span>
          </h1>

          <p className="fade-up delay-3" style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            The AI system that analyzes lecture quality, detects teaching emotions, and gives personalized coaching — powered by AWS.
          </p>

          <div className="fade-up delay-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link href="/evaluate" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              🚀 Start Evaluation
            </Link>
            <Link href="/dashboard" className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
              📊 View Dashboard
            </Link>
            <Link href="/aws" className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
              ☁️ AWS Architecture
            </Link>
          </div>

          {/* Stats bar */}
          <div className="fade-up delay-5" style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['4', 'AI Dimensions'], ['Real-time', 'Analysis'], ['AWS', 'Integrated'], ['0', 'Setup Required']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa' }}>{v}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge fade-up" style={{ background: 'rgba(59,130,246,.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,.2)', marginBottom: 16 }}>Features</div>
          <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Everything you need to <span className="gradient-text">evaluate teaching</span>
          </h2>
          <p className="fade-up delay-2" style={{ color: '#64748b', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            Built for educators, institutions, and EdTech platforms that care about quality.
          </p>
        </div>

        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`glass glass-hover fade-up delay-${i + 1}`} style={{ padding: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + '20', border: `1px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, transparent, rgba(124,58,237,.05), transparent)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge fade-up" style={{ background: 'rgba(16,185,129,.1)', color: '#34d399', border: '1px solid rgba(16,185,129,.2)', marginBottom: 16 }}>How It Works</div>
          <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 64 }}>
            From lecture to <span className="gradient-text">insights in seconds</span>
          </h2>
          <div className="grid-4" style={{ textAlign: 'left' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`glass fade-up delay-${i + 1}`} style={{ padding: 24, position: 'relative' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(124,58,237,.2)', lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWS SECTION ── */}
      <section id="aws" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge fade-up" style={{ background: 'rgba(245,158,11,.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,.2)', marginBottom: 16 }}>Powered by AWS</div>
          <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            <span className="gradient-text">AWS Architecture</span>
          </h2>
          <p className="fade-up delay-2" style={{ color: '#64748b', fontSize: 18 }}>S3 · Bedrock · Transcribe · Rekognition — Demo Mode</p>
        </div>

        <div className="grid-4">
          {AWS_SERVICES.map((s, i) => (
            <div key={s.name} className={`glass glass-hover fade-up delay-${i + 1}`} style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>{s.desc}</p>
              <span className="badge" style={{ background: s.color + '15', color: s.color, border: `1px solid ${s.color}30`, fontSize: 11 }}>{s.status}</span>
            </div>
          ))}
        </div>

        <div className="fade-up" style={{ marginTop: 48, textAlign: 'center' }}>
          <Link href="/aws" className="btn-secondary">View Full Architecture →</Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="glass fade-up" style={{ maxWidth: 700, margin: '0 auto', padding: '64px 48px', background: 'linear-gradient(135deg, rgba(124,58,237,.1), rgba(59,130,246,.05))', border: '1px solid rgba(124,58,237,.2)' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-1px' }}>
            Ready to <span className="gradient-text">evaluate your teaching?</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 17, marginBottom: 36 }}>No setup required. Works instantly in demo mode.</p>
          <Link href="/evaluate" className="btn-primary" style={{ fontSize: 17, padding: '18px 40px' }}>
            🚀 Start Free Evaluation
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: '#334155', fontSize: 13 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#a78bfa', fontWeight: 700 }}>Mentora AI</span> — Built by Team SOLACE
        </div>
        <div>Preetam Hosamani (Leader) · Hemanth Kumar · AWS ImpactX Hackathon 2025</div>
      </footer>
    </>
  );
}
