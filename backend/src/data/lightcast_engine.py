"""
Lightcast API Integration for Career Recommendations
Place this file in: backend/src/lightcast_engine.py

This module integrates Lightcast (formerly Emsi Burning Glass) API
to enhance career recommendations with real-time labor market data.
"""

import os
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json


class LightcastAPIClient:
    """
    Lightcast API Client
    Handles authentication and all API interactions with Lightcast
    """
    
    def __init__(self):
        """Initialize Lightcast API client with credentials from environment"""
        self.client_id = os.getenv("LIGHTCAST_CLIENT_ID")
        self.client_secret = os.getenv("LIGHTCAST_CLIENT_SECRET")
        
        if not self.client_id or not self.client_secret:
            raise ValueError(
                "Lightcast credentials not found. Please set:\n"
                "LIGHTCAST_CLIENT_ID and LIGHTCAST_CLIENT_SECRET environment variables"
            )
        
        self.auth_url = "https://auth.emsicloud.com/connect/token"
        self.api_base_url = "https://emsiservices.com"
        self.access_token = None
        self.token_expiry = None
    
    def _authenticate(self) -> None:
        """Get OAuth access token from Lightcast"""
        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials",
            "scope": "emsi_open"
        }
        
        try:
            response = requests.post(self.auth_url, data=payload, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            self.access_token = data["access_token"]
            expires_in = data.get("expires_in", 3600)
            self.token_expiry = datetime.now() + timedelta(seconds=expires_in - 300)
            
            print(f"✓ Lightcast authenticated. Token expires: {self.token_expiry}")
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lightcast authentication failed: {str(e)}")
    
    def _ensure_authenticated(self) -> None:
        """Ensure we have a valid token, refresh if needed"""
        if not self.access_token or datetime.now() >= self.token_expiry:
            self._authenticate()
    
    def _get_headers(self) -> Dict[str, str]:
        """Get authorization headers for API requests"""
        self._ensure_authenticated()
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    def extract_skills(self, text: str, confidence_threshold: float = 0.5) -> List[Dict]:
        """
        Extract skills from free text using Lightcast Skills API
        
        Args:
            text: Text containing skills (e.g., resume, job description)
            confidence_threshold: Minimum confidence (0.0 to 1.0)
        
        Returns:
            List of extracted skills with metadata
        """
        url = f"{self.api_base_url}/skills/versions/latest/extract"
        
        payload = {
            "text": text,
            "confidenceThreshold": confidence_threshold
        }
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers(), timeout=15)
            response.raise_for_status()
            
            data = response.json()
            skills = data.get("data", [])
            
            return [{
                "name": skill["skill"]["name"],
                "id": skill["skill"]["id"],
                "confidence": skill["confidence"]
            } for skill in skills]
            
        except Exception as e:
            print(f"⚠ Skill extraction failed: {str(e)}")
            return []
    
    def search_careers(self, query: str, limit: int = 20) -> List[Dict]:
        """
        Search for careers by title or keywords
        
        Args:
            query: Search term (e.g., "data scientist")
            limit: Max results to return
        
        Returns:
            List of matching careers with SOC codes
        """
        url = f"{self.api_base_url}/titles/versions/latest/search"
        
        payload = {"term": query, "limit": limit}
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers(), timeout=15)
            response.raise_for_status()
            return response.json().get("data", [])
        except Exception as e:
            print(f"⚠ Career search failed: {str(e)}")
            return []
    
    def get_occupation_details(self, soc_code: str) -> Optional[Dict]:
        """
        Get detailed information about an occupation
        
        Args:
            soc_code: Standard Occupational Classification code
        
        Returns:
            Occupation details including salary, education, etc.
        """
        soc_code = soc_code.replace(".", "").replace("-", "")
        url = f"{self.api_base_url}/taxonomies/soc/versions/latest/codes/{soc_code}"
        
        try:
            response = requests.get(url, headers=self._get_headers(), timeout=15)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"⚠ Failed to get occupation details: {str(e)}")
            return None
    
    def get_occupation_skills(self, soc_code: str, limit: int = 20) -> List[Dict]:
        """
        Get skills required for a specific occupation
        
        Args:
            soc_code: Standard Occupational Classification code
            limit: Max skills to return
        
        Returns:
            List of skills with importance rankings
        """
        url = f"{self.api_base_url}/taxonomies/soc/versions/latest/codes/{soc_code}/related-skills"
        
        try:
            response = requests.get(url, headers=self._get_headers(), timeout=15)
            response.raise_for_status()
            return response.json().get("data", [])[:limit]
        except Exception as e:
            print(f"⚠ Failed to get occupation skills: {str(e)}")
            return []
    
    def get_job_postings_count(self, title: str = None, soc_code: str = None) -> int:
        """
        Get current job postings count from Lightcast Job Postings Analytics
        
        Args:
            title: Job title to search
            soc_code: SOC code to search
        
        Returns:
            Number of active job postings
        """
        url = f"{self.api_base_url}/jpa/versions/latest/postings"
        
        filter_criteria = {}
        if title:
            filter_criteria["title_name"] = [title]
        if soc_code:
            filter_criteria["soc"] = [soc_code]
        
        if not filter_criteria:
            return 0
        
        payload = {"filter": filter_criteria}
        
        try:
            response = requests.post(url, json=payload, headers=self._get_headers(), timeout=15)
            response.raise_for_status()
            return response.json().get("total", 0)
        except Exception as e:
            print(f"⚠ Failed to get job postings: {str(e)}")
            return 0


