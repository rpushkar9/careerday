#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from pathlib import Path

# Add src directory to Python path
script_dir = Path(__file__).parent.absolute()
src_dir = script_dir / "src"
sys.path.insert(0, str(src_dir))

try:
    from api_wrapper import CareerAPIWrapper
    wrapper = CareerAPIWrapper()
    sys.stderr.write("✓ CareerAPIWrapper initialized successfully\n")
except Exception as e:
    sys.stderr.write(f"✗ Failed to initialize CareerAPIWrapper: {e}\n")
    wrapper = None

app = FastAPI(
    title="CUNY CareerDay API",
    version="2.0.0",
    description="Career recommendations with CareerAPIWrapper integration"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class StudentProfile(BaseModel):
    email: str
    school: str
    major: str
    cip_code: Optional[str] = ""
    year: str
    gender: Optional[str] = None
    first_generation_student: Optional[bool] = None
    passions: str
    skills: List[str]
    career_goals: str

@app.get("/")
async def root():
    return {"message": "CUNY CareerDay API", "status": "running"}

@app.get("/api/debug/cip/{cip_code}")
async def debug_cip_code(cip_code: str):
    """Debug endpoint to check what careers exist for a CIP code"""
    if not wrapper:
        raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")
    
    try:
        sys.stderr.write(f"\n=== DEBUG CIP CODE: {cip_code} ===\n")
        
        # Check if wrapper has cip_mapper
        if hasattr(wrapper, 'cip_mapper'):
            # Get related occupations for this CIP
            occupations = wrapper.cip_mapper.get_related_occupations(
                cip_code=cip_code,
                max_results=50,  # Get up to 50 to see how many exist
                education_filter_type="hierarchy",
                experience_filter_type="hierarchy"
            )
            
            sys.stderr.write(f"Found {len(occupations)} occupations for CIP {cip_code}\n")
            
            # Log first few
            for i, occ in enumerate(occupations[:10]):
                sys.stderr.write(f"  {i+1}. {occ.get('soc_title')} ({occ.get('soc_code')})\n")
                sys.stderr.write(f"      Education: {occ.get('education_level', 'N/A')}\n")
                sys.stderr.write(f"      Experience: {occ.get('work_experience', 'N/A')}\n")
            
            return {
                "cip_code": cip_code,
                "total_occupations_found": len(occupations),
                "sample_occupations": [
                    {
                        "soc_code": occ.get('soc_code'),
                        "title": occ.get('soc_title'),
                        "education": occ.get('education_level', 'N/A'),
                        "experience": occ.get('work_experience', 'N/A'),
                        "median_wage": occ.get('median_wage', 'N/A'),
                        "employment_2023": occ.get('employment_2023', 'N/A')
                    }
                    for occ in occupations[:10]
                ]
            }
        else:
            return {"error": "CIP mapper not available"}
            
    except Exception as e:
        import traceback
        sys.stderr.write(f"Error in debug endpoint: {e}\n")
        sys.stderr.write(traceback.format_exc())
        return {"error": str(e), "traceback": traceback.format_exc()}



@app.post("/api/student-profile")
async def create_student_profile(profile: StudentProfile):
    """
    Create student profile and generate top 3 career recommendations.
    """
    if not wrapper:
        raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")

    try:
        # Log incoming request
        sys.stderr.write(f"\n{'='*60}\n")
        sys.stderr.write(f"📋 Student Profile Request\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"School: {profile.school}\n")
        sys.stderr.write(f"Major: {profile.major}\n")
        sys.stderr.write(f"CIP Code: {profile.cip_code}\n")
        sys.stderr.write(f"Skills: {profile.skills}\n")
        sys.stderr.write(f"Passions: {profile.passions}\n")
        sys.stderr.write(f"{'='*60}\n\n")

        # Validate CIP code
        if not profile.cip_code or not profile.cip_code.strip():
            sys.stderr.write("⚠️  WARNING: No CIP code provided\n")
            raise HTTPException(
                status_code=400, 
                detail="CIP code is required. Please provide a valid CIP code for the major."
            )

        # Use passions as a single interest
        interests = [profile.passions] if profile.passions else []

        # Get career recommendations with higher top_n to see if more exist
        sys.stderr.write(f"🔍 Calling recommendation engine with top_n=10 (to debug)...\n")
        recommendations = wrapper.get_career_recommendations(
            major=profile.major,
            cip_code=profile.cip_code,
            interests=interests,
            skills=profile.skills,
            top_n=10  # Request 10 to see how many are actually available
        )

        sys.stderr.write(f"✓ Got {len(recommendations)} recommendations total\n")
        
        # Log all recommendations for debugging
        for i, rec in enumerate(recommendations):
            sys.stderr.write(f"  {i+1}. {rec.get('title')} - Score: {rec.get('matchScore', 0)}\n")
        
        # Take top 3
        top_3 = recommendations[:3]
        
        # Log if we got fewer than 3
        if len(top_3) < 3:
            sys.stderr.write(f"⚠️  WARNING: Only {len(top_3)} recommendations available!\n")
            sys.stderr.write(f"   - CIP code: {profile.cip_code}\n")
            sys.stderr.write(f"   - Major: {profile.major}\n")
            sys.stderr.write(f"   - This suggests limited career data for this CIP code\n")

        return {
            "success": True,
            "student": {
                "email": profile.email,
                "school": profile.school,
                "major": profile.major,
                "year": profile.year
            },
            "top_3_careers": top_3,
            "debug": {
                "cip_code_used": profile.cip_code,
                "total_found": len(recommendations),
                "returned": len(top_3)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        sys.stderr.write(f"\n❌ ERROR in create_student_profile\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"Error: {e}\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"Full traceback:\n{traceback.format_exc()}\n")
        sys.stderr.write(f"{'='*60}\n\n")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    sys.stderr.write(f"\n🚀 Starting server on port {port}...\n\n")
    uvicorn.run(app, host="0.0.0.0", port=port)


    """
ADD THESE LINES TO YOUR EXISTING main.py
Don't replace your file - just add these parts!
"""

# ==============================================================================
# 1. ADD THESE IMPORTS AT THE TOP (after your existing imports)
# ==============================================================================

# Add these to your import section
from src.roadmap_generator import (
    RoadmapGenerator, 
    StudentProfile, 
    CareerGoal,
    UniversityResources
)
from src.university_scraper import UniversityResourceFetcher

# ==============================================================================
# 2. ADD THIS ENDPOINT (after your existing endpoints)
# ==============================================================================

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: dict):
    """
    Generate a personalized 4-year career roadmap using AI.
    
    Request body:
    {
        "name": "Student Name",
        "email": "student@cuny.edu",
        "school": "Queens College",
        "major": "Computer Science",
        "year": "Sophomore",
        "skills": ["Python", "JavaScript"],
        "interests": "AI and machine learning",
        "career_goals": "Become a software engineer",
        "career_title": "Software Developers",
        "soc_code": "15-1252",
        "career_description": "Design and develop software",
        "salary": "$120,730",
        "growth": "25%"
    }
    """
    try:
        sys.stderr.write(f"\n{'='*60}\n")
        sys.stderr.write(f"🗺️  Roadmap Generation Request\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"School: {request.get('school')}\n")
        sys.stderr.write(f"Major: {request.get('major')}\n")
        sys.stderr.write(f"Career: {request.get('career_title')}\n")
        sys.stderr.write(f"{'='*60}\n\n")
        
        # Create student profile
        student = StudentProfile(
            name=request.get('name', 'Student'),
            email=request.get('email'),
            school=request.get('school'),
            major=request.get('major'),
            year=request.get('year'),
            skills=request.get('skills', []),
            interests=request.get('interests', ''),
            career_goals=request.get('career_goals', '')
        )
        
        # Create career goal
        career = CareerGoal(
            title=request.get('career_title'),
            soc_code=request.get('soc_code', ''),
            description=request.get('career_description', ''),
            salary=request.get('salary', 'N/A'),
            growth=request.get('growth', 'N/A')
        )
        
        # Get university resources
        sys.stderr.write(f"📚 Fetching resources for {student.school}...\n")
        resource_fetcher = UniversityResourceFetcher()
        resources_dict = resource_fetcher.get_resources(student.school)
        
        # Convert dict to UniversityResources dataclass
        university_resources = UniversityResources(
            career_services_url=resources_dict.get('career_services_url', ''),
            cs_department_url=resources_dict.get('cs_department_url', ''),
            clubs=resources_dict.get('clubs', []),
            internship_programs=resources_dict.get('internship_programs', []),
            writing_center_url=resources_dict.get('writing_center_url', ''),
            student_life_url=resources_dict.get('student_life_url', '')
        )
        
        # Generate roadmap using AI
        sys.stderr.write(f"🤖 Generating AI roadmap...\n")
        generator = RoadmapGenerator()
        roadmap = generator.generate_roadmap(student, career, university_resources)
        
        sys.stderr.write(f"✓ Roadmap generated successfully!\n\n")
        
        return {
            "success": True,
            "roadmap": roadmap,
            "student": {
                "name": student.name,
                "school": student.school,
                "major": student.major,
                "year": student.year
            },
            "career": {
                "title": career.title,
                "salary": career.salary,
                "growth": career.growth
            }
        }
        
    except Exception as e:
        import traceback
        sys.stderr.write(f"\n❌ ERROR in generate_roadmap\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"Error: {e}\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"Full traceback:\n{traceback.format_exc()}\n")
        sys.stderr.write(f"{'='*60}\n\n")
        raise HTTPException(status_code=500, detail=str(e))

# ==============================================================================
# 3. THAT'S IT! Your existing code stays the same
# ==============================================================================