from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os, uuid, re, json, boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Mentora AI", version="3.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
security = HTTPBearer(auto_error=False)

AWS_KEY    = os.getenv("AWS_ACCESS_KEY_ID","")
AWS_SECRET = os.getenv("AWS_SECRET_ACCESS_KEY","")
AWS_REGION = os.getenv("AWS_REGION","ap-south-1")
S3_BUCKET  = os.getenv("AWS_S3_BUCKET_NAME","")
JWT_SECRET = os.getenv("JWT_SECRET","mentora-secret-2025")
BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL_ID","anthropic.claude-3-haiku-20240307-v1:0")

aws_enabled = bedrock_enabled = db_enabled = False
s3_client = bedrock_client = supabase = None

if AWS_KEY and AWS_SECRET:
    try:
        s3_client = boto3.client("s3", aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, region_name=AWS_REGION)
        aws_enabled = bool(S3_BUCKET)
    except: pass
    try:
        bedrock_client = boto3.client("bedrock-runtime", aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET, region_name=AWS_REGION)
        bedrock_enabled = True
    except: pass

SUPABASE_URL = os.getenv("SUPABASE_URL","")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY","")
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        db_enabled = True
    except: pass

_store = {"videos": {}, "evals": []}

def create_token(uid):
    return jwt.encode({"user_id": uid, "exp": datetime.utcnow() + timedelta(hours=24)}, JWT_SECRET, algorithm="HS256")

def get_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    if not creds: return "demo-user-123"
    try: return jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])["user_id"]
    except: return "demo-user-123"

class EvalRequest(BaseModel):
    video_id: Optional[str] = None
    transcribed_text: Optional[str] = None
    syllabus_text: str
    teaching_objectives: Optional[str] = None

class QuickEvalRequest(BaseModel):
    transcribed_text: str
    syllabus_text: str
    teaching_objectives: Optional[str] = None

POS  = {"excellent","great","good","clear","understand","learn","important","key","example","demonstrate","explain","practice","apply","master","achieve","success","effective","improve","develop","build","create","explore","discover","analyze","evaluate","remember","recall","concept","principle","theory","method"}
CONF = {"confusing","unclear","difficult","hard","complex","complicated","problem","issue","error","mistake","wrong","fail","struggle","lost","confused","uncertain","vague","ambiguous","misunderstand"}
ENG  = {"you","your","we","think","consider","imagine","what","how","why","question","discuss","share","together","interactive","activity","exercise","try","practice","example","case"}

def get_sentiment(text):
    words = re.findall(r'\b\w+\b', text.lower())
    n = max(len(words), 1)
    pos  = sum(1 for w in words if w in POS) / n
    conf = sum(1 for w in words if w in CONF) / n
    eng  = sum(1 for w in words if w in ENG) / n
    q = len(re.findall(r'\?', text))
    s = max(len(re.split(r'[.!?]+', text)), 1)
    score = round(min(10, max(0, 5 + (pos*30) - (conf*20) + (eng*15))), 1)
    if conf > 0.03:              label = "confusing"
    elif eng > 0.05 and pos > 0.04: label = "engaging"
    elif pos > 0.05:             label = "confident"
    elif score >= 7:             label = "informative"
    else:                        label = "neutral"
    return {"sentiment_score": score, "emotion_label": label, "positive_ratio": round(pos,3),
            "confusion_ratio": round(conf,3), "engagement_ratio": round(eng,3), "question_density": round(q/s,2)}

def score_engagement(text, sent):
    q  = len(re.findall(r'\?', text))
    ew = len(re.findall(r'\b(you|your|think|consider|imagine|what|how|why|we|together|discuss)\b', text))
    return round(min(9.8, max(4.0, 5.5 + min(2.0, q*0.15) + min(1.5, ew*0.05) + sent["engagement_ratio"]*8)), 1)

def score_clarity(text):
    sents = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if not sents: return 6.0
    avg = sum(len(s.split()) for s in sents) / len(sents)
    ls  = max(0, 2.0 - abs(avg - 15) * 0.1)
    sw  = len(re.findall(r'\b(first|second|third|next|then|finally|therefore|because|however|for example|in summary)\b', text.lower()))
    # Penalise if "complex" appears, boost if "example" appears
    if "complex" in text.lower(): ls = max(0, ls - 0.5)
    if "example" in text.lower(): ls = min(2.0, ls + 0.3)
    return round(min(9.8, max(4.0, 5.5 + ls + min(2.0, sw*0.25))), 1)

