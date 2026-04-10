"""
Multi-Agent Evaluation Service
Coordinates specialized agents for comprehensive teaching evaluation
"""
from typing import Dict, Any, List
from app.models.requests import EvaluateRequest
from app.models.responses import EvaluateResponse, EvaluationScore
from app.services.evaluation_service import EvaluationService


class MultiAgentEvaluationService:
    """Main service that orchestrates multiple specialized agents"""
    
    def __init__(self):
        pass
    
    def evaluate_teaching(self, request: EvaluateRequest, user_profile: Dict[str, Any] = None) -> EvaluateResponse:
        """Run evaluation using multiple specialized agents"""
        # For now, use the deterministic evaluation as a fallback
        # In a full implementation, this would coordinate multiple agents
        from app.services.evaluation_service import EvaluationService
        return EvaluationService.evaluate_teaching(request)


# Singleton instance
multi_agent_service = MultiAgentEvaluationService()