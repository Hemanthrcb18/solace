import re
import collections

# Default simulated RAG / syllabus data if none is provided
DEFAULT_EXPECTED_KEYWORDS = [
    "software", "engineering", "architecture", "design", "testing",
    "deployment", "agile", "scrum", "requirements", "maintenance",
    "python", "fastapi", "react", "html", "css"
]

def calculate_wpm(text: str, duration_seconds: int = 60) -> int:
    """Calculate words per minute."""
    if not text.strip():
        return 0
    words = len(text.split())
    minutes = duration_seconds / 60.0
    return int(words / minutes) if minutes > 0 else words

def score_clarity(wpm: int) -> float:
    """
    Ideal WPM: 120 - 160.
    100% score if within range, penalize linearly outside.
    """
    if 120 <= wpm <= 160:
        return 100.0
    elif wpm < 120:
        # linear penalty, down to 0
        return max(0.0, 100 - (120 - wpm) * 1.5)
    else: # wpm > 160
        return max(0.0, 100 - (wpm - 160) * 1.5)

def extract_keywords_from_syllabus(syllabus: str) -> list:
    """Extract significant words from syllabus text to use as keywords."""
    if not syllabus.strip():
        return DEFAULT_EXPECTED_KEYWORDS
    
    # Very simple extraction: ignoring common stop words
    stop_words = {"the", "and", "a", "an", "to", "of", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "at", "as", "from"}
    words = re.findall(r'\b[a-z]{3,}\b', syllabus.lower())
    filtered_words = [w for w in words if w not in stop_words]
    
    # Return top 20 most common significant words
    counter = collections.Counter(filtered_words)
    return [word for word, count in counter.most_common(20)]

def score_content(text: str, syllabus: str = "") -> float:
    """
    Simulated RAG content score based on keyword extraction from a syllabus.
    """
    if not text:
        return 0.0
        
    expected_keywords = extract_keywords_from_syllabus(syllabus)
    
    words = re.findall(r'\b\w+\b', text.lower())
    matched_keywords = [kw for kw in expected_keywords if kw in words]
    
    if not matched_keywords:
        return 20.0 # Base minimum to encourage
    
    # Calculate score based on percentage of syllabus keywords covered (up to max 100)
    # Give high marks if they cover at least 5 of the top keywords
    match_ratio = len(matched_keywords) / max(5, min(len(expected_keywords), 15))
    calculated_score = match_ratio * 100.0
    
    return min(100.0, calculated_score + 20.0) # Base 20 + matched ratio

def generate_scores(text: str, duration_seconds: int = 60, syllabus: str = "") -> dict:
    wpm = calculate_wpm(text, duration_seconds)
    clarity_score = score_clarity(wpm)
    content_score = score_content(text, syllabus)
    
    final_score = (clarity_score * 0.4) + (content_score * 0.6)
    
    return {
        "wpm": wpm,
        "clarity_score": round(clarity_score, 1),
        "content_score": round(content_score, 1),
        "final_score": round(final_score, 1)
    }