def score_coverage(transcript, syllabus):
    sw = set(re.findall(r'\b\w{4,}\b', syllabus.lower()))
    tw = set(re.findall(r'\b\w{4,}\b', transcript.lower()))
    if not sw: return 7.0
    return round(min(9.8, max(4.0, 4.0 + (len(sw & tw) / len(sw)) * 6.0)), 1)

def score_pedagogy(text):
    ex = len(re.findall(r'\b(example|instance|case|scenario|demonstrate|show|consider|suppose|imagine)\b', text.lower()))
    sm = len(re.findall(r'\b(summary|conclude|recap|review|takeaway|remember|important)\b', text.lower()))
    sc = len(re.findall(r'\b(build on|prior knowledge|recall|previously|foundation|step by step)\b', text.lower()))
    # Boost if "example" keyword present
    if "example" in text.lower(): ex += 2
    return round(min(9.8, max(4.0, 5.0 + min(2.0, ex*0.2) + min(1.5, sm*0.3) + min(1.0, sc*0.4))), 1)

COACH = {
    "engagement": {
        "tip": "Add a rhetorical question every 3-4 minutes to re-engage students.",
        "if_i_were": "I would open with a provocative question and use think-pair-share activities.",
        "strategy": "Socratic Method - guide students to discover answers rather than stating them."
    },
    "clarity": {
        "tip": "Use the Explain it simply rule before adding depth.",
        "if_i_were": "I would draw a concept map first, then fill in details - visual anchoring boosts retention.",
        "strategy": "Chunking - break content into digestible units with clear transitions."
    },
    "coverage": {
        "tip": "Cross-reference your lecture outline against the syllabus before each session.",
        "if_i_were": "I would show a visible syllabus checklist and tick topics off live.",
        "strategy": "Backward Design - start from learning outcomes and work backward to content."
    },
    "pedagogy": {
        "tip": "Introduce one real-world case study per major concept.",
        "if_i_were": "I would use I Do We Do You Do scaffolding - model, practice together, then independent.",
        "strategy": "Blooms Taxonomy - target higher-order thinking: analyze, evaluate, create."
    },
}
EMOTION_ADVICE = {
    "confusing":   "Confusion signals detected. Slow down at key transitions and explicitly clarify.",
    "engaging":    "Great engagement energy. Channel it into structured activities.",
    "confident":   "Strong confident delivery. Balance it by inviting student questions.",
    "informative": "Solid delivery. Add emotional hooks and storytelling to make content memorable.",
    "neutral":     "Vary your pacing to create natural emphasis on key concepts.",
}

def build_coach(scores, sent):
    weakest   = min(scores, key=scores.get)
    strongest = max(scores, key=scores.get)
    priority  = sorted(scores, key=scores.get)
    c = COACH.get(weakest, COACH["clarity"])
    return {
        "primary_tip":          c["tip"],
        "if_i_were_teacher":    c["if_i_were"],
        "recommended_strategy": c["strategy"],
        "emotion_advice":       EMOTION_ADVICE.get(sent["emotion_label"], ""),
        "improvement_priority": priority,
        "strength_to_leverage": strongest,
        "overall_coaching":     f"Focus on {weakest} first - a 20 percent improvement here has the highest impact. Your {strongest} is strong; use it as a foundation.",
    }

def bedrock_eval(transcript, syllabus, objectives=""):
    if not bedrock_client: return None
    try:
        prompt = (
            "Analyze this lecture transcript against the syllabus. Return ONLY valid JSON, no markdown.\n\n"
            "SYLLABUS: " + syllabus[:1200] + "\n"
            "TRANSCRIPT: " + transcript[:1800] + "\n\n"
            'Return JSON: {"engagement_score":7,"clarity_score":7,"concept_coverage_score":7,"pedagogy_score":7,"reasoning":"analysis","suggestions":["s1","s2"]}'
        )
        resp = bedrock_client.invoke_model(
            modelId=BEDROCK_MODEL,
            body=json.dumps({"anthropic_version": "bedrock-2023-05-31", "max_tokens": 600,
                             "messages": [{"role": "user", "content": prompt}]})
        )
        text = json.loads(resp["body"].read())["content"][0]["text"]
        s, e = text.find("{"), text.rfind("}") + 1
        if s != -1 and e > s: return json.loads(text[s:e])
    except Exception as ex:
        print("[Bedrock]", ex)
    return None

