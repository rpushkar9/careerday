#!/usr/bin/env python3
"""
CareerMatch API Wrapper
Provides a clean interface for Next.js to call the Python recommendation engines
"""

import sys
import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional

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
            self.recommendation_engine = RecommendationEngine()
            self.scoring_engine = ScoringEngine()
            self.skills_engine = SkillsEngine()
            self.cip_mapper = CIPMapper(data_dir=str(data_dir))
            
            print("CareerAPIWrapper initialized successfully")
        except Exception as e:
            print(f"Error initializing CareerAPIWrapper: {e}")
            raise
    
    def get_career_recommendations(
        self, 
        major: str, 
        interests: List[str] = None, 
        skills: List[str] = None,
        university: str = None,
        top_n: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Get top career recommendations based on user input
        
        Args:
            major: User's major/field of study
            interests: List of user interests
            skills: List of user skills
            university: User's university (optional)
            top_n: Number of recommendations to return
            
        Returns:
            List of career recommendation dictionaries
        """
        try:
            # For now, return mock data structure that matches frontend expectations
            # TODO: Integrate with actual recommendation engine logic
            
            mock_recommendations = [
                {
                    "title": "Software Engineer",
                    "description": "Develops and maintains software applications using programming languages.",
                    "salary": "$105,000",
                    "growth": "25%",
                    "matchScore": 92,
                },
                {
                    "title": "Data Scientist", 
                    "description": "Analyzes large data sets to uncover insights and support decision-making.",
                    "salary": "$120,000",
                    "growth": "36%",
                    "matchScore": 87,
                },
                {
                    "title": "Product Manager",
                    "description": "Leads product development and strategy for software products.",
                    "salary": "$115,000",
                    "growth": "28%",
                    "matchScore": 85,
                },
            ]
            
            # Return top N recommendations
            return mock_recommendations[:top_n]
            
        except Exception as e:
            print(f"Error getting career recommendations: {e}")
            return []
    
    def get_career_details(self, career_title: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific career"""
        try:
            # TODO: Implement career details lookup
            return None
        except Exception as e:
            print(f"Error getting career details: {e}")
            return None
    
    def get_skills_analysis(self, skills: List[str]) -> Dict[str, Any]:
        """Analyze user skills and suggest improvements"""
        try:
            # TODO: Implement skills analysis
            return {"analysis": "Skills analysis coming soon"}
        except Exception as e:
            print(f"Error analyzing skills: {e}")
            return {"error": str(e)}

def main():
    """Test function for the API wrapper"""
    try:
        wrapper = CareerAPIWrapper()
        recommendations = wrapper.get_career_recommendations(
            major="Computer Science",
            interests=["technology", "problem-solving"],
            skills=["programming", "analytics"]
        )
        print("Test recommendations:", json.dumps(recommendations, indent=2))
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    main()
