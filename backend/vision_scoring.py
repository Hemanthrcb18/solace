import random

def score_physical_delivery() -> float:
    """Mock CV analysis for body language and hand movements (0-100)."""
    return round(random.uniform(70.0, 95.0), 1)

def score_expression() -> float:
    """Mock CV analysis for facial expression engagement (0-100)."""
    return round(random.uniform(65.0, 98.0), 1)

def score_blackboard_usage() -> float:
    """Mock CV analysis for whether the teacher effectively used props/board (0-100)."""
    return round(random.uniform(50.0, 90.0), 1)

def generate_vision_scores(video_path: str = None) -> dict:
    """
    In a real app, this uses OpenCV and Gemini/GPT-4o Vision to extract 
    frames from video_path and calculate physical metrics.
    For the hackathon MVP, we return realistic simulated scores to ensure stability.
    """
    physical_score = score_physical_delivery()
    expression_score = score_expression()
    blackboard_score = score_blackboard_usage()
    
    # Calculate a combined vision score out of 100
    avg_vision_score = (physical_score + expression_score + blackboard_score) / 3
    
    return {
        "physical_score": physical_score,
        "expression_score": expression_score,
        "blackboard_score": blackboard_score,
        "vision_overall": round(avg_vision_score, 1)
    }
