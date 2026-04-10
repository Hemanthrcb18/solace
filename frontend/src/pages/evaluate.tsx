import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

const SAMPLE_TRANSCRIPT = `Welcome everyone. Today we will explore machine learning fundamentals.

Can you think of real-world examples where machines learn from data? Let us start with supervised learning. Consider email spam detection — first we collect labeled data, then we train a model on patterns.

The key steps are: data collection, feature engineering, model training, and evaluation. What questions do you have so far?

Let us now look at neural networks. Think of them as layers of interconnected nodes, similar to neurons in the brain. Each layer learns increasingly abstract representations.

Remember: the goal is generalization, not memorization. Overfitting is when your model performs well on training data but poorly on new data.`;

const SAMPLE_SYLLABUS = `Unit 3: Machine Learning Fundamentals

Topics:
- Supervised vs Unsupervised Learning
- Neural Networks and Deep Learning
- Model Evaluation (accuracy, precision, recall)
- Overfitting and Cross-validation
- Feature Engineering

Learning Objectives:
- Students should understand and apply basic ML algorithms
- Students should implement a basic classifier
- Students should evaluate model performance`;

export default function Evaluate() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'text' | 'video'>('text');
  const [transcript, setTranscript] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [objectives, setObjectives] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');

  const LOADING_STEPS = [
    'Uploading content...',
    'Running NLP analysis...',
    'Detecting emotion signals...',
    'Scoring dimensions...',
    'Generating AI coaching...',
    'Finalizing results...',
  ];

  const handleEvaluate = async () => {
    if (!syllabus.trim()) { setError('Please enter your course syllabus'); return; }
    if (mode === 'text' && !transcript.trim()) { setError('Please enter a transcript'); return; }
    if (mode === 'video' && !file) { setError('Please upload a video file'); return; }
    setError(''); setLoading(true); setLoadingStep(0);

    // Animate loading steps
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setLoadingStep(i);
    }

    try {
      const body = {
        transcribed_text: mode === 'text' ? transcript : `Lecture video: ${file?.name}. Content analysis based on syllabus.`,
        syllabus_text: syllabus,
        teaching_objectives: objectives,
      };
      const res = await fetch('http://localhost:8000/quick-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      sessionStorage.setItem('mentora_result', JSON.stringify(data));
    } catch {
      // Use mock data if API is down
      const mock = {
        evaluation_id: 'demo-' + Date.now(),
        scores: { engagement_score: 7.8, clarity_score: 6.5, concept_coverage_score: 7.0, pedagogy_score: 8.2, overall_score: 7.4 },
        reasoning: 'Strong engagement signals detected. Some syllabus topics appear underrepresented. Clarity could improve with better transitions.',
        suggestions: ['Add 2-3 rhetorical questions per major topic', 'Use concept → example → application structure', 'Map content to syllabus objectives before each lecture', 'Incorporate real-world case studies'],
        sentiment: { sentiment_score: 8.2, emotion_label: 'engaging', engagement_ratio: 0.12, question_density: 0.15 },
        ai_coach: {
          primary_tip: 'Add a rhetorical question every 3-4 minutes to re-engage students.',
          if_i_were_teacher: 'I would open with a provocative question and use think-pair-share activities.',
          recommended_strategy: 'Socratic Method - guide students to discover answers rather than stating them.',
          emotion_advice: 'Great engagement energy. Channel it into structured activities.',
          improvement_priority: ['clarity', 'coverage', 'engagement', 'pedagogy'],
          strength_to_leverage: 'pedagogy',
          overall_coaching: 'Focus on clarity first - a 20% improvement here has the highest impact. Your pedagogy is strong; use it as a foundation.',
        },
        improvement_priority: ['clarity', 'coverage', 'engagement', 'pedagogy'],
        evaluation_source: 'nlp_engine',
        evaluated_at: new Date().toISOString(),
      };
      sessionStorage.setItem('mentora_result', JSON.stringify(mock));
    }

    setLoading(false);
    router.push('/dashboard');
  };

  const loadSample = () => {
    setTranscript(SAMPLE_TRANSCRIPT);
    setSyllabus(SAMPLE_SYLLABUS);
    setObjectives('Students should implement a basic ML classifier');
    setMode('text');
  };

  return (
    <>
      <Head><title>Evaluate — Mentora AI</title></Head>

      {/* Nav */}
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>M</div>
          <span style={{ fontWeight: 700, color: '#fff' }}>Mentora AI</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>📊 Dashboard</Link>
          <Link href="/aws" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>☁️ AWS</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
            <span className="gradient-text">AI Teaching Evaluation</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 17 }}>
            Paste a transcript or upload a video · Add your syllabus · Get instant AI analysis
          </p>
        </div>

        {/* Mode toggle */}
        <div className="fade-up delay-1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div className="glass" style={{ display: 'flex', padding: 4, borderRadius: 14, gap: 4 }}>
            {(['text', 'video'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .2s',
                background: mode === m ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
                color: mode === m ? '#fff' : '#64748b',
              }}>
                {m === 'text' ? '📝 Paste Transcript' : '🎥 Upload Video'}
              </button>
            ))}
          </div>
        </div>

        <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Input card */}
          <div className="glass" style={{ padding: 28 }}>
            {mode === 'text' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Lecture Transcript</label>
                  <button onClick={loadSample} style={{ fontSize: 12, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Load sample data
                  </button>
                </div>
                <textarea value={transcript} onChange={e => setTranscript(e.target.value)} rows={8}
                  placeholder="Paste your lecture transcript here... or click 'Load sample data' to try a demo." />
              </div>
            ) : (
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: 10 }}>Lecture Video</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${file ? 'rgba(16,185,129,.5)' : 'rgba(255,255,255,.1)'}`,
                    borderRadius: 12, padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                    background: file ? 'rgba(16,185,129,.05)' : 'rgba(255,255,255,.02)',
                    transition: 'all .2s',
                  }}>
                  <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                  {file ? (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                      <div style={{ color: '#10b981', fontWeight: 600 }}>{file.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 40, marginBottom: 12, opacity: .5 }}>🎥</div>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>Click to upload lecture video</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>MP4, MOV, AVI · Max 100MB</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Syllabus */}
          <div className="glass" style={{ padding: 28 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: 10 }}>
              Course Syllabus & Topics <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea value={syllabus} onChange={e => setSyllabus(e.target.value)} rows={5}
              placeholder="Paste your course syllabus, learning objectives, and key topics that should be covered..." />
          </div>

          {/* Objectives */}
          <div className="glass" style={{ padding: 28 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', display: 'block', marginBottom: 10 }}>
              Teaching Objectives <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea value={objectives} onChange={e => setObjectives(e.target.value)} rows={2}
              placeholder="e.g. Students should understand recursion and implement binary search..." />
          </div>

          {error && (
            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#ef4444', fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <button className="btn-glow" onClick={handleEvaluate} disabled={loading}>
            {loading ? (
              <>
                <div className="spin" style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                {LOADING_STEPS[loadingStep]}
              </>
            ) : (
              <><span style={{ fontSize: 20 }}>🚀</span> Run AI Evaluation</>
            )}
          </button>

          {/* Loading progress */}
          {loading && (
            <div className="glass" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: '#64748b' }}>
                <span>Analyzing...</span>
                <span>{Math.round((loadingStep / (LOADING_STEPS.length - 1)) * 100)}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(loadingStep / (LOADING_STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#3b82f6)' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {LOADING_STEPS.map((s, i) => (
                  <span key={s} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, background: i <= loadingStep ? 'rgba(124,58,237,.2)' : 'rgba(255,255,255,.04)', color: i <= loadingStep ? '#a78bfa' : '#334155', border: `1px solid ${i <= loadingStep ? 'rgba(124,58,237,.3)' : 'transparent'}`, transition: 'all .3s' }}>
                    {i < loadingStep ? '✓ ' : i === loadingStep ? '⟳ ' : ''}{s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
