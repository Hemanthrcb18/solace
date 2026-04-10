# Mentora AI — Teaching Intelligence System

> "This is not just a project, this is a PRODUCT."

**Team SOLACE**
- Preetam Hosamani (Team Leader)
- Hemanth Kumar

---

## What is Mentora?

Mentora is an AI-powered teaching intelligence system that evaluates and improves teaching quality using explainable AI, emotion detection, and AWS infrastructure.

Upload a lecture video (or paste a transcript), add your syllabus, and get:
- 4-dimension teaching scores (Engagement, Clarity, Coverage, Pedagogy)
- Emotion detection (confident / engaging / confusing / neutral)
- Personalized AI Coach with "If I were the teacher..." feedback
- Improvement priority ranking
- AWS Bedrock AI reasoning (with NLP fallback)

---

## Quick Start (2 commands)

**Terminal 1 — Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
# Running at http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:3000
```

Open http://localhost:3000 — click "Start Evaluation" — done.

> Works 100% without AWS credentials (uses NLP engine + in-memory store).
> Add AWS keys to `backend/.env` to enable S3 + Bedrock.

---

## Demo Flow (for judges)

1. Open http://localhost:3000
2. Click "Start Evaluation"
3. Paste any lecture transcript (or upload a video)
4. Paste a course syllabus
5. Click "Run AI Evaluation"
6. See full dashboard: scores, emotion, AI coach, improvement priority

---

## AWS Architecture

```
Video Upload → S3 (storage)
                ↓
           Transcribe (speech-to-text)
                ↓
           Bedrock Claude (AI reasoning)
                ↓
           Rekognition (visual analysis)
                ↓
           Results Dashboard
```

| Service | Purpose | Status |
|---|---|---|
| Amazon S3 | Lecture video storage | Live |
| Amazon Bedrock | AI evaluation & reasoning | Live (NLP fallback) |
| Amazon Transcribe | Speech-to-text | Ready |
| Amazon Rekognition | Visual engagement analysis | Ready |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | System status |
| POST | `/auth/demo-login` | Get demo token |
| POST | `/upload/video` | Upload to S3 |
| POST | `/evaluate` | Full evaluation (video_id) |
| POST | `/quick-evaluate` | Direct transcript evaluation |
| GET | `/evaluations` | History |
| GET | `/aws-status` | AWS service status |

Interactive docs: http://localhost:8000/docs

---

## Why Mentora Wins

- Real AI depth: NLP sentiment + emotion detection + Bedrock reasoning
- Explainable results: every score has reasoning + coaching
- AWS-first: S3, Bedrock, Transcribe, Rekognition
- Works without credentials: zero-friction demo
- Beautiful UI: dark glassmorphism, animated, premium feel
- Real-world impact: education quality at scale

---

## Pitch (60 seconds)

**Problem:** Teaching quality is evaluated manually, subjectively, inconsistently, and at zero scale.

**Solution:** Mentora analyzes lecture videos against a syllabus using AI — scoring engagement, clarity, coverage, and pedagogy — then gives teachers a personalized AI coach with actionable feedback.

**Differentiator:** We don't just score. We explain *why* and tell teachers *exactly* what to do differently. Emotion detection catches confusing delivery before students disengage.

**AWS:** S3 for storage, Bedrock for AI reasoning, Transcribe for speech-to-text, Rekognition for visual analysis.

**Impact:** Every university, EdTech platform, and accreditation body needs this.