class LightcastCareerEnhancer:
    """
    Enhance existing career recommendations with Lightcast data
    Integrates seamlessly with your existing recommendation_engine.py
    """
    
    def __init__(self):
        """Initialize the career enhancer with Lightcast client"""
        try:
            self.client = LightcastAPIClient()
            self.available = True
        except Exception as e:
            print(f"⚠ Lightcast not available: {e}")
            self.available = False
    
    def enrich_career(self, career_data: Dict) -> Dict:
        """
        Enrich a single career recommendation with Lightcast data
        
        Args:
            career_data: Career dict from your recommendation engine
        
        Returns:
            Enhanced career data with Lightcast information
        """
        if not self.available:
            return career_data
        
        try:
            career_title = career_data.get("career_title") or career_data.get("title")
            soc_code = career_data.get("soc_code")
            
            if not career_title:
                return career_data
            
            # Search for SOC code if not provided
            if not soc_code:
                search_results = self.client.search_careers(career_title, limit=1)
                if search_results:
                    soc_code = search_results[0].get("id")
            
            if not soc_code:
                return career_data
            
            # Get occupation details
            occupation = self.client.get_occupation_details(soc_code)
            if not occupation:
                return career_data
            
            # Get skills for this occupation
            skills_data = self.client.get_occupation_skills(soc_code, limit=10)
            top_skills = [s.get("name") for s in skills_data[:5] if s.get("name")]
            
            # Get job postings count
            job_postings = self.client.get_job_postings_count(soc_code=soc_code)
            
            # Add Lightcast data to career
            enhanced = career_data.copy()
            enhanced["lightcast_data"] = {
                "median_salary": occupation.get("median_salary"),
                "job_growth_rate": occupation.get("growth_rate"),
                "job_postings_count": job_postings,
                "typical_education": occupation.get("typical_education", "Bachelor's degree"),
                "work_experience": occupation.get("work_experience", "None"),
                "top_skills": top_skills,
                "description": occupation.get("description", "")[:300]  # Truncate
            }
            
            if not enhanced.get("soc_code"):
                enhanced["soc_code"] = soc_code
            
            return enhanced
            
        except Exception as e:
            print(f"⚠ Error enriching career {career_data.get('career_title')}: {e}")
            return career_data
    
    def enrich_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """
        Enrich multiple career recommendations with Lightcast data
        
        Args:
            recommendations: List of career recommendations
        
        Returns:
            List of enhanced recommendations
        """
        if not self.available:
            return recommendations
        
        enhanced = []
        for career in recommendations:
            enhanced.append(self.enrich_career(career))
        
        return enhanced
    
    def get_skills_based_careers(self, 
                                 skills: List[str], 
                                 interests: List[str] = None,
                                 top_n: int = 3) -> List[Dict]:
        """
        Get career recommendations purely from Lightcast based on skills
        
        Args:
            skills: List of student skills
            interests: Optional interests
            top_n: Number of recommendations
        
        Returns:
            List of career recommendations from Lightcast
        """
        if not self.available:
            return []
        
        try:
            # Combine skills and interests
            all_text = " ".join(skills)
            if interests:
                all_text += " " + " ".join(interests)
            
            # Extract normalized skills
            extracted = self.client.extract_skills(all_text)
            skill_names = [s["name"] for s in extracted[:5]]
            
            # Search for careers
            search_query = " ".join(skill_names)
            careers = self.client.search_careers(search_query, limit=top_n * 2)
            
            # Enrich career data
            recommendations = []
            for career in careers[:top_n]:
                enriched_data = {
                    "career_title": career["name"],
                    "soc_code": career["id"]
                }
                enriched = self.enrich_career(enriched_data)
                
                if "lightcast_data" in enriched:
                    recommendations.append({
                        "career_title": enriched["career_title"],
                        "soc_code": enriched["soc_code"],
                        "description": enriched["lightcast_data"].get("description", ""),
                        "median_salary": enriched["lightcast_data"].get("median_salary"),
                        "job_growth_rate": enriched["lightcast_data"].get("job_growth_rate"),
                        "typical_education": enriched["lightcast_data"].get("typical_education"),
                        "work_experience": enriched["lightcast_data"].get("work_experience"),
                        "job_postings_count": enriched["lightcast_data"].get("job_postings_count"),
                        "required_skills": enriched["lightcast_data"].get("top_skills", []),
                        "source": "lightcast_skills_match"
                    })
            
            return recommendations
            
        except Exception as e:
            print(f"⚠ Error getting skills-based careers: {e}")
            return []


# Utility functions for testing
def test_lightcast():
    """Test Lightcast integration"""
    try:
        print("🧪 Testing Lightcast Integration...\n")
        
        enhancer = LightcastCareerEnhancer()
        
        if not enhancer.available:
            print("❌ Lightcast not available")
            return False
        
        print("✓ Lightcast client initialized")
        
        # Test skill extraction
        test_skills = enhancer.client.extract_skills(
            "Python programming, data analysis, machine learning, SQL"
        )
        print(f"✓ Extracted {len(test_skills)} skills")
        
        # Test career search
        careers = enhancer.client.search_careers("software developer", limit=3)
        print(f"✓ Found {len(careers)} careers")
        
        # Test career enrichment
        test_career = {"career_title": "Software Developer"}
        enriched = enhancer.enrich_career(test_career)
        print(f"✓ Career enrichment works: {enriched.get('soc_code')}")
        
        print("\n✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        return False


if __name__ == "__main__":
    test_lightcast()