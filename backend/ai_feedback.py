import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def get_rule_based_feedback(scores: dict) -> str:
    """Fallback generator for feedback when OpenAI is unavailable or fails."""
    feedback = []
    wpm = scores["wpm"]
    
    if 120 <= wpm <= 160:
        feedback.append("Excellent speaking pace! Your speed keeps the audience engaged without overwhelming them.")
    elif wpm < 120:
        feedback.append("Your speaking pace is a bit slow. Try to speak a bit faster to keep the energy up.")
    else:
        feedback.append("You are speaking quite fast. Try to slow down slightly to ensure all students can follow along.")

    if scores["content_score"] >= 80:
        feedback.append("Great job covering the required topics. The content was highly relevant and educational.")
    elif scores["content_score"] >= 50:
        feedback.append("You touched on several key concepts, but missing a few core syllabus items. Ensure deeper coverage next time.")
    else:
        feedback.append("The content lacked key technical terms expected for this module. Consider reviewing the syllabus before presenting.")
        
    return " ".join(feedback)

def generate_feedback(text: str, scores: dict) -> str:
    """Uses OpenAI for feedback. Falls back gracefully."""
    if not client:
        return get_rule_based_feedback(scores)
    
    prompt = f"""
    You are an expert teaching evaluator. Analyze the transcript and provide a brief, supportive, but constructive feedback (max 3 sentences).
    
    Context Scores:
    - WPM: {scores['wpm']} (Ideal is 120-160)
    - Content Coverage: {scores['content_score']}%
    - Overall Score: {scores['final_score']}%
    
    Transcript: {text}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API Failed: {e}. Falling back to rule-based feedback.")
        return get_rule_based_feedback(scores)
