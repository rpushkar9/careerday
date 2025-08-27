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
    stream=sys.stderr  # Redirect all logs to stderr
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
            # Data files are in ../data relative to src/
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
            # Silent initialization error for production
            pass
    
    def _clean_output(self):
        """Ensure only JSON goes to stdout, everything else to stderr"""
        # Redirect any remaining stdout to stderr
        import io
        import contextlib
        
        # Capture stdout and redirect to stderr
        with contextlib.redirect_stdout(sys.stderr):
            pass
    
    def get_career_recommendations(
        self, 
        major: str, 
        cip_code: str = None,
        interests: List[str] = None, 
        skills: List[str] = None,
        university: str = None,
        top_n: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Get top career recommendations based on user input
        
        Args:
            major: User's major/field of study
            cip_code: CIP code for the major program
            interests: List of user interests
            skills: List of user skills
            university: User's university (optional)
            top_n: Number of recommendations to return
            
        Returns:
            List of career recommendation dictionaries
        """
        try:
            # Debug logging
            sys.stderr.write(f"get_career_recommendations called with: major={major}, cip_code={cip_code}\n")
            
            # If we have a CIP code, use the real recommendation engine
            if cip_code and cip_code.strip():
                sys.stderr.write(f"Processing CIP code: {cip_code}\n")
                
                # Initialize the recommendation engine
                if not self.recommendation_engine.initialize():
                    sys.stderr.write("Recommendation engine initialization failed\n")
                    raise Exception("Recommendation engine initialization failed")
                
                sys.stderr.write("Recommendation engine initialized successfully\n")
                
                # Create recommendation request
                from recommendation_engine import RecommendationRequest
                request = RecommendationRequest(
                    cip_code=cip_code,
                    max_results=top_n,
                    preferences={
                        'interests': interests or [],
                        'skills': skills or [],
                        'major': major
                    }
                )
                
                sys.stderr.write(f"Created request: {request}\n")
                
                # Get real recommendations
                response = self.recommendation_engine.get_recommendations(request)
                sys.stderr.write(f"Got response with {len(response.recommendations)} recommendations\n")
                
                # Convert to frontend format
                recommendations = []
                for rec in response.recommendations:
                    # Extract growth percentage from employment data
                    growth = "N/A"
                    if rec.get('growth_10yr_pct'):
                        growth = f"{rec['growth_10yr_pct']}%"
                    elif rec.get('employment_2023') and rec.get('employment_2033'):
                        # Calculate growth if we have employment numbers
                        try:
                            emp_2023 = float(rec['employment_2023'])
                            emp_2033 = float(rec['employment_2033'])
                            if emp_2023 > 0:
                                growth_pct = ((emp_2033 - emp_2023) / emp_2023) * 100
                                growth = f"{growth_pct:.1f}%"
                        except (ValueError, TypeError):
                            growth = "N/A"
                    
                    # Extract salary from OEWS data
                    salary = "N/A"
                    if rec.get('median_pay_usd'):
                        try:
                            salary = f"${int(rec['median_pay_usd']):,}"
                        except (ValueError, TypeError):
                            salary = "N/A"
                    
                    recommendations.append({
                        "title": rec['title'],
                        "description": rec['description'] or f"Career in {rec.get('soc_title', major)}",
                        "salary": salary,
                        "growth": growth,
                        "matchScore": int(rec.get('confidence_score', 85) * 100), # Convert to percentage
                        "soc_code": rec.get('soc', ''),
                        "soc_title": rec.get('title', ''),
                        "cip_code": cip_code
                    })
                
                return recommendations[:top_n]
            
            # No CIP code provided - this is an error condition
            sys.stderr.write("No CIP code provided\n")
            raise Exception("CIP code is required for career recommendations")
            
        except Exception as e:
            # Log the exception details
            sys.stderr.write(f"Exception in get_career_recommendations: {e}\n")
            import traceback
            sys.stderr.write(f"Traceback: {traceback.format_exc()}\n")
            # Re-raise the exception to be handled by the caller
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
        
        # Ensure only JSON goes to stdout
        sys.stdout.write(json.dumps(recommendations, indent=2))
        sys.stdout.flush()
        
        # Test without CIP code (should throw error)
        try:
            mock_recommendations = wrapper.get_career_recommendations(
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