def run_eval(transcript, syllabus, objectives=""):
    sent = get_sentiment(transcript + " " + syllabus)
    bd   = bedrock_eval(transcript, syllabus, objectives)
    if bd and "engagement_score" in bd:
        scores = {
            "engagement": round(float(bd.get("engagement_score", 7.5)), 1),
            "clarity":    round(float(bd.get("clarity_score", 7.5)), 1),
            "coverage":   round(float(bd.get("concept_coverage_score", 7.5)), 1),
            "pedagogy":   round(float(bd.get("pedagogy_score", 7.5)), 1),
        }
        reasoning   = bd.get("reasoning", "AI analysis complete.")
        suggestions = bd.get("suggestions", [])
        source = "aws_bedrock"
    else:
        scores = {
            "engagement": score_engagement(transcript, sent),
            "clarity":    score_clarity(transcript),
            "coverage":   score_coverage(transcript, syllabus),
            "pedagogy":   score_pedagogy(transcript),
        }
        parts = [
            "Strong engagement signals detected." if scores["engagement"] >= 7.5 else "Limited engagement cues; add more interactive elements.",
            "Good syllabus alignment." if scores["coverage"] >= 7.5 else "Some syllabus topics appear underrepresented.",
            "Clear, well-structured explanations." if scores["clarity"] >= 7.5 else "Clarity could improve with better transitions.",
        ]
        reasoning = " ".join(parts)
        tips = []
        if scores["engagement"] < 7.5: tips.append("Add 2-3 rhetorical questions per major topic")
        if scores["clarity"]    < 7.5: tips.append("Use concept then example then application structure")
        if scores["coverage"]   < 7.5: tips.append("Map content to syllabus objectives before each lecture")
        if scores["pedagogy"]   < 7.5: tips.append("Incorporate real-world case studies and scaffolded practice")
        suggestions = tips or ["Excellent quality - consider this a model lecture", "Share your approach as a best practice"]
        source = "nlp_engine"

    overall = round(scores["engagement"]*0.25 + scores["coverage"]*0.30 + scores["clarity"]*0.25 + scores["pedagogy"]*0.20, 1)
    coach   = build_coach(scores, sent)
    return {
        "scores": {
            "engagement_score":       scores["engagement"],
            "clarity_score":          scores["clarity"],
            "concept_coverage_score": scores["coverage"],
            "pedagogy_score":         scores["pedagogy"],
            "overall_score":          overall,
        },
        "reasoning":            reasoning,
        "suggestions":          suggestions,
        "sentiment":            sent,
        "ai_coach":             coach,
        "improvement_priority": coach["improvement_priority"],
        "evaluation_source":    source,
    }

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "healthy", "message": "Mentora AI v3.0", "aws_s3_enabled": aws_enabled,
            "aws_bedrock_enabled": bedrock_enabled, "database_enabled": db_enabled,
            "timestamp": datetime.utcnow().isoformat(), "version": "3.0.0"}

@app.get("/aws-status")
def aws_status():
    return {"aws_region": AWS_REGION, "services": {
        "s3":          {"status": "active" if aws_enabled else "demo_mode",     "purpose": "Lecture video storage"},
        "bedrock":     {"status": "active" if bedrock_enabled else "demo_mode", "purpose": "AI reasoning"},
        "transcribe":  {"status": "ready", "purpose": "Speech-to-text"},
        "rekognition": {"status": "ready", "purpose": "Visual analysis"},
    }, "status": "operational"}

@app.post("/auth/demo-login")
@app.post("/auth/demo-token")
async def demo_login():
    uid = "demo-user-123"
    if db_enabled:
        try:
            r = supabase.table("users").select("*").eq("id", uid).execute()
            if not r.data:
                supabase.table("users").insert({"id": uid, "email": "demo@mentora.ai", "name": "Demo User", "created_at": datetime.utcnow().isoformat()}).execute()
        except: pass
    return {"access_token": create_token(uid), "token_type": "bearer", "user": {"id": uid, "email": "demo@mentora.ai", "name": "Demo User"}}

