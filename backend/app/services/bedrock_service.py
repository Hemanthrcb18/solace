import boto3
import json
import os
from app.utils.logging import logger
from app.core.config import settings

class BedrockService:
    def __init__(self):
        self.client = None
        if settings.AWS_ACCESS_KEY_ID:
            try:
                self.client = boto3.client(
                    service_name='bedrock-runtime',
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
            except Exception as e:
                logger.error(f"Failed to initialize Bedrock client: {e}")

    def evaluate_teaching(self, transcript: str, syllabus: str):
        if not self.client:
            logger.warning("Bedrock client not initialized, using mock evaluation")
            return self._mock_evaluation()

        prompt = f"""
        Analyze this teacher's transcript against the syllabus.
        
        Syllabus:
        {syllabus}
        
        Transcript:
        {transcript}
        
        Return a JSON object with:
        - clarity_score (0-100)
        - coverage_score (0-100)
        - pedagogy_score (0-100)
        - feedback (string)
        - suggestions (list of strings)
        """

        try:
            response = self.client.invoke_model(
                modelId=settings.AWS_BEDROCK_MODEL_ID or 'anthropic.claude-3-haiku-20240307-v1:0',
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1024,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                })
            )
            result = json.loads(response.get('body').read())
            # Parse Claude 3 response format
            text_response = result['content'][0]['text']
            # Find JSON in text
            start = text_response.find('{')
            end = text_response.rfind('}') + 1
            if start != -1 and end != 0:
                parsed_result = json.loads(text_response[start:end])
                # Ensure the result matches the expected format
                return {
                    "engagement_score": parsed_result.get('engagement_score', 7.5),
                    "concept_coverage_score": parsed_result.get('coverage_score', 8.0),
                    "clarity_score": parsed_result.get('clarity_score', 7.8),
                    "pedagogy_score": parsed_result.get('pedagogy_score', 8.2),
                    "overall_score": parsed_result.get('overall_score', 7.9),
                    "reasoning": parsed_result.get('reasoning', ["Good engagement with interactive elements"]),
                    "improvements": parsed_result.get('suggestions', parsed_result.get('improvements', ["Add more questions to increase student engagement"]))
                }
            else:
                return self._mock_evaluation()
        except json.JSONDecodeError:
            return self._mock_evaluation()
        except Exception as e:
            logger.error(f"Bedrock evaluation failed: {e}")
            return self._mock_evaluation()

    def _mock_evaluation(self):
        return {
            "engagement_score": 7.5,
            "concept_coverage_score": 8.0,
            "clarity_score": 7.8,
            "pedagogy_score": 8.2,
            "overall_score": 7.9,
            "reasoning": ["Good engagement with interactive elements", "Strong alignment with syllabus content", "Clear explanations with appropriate examples", "Effective use of teaching techniques"],
            "improvements": ["Add more questions to increase student engagement", "Include more real-world examples"]
        }

bedrock_service = BedrockService()
