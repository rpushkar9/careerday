#!/usr/bin/env python3
"""
CareerMatch API Wrapper
Provides a clean interface for Next.js to call the Python recommendation engines
"""

import sys
import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional

# Configure logging to go to stderr, not stdout
logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s:%(name)s:%(message)s',
    stream=sys.stderr
)

# Add the engines directory to Python path
engines_dir = Path(__file__).parent / "engines"
sys.path.append(str(engines_dir))

try:
    from recommendation_engine import RecommendationEngine
    from scoring_engine import ScoringEngine
    from skills_engine import SkillsEngine
    from data.data_manager import DataManager
    from data.cip_mapper import CIPMapper
except ImportError as e:
    print(f"Error importing engines: {e}")
    sys.exit(1)

class CareerAPIWrapper:
    """Wrapper class to provide career recommendation API functionality"""
    
    def __init__(self):
        """Initialize the API wrapper with all necessary engines"""
        try:
            # Initialize data manager with correct paths
            data_dir = Path(__file__).parent.parent / "data"
            from data.data_manager import DataConfig
            config = DataConfig(data_dir=str(data_dir))
            self.data_manager = DataManager(config=config)
            
            # Initialize engines
            self.recommendation_engine = RecommendationEngine(data_config=config)
            self.scoring_engine = ScoringEngine()
            self.skills_engine = SkillsEngine()
            self.cip_mapper = CIPMapper(data_dir=str(data_dir))
            
        except Exception as e:
            sys.stderr.write(f"Initialization error: {e}\n")
    
    def get_career_recommendations(
        self, 
        major: str, 
        cip_code: str = None,
        interests: List[str] = None, 
        skills: List[str] = None,
        university: str = None,
        top_n: int = 3,
        entry_level_education: str = "Bachelor's degree",
        work_experience: str = "None",
        education_filter_type: str = "hierarchy",
        experience_filter_type: str = "hierarchy"
    ) -> List[Dict[str, Any]]:
        """
        Get top career recommendations based on user input

        Safely handles skills and interests as lists to prevent Python list index errors.
        """
        try:
            # Ensure lists
            interests = interests or []
            skills = skills or []

            sys.stderr.write(f"get_career_recommendations called with: major={major}, cip_code={cip_code}\n")
            sys.stderr.write(f"Skills: {skills}\nInterests: {interests}\n")

            if not cip_code or not cip_code.strip():
                raise Exception("CIP code is required for career recommendations")

            # Initialize the recommendation engine
            if not self.recommendation_engine.initialize():
                raise Exception("Recommendation engine initialization failed")

            # Create recommendation request
            from recommendation_engine import RecommendationRequest
            request = RecommendationRequest(
                cip_code=cip_code,
                max_results=top_n,
                preferences={
                    'interests': interests,
                    'skills': skills,
                    'major': major
                },
                entry_level_education=entry_level_education,
                work_experience=work_experience,
                education_filter_type=education_filter_type,
                experience_filter_type=experience_filter_type
            )

            # Get recommendations
            response = self.recommendation_engine.get_recommendations(request)

            # Convert to frontend format safely
            recommendations = []
            for rec in response.recommendations:
                # Safely calculate growth
                growth = "N/A"
                try:
                    if rec.get('growth_10yr_pct') is not None:
                        growth = f"{rec['growth_10yr_pct']}%"
                    elif rec.get('employment_2023') and rec.get('employment_2033'):
                        emp_2023 = float(rec['employment_2023'])
                        emp_2033 = float(rec['employment_2033'])
                        if emp_2023 > 0:
                            growth_pct = ((emp_2033 - emp_2023) / emp_2023) * 100
                            growth = f"{growth_pct:.1f}%"
                except Exception:
                    growth = "N/A"

                # Safely extract salary
                salary = "N/A"
                try:
                    if rec.get('median_pay_usd') is not None:
                        salary = f"${int(rec['median_pay_usd']):,}"
                except Exception:
                    salary = "N/A"

                recommendations.append({
                    "title": rec.get('title', major),
                    "description": rec.get('description') or f"Career in {rec.get('soc_title', major)}",
                    "salary": salary,
                    "growth": growth,
                    "matchScore": int(rec.get('confidence_score', 0) * 100),
                    "soc_code": rec.get('soc', ''),
                    "soc_title": rec.get('title', ''),
                    "cip_code": cip_code
                })

            return recommendations[:top_n]

        except Exception as e:
            import traceback
            sys.stderr.write(f"Exception in get_career_recommendations: {e}\n")
            sys.stderr.write(f"Traceback: {traceback.format_exc()}\n")
            raise

    def get_career_details(self, career_title: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific career"""
        try:
            # TODO: Implement career details lookup
            return None
        except Exception as e:
            return None
    
    def get_skills_analysis(self, skills: List[str]) -> Dict[str, Any]:
        """Analyze user skills and suggest improvements"""
        try:
            # TODO: Implement skills analysis
            return {"analysis": "Skills analysis coming soon"}
        except Exception as e:
            return {"error": str(e)}

def main():
    """Test function for the API wrapper"""
    try:
        wrapper = CareerAPIWrapper()
        
        # Test with CIP code for Computer Science
        recommendations = wrapper.get_career_recommendations(
            major="Computer Science",
            cip_code="11.0101",  # Computer Science CIP code
            interests=["technology", "problem-solving"],
            skills=["programming", "analytics"]
        )
        
        sys.stdout.write(json.dumps(recommendations, indent=2))
        sys.stdout.flush()
        
        # Test without CIP code (should throw error)
        try:
            wrapper.get_career_recommendations(
                major="Computer Science",
                interests=["technology", "problem-solving"],
                skills=["programming", "analytics"]
            )
        except Exception as e:
            sys.stderr.write(f"Error without CIP code: {e}\n")
        
    except Exception as e:
        sys.stderr.write(f"Test failed: {e}\n")

if __name__ == "__main__":
    main()