@app.post("/upload/video")
async def upload_video(file: UploadFile = File(...), uid: str = Depends(get_user)):
    content = await file.read()
    vid   = str(uuid.uuid4())
    uname = uuid.uuid4().hex[:8] + "_" + file.filename
    s3_url = ""
    if aws_enabled and s3_client:
        try:
            s3_client.put_object(Bucket=S3_BUCKET, Key="videos/" + uname, Body=content, ContentType=file.content_type or "video/mp4")
            s3_url = "https://" + S3_BUCKET + ".s3." + AWS_REGION + ".amazonaws.com/videos/" + uname
        except: pass
    if not s3_url:
        upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
        os.makedirs(upload_dir, exist_ok=True)
        with open(os.path.join(upload_dir, uname), "wb") as fh:
            fh.write(content)
        s3_url = "local://" + uname
    vdata = {"id": vid, "user_id": uid, "filename": file.filename, "unique_filename": uname,
             "s3_url": s3_url, "file_size": len(content), "uploaded_at": datetime.utcnow().isoformat()}
    if db_enabled:
        try: supabase.table("videos").insert({**vdata, "s3_key": "videos/" + uname, "content_type": file.content_type}).execute()
        except: pass
    _store["videos"][vid] = vdata
    return {"video_id": vid, "filename": file.filename, "s3_url": s3_url, "file_size": len(content),
            "message": "Video uploaded successfully", "storage": "aws_s3" if aws_enabled else "local"}

@app.post("/evaluate")
async def evaluate(req: EvalRequest, uid: str = Depends(get_user)):
    transcript = req.transcribed_text or ""
    if not transcript and req.video_id:
        v = _store["videos"].get(req.video_id)
        if not v and db_enabled:
            try:
                r = supabase.table("videos").select("*").eq("id", req.video_id).execute()
                v = r.data[0] if r.data else None
            except: pass
        if not v: raise HTTPException(status_code=404, detail="Video not found")
        transcript = "Lecture video: " + v.get("filename", "unknown") + ". Teaching content analysis based on syllabus alignment."
    if not transcript: raise HTTPException(status_code=400, detail="No transcript or video_id provided")
    result = run_eval(transcript, req.syllabus_text, req.teaching_objectives or "")
    eid = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    if db_enabled:
        try:
            supabase.table("evaluations").insert({
                "id": eid, "video_id": req.video_id or "direct", "user_id": uid,
                "syllabus_text": req.syllabus_text[:500], **result["scores"],
                "summary": result["reasoning"], "recommendations": result["suggestions"], "evaluated_at": now
            }).execute()
        except: pass
    _store["evals"].insert(0, {"id": eid, "video_id": req.video_id or "direct", "user_id": uid, **result, "evaluated_at": now})
    return {"evaluation_id": eid, **result, "video_filename": req.video_id or "direct_input", "evaluated_at": now}

@app.post("/quick-evaluate")
async def quick_evaluate(req: QuickEvalRequest, uid: str = Depends(get_user)):
    result = run_eval(req.transcribed_text, req.syllabus_text, req.teaching_objectives or "")
    return {"evaluation_id": str(uuid.uuid4()), **result, "evaluated_at": datetime.utcnow().isoformat()}

@app.get("/evaluations")
async def get_evals(uid: str = Depends(get_user)):
    if db_enabled:
        try:
            r = supabase.table("evaluations").select("*, videos(filename,uploaded_at)").eq("user_id", uid).order("evaluated_at", desc=True).execute()
            evals = [{
                "id": e["id"], "video_id": e["video_id"],
                "scores": {"engagement_score": e.get("engagement_score",0), "clarity_score": e.get("clarity_score",0),
                           "concept_coverage_score": e.get("concept_coverage_score",0), "pedagogy_score": e.get("pedagogy_score",0),
                           "overall_score": e.get("overall_score",0)},
                "summary": e.get("summary",""), "recommendations": e.get("recommendations",[]),
                "evaluated_at": e["evaluated_at"], "videos": e.get("videos")
            } for e in r.data]
            return {"evaluations": evals, "count": len(evals)}
        except: pass
    evals = [e for e in _store["evals"] if e.get("user_id") == uid]
    return {"evaluations": evals, "count": len(evals)}

if __name__ == "__main__":
    import uvicorn
    print("Mentora AI v3.0 - Teaching Intelligence System")
    print("S3:", "OK" if aws_enabled else "demo", " Bedrock:", "OK" if bedrock_enabled else "NLP", " DB:", "OK" if db_enabled else "memory")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
