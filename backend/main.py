from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import json
import sys
import os
from pathlib import Path

# Set up proper Python path for Railway
script_dir = Path(__file__).parent.absolute()
current_dir = Path.cwd()

print(f"Script directory: {script_dir}")
print(f"Current working directory: {current_dir}")

backend_dir = script_dir
src_dir = backend_dir / "src"
engines_dir = src_dir / "engines"
data_dir = backend_dir / "data"

# Add all necessary directories to Python path
sys.path.insert(0, str(backend_dir))
sys.path.insert(0, str(src_dir))
sys.path.insert(0, str(engines_dir))
sys.path.insert(0, str(data_dir))

os.environ['DATA_DIR'] = str(data_dir)

print(f"Backend directory: {backend_dir}")
print(f"Source directory: {src_dir}")
print(f"Data directory: {data_dir}")

try:
    from api_wrapper import CareerAPIWrapper
    print("✓ Successfully imported CareerAPIWrapper")
except ImportError as e:
    print(f"❌ Import error: {e}")
    raise

# Try to import Lightcast integration (optional)
lightcast_available = False
try:
    from lightcast_engine import LightcastCareerEnhancer
    lightcast_available = True
    print("✓ Lightcast integration available")
except ImportError as e:
    print("⚠️  Lightcast integration not available (optional)")
    print(f"   To enable: 1) Add lightcast_engine.py to /src/ 2) Set LIGHTCAST credentials")

app = FastAPI(
    title="CUNY CareerDay API",
    version="2.0.0",
    description="Career recommendations with optional Lightcast enhancement"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CareerRequest(BaseModel):
    """Career recommendation request model"""
    major: Optional[str] = ""
    cip_code: Optional[str] = ""
    interests: Optional[List[str]] = []
    skills: Optional[List[str]] = []
    university: Optional[str] = ""
    top_n: Optional[int] = 3
    
    # Existing filtering options
    entry_level_education: Optional[str] = "Bachelor's degree"
    work_experience: Optional[str] = "None"
    education_filter_type: Optional[str] = "hierarchy"
    experience_filter_type: Optional[str] = "hierarchy"
    
    # NEW: Lightcast enhancement
    use_lightcast: Optional[bool] = False

    @validator("education_filter_type", "experience_filter_type")
    def validate_filter_types(cls, v):
        if v not in ["hierarchy", "strict"]:
            raise ValueError("Filter type must be 'hierarchy' or 'strict'")
        return v


class StudentProfile(BaseModel):
    """Complete CUNY student profile"""
    email: str
    school: str  # e.g., "Baruch College"
    major: str
    cip_code: Optional[str] = ""
    year: str  # Freshman, Sophomore, Junior, Senior, Graduate, Recent Graduate
    gender: Optional[str] = None
    first_generation_student: Optional[bool] = None
    passions: str  # What are you passionate about?
    skills: List[str]  # Top skills
    career_goals: str  # Career goals


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "CUNY CareerDay API",
        "version": "2.0.0",
        "status": "running",
        "features": {
            "base_recommendations": True,
            "lightcast_enhancement": lightcast_available,
            "student_profiles": True
        },
        "endpoints": {
            "recommendations": "/api/career-recommendations",
            "profile": "/api/student-profile",
            "lightcast_only": "/api/lightcast-recommendations",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "lightcast_enabled": lightcast_available,
        "timestamp": str(Path(__file__).stat().st_mtime)
    }


@app.get("/debug")
async def debug_info():
    """Debug endpoint for troubleshooting"""
    return {
        "status": "running",
        "environment": {
            "PORT": os.environ.get("PORT", "Not set"),
            "RAILWAY_ENV": os.environ.get("RAILWAY_ENVIRONMENT", "Not set"),
            "LIGHTCAST_ID": "Set" if os.environ.get("LIGHTCAST_CLIENT_ID") else "Not set",
            "LIGHTCAST_SECRET": "Set" if os.environ.get("LIGHTCAST_CLIENT_SECRET") else "Not set",
        },
        "paths": {
            "backend_dir": str(backend_dir),
            "src_dir": str(src_dir),
            "data_dir": str(data_dir),
        },
        "files": {
            "backend_files": [f.name for f in backend_dir.glob("*.py")],
            "src_files": [f.name for f in src_dir.glob("*.py")] if src_dir.exists() else [],
            "data_files": [f.name for f in data_dir.glob("*")] if data_dir.exists() else [],
        },
        "features": {
            "lightcast_available": lightcast_available
        }
    }


@app.post("/api/career-recommendations")
async def get_career_recommendations(request: CareerRequest):
    """
    Get top 3 career recommendations based on major, skills, and interests.
    
    **Parameters:**
    - **major**: Student's major (e.g., "Computer Science")
    - **cip_code**: CIP code for the major (e.g., "11.0701")
    - **skills**: List of student skills
    - **interests**: List of interests/passions
    - **top_n**: Number of recommendations (default: 3)
    - **use_lightcast**: Enhance with real-time job market data (default: false)
    
    **Lightcast Enhancement:**
    When `use_lightcast=true`, each recommendation includes:
    - Real-time job postings count
    - Median salary data
    - Job growth projections
    - Required skills breakdown
    - Typical education/experience requirements
    
    **Example:**
    ```json
    {
      "major": "Computer Science",
      "cip_code": "11.0701",
      "skills": ["Python", "Data Analysis", "SQL"],
      "interests": ["Technology", "Problem Solving"],
      "use_lightcast": true,
      "top_n": 3
    }
    ```
    """
    try:
        # Get base recommendations from your existing system
        wrapper = CareerAPIWrapper()
        recommendations = wrapper.get_career_recommendations(
            major=request.major,
            cip_code=request.cip_code,
            interests=request.interests,
            skills=request.skills,
            university=request.university,
            top_n=request.top_n,
            entry_level_education=request.entry_level_education,
            work_experience=request.work_experience,
            education_filter_type=request.education_filter_type,
            experience_filter_type=request.experience_filter_type
        )
        
        # Enhance with Lightcast if requested
        if request.use_lightcast:
            if not lightcast_available:
                recommendations["lightcast_status"] = "unavailable"
                recommendations["note"] = "Lightcast not configured. Set LIGHTCAST_CLIENT_ID and LIGHTCAST_CLIENT_SECRET."
            else:
                try:
                    enhancer = LightcastCareerEnhancer()
                    careers = recommendations.get("careers", [])
                    
                    if careers:
                        enhanced_careers = enhancer.enrich_recommendations(careers)
                        recommendations["careers"] = enhanced_careers
                        recommendations["lightcast_enhanced"] = True
                        recommendations["lightcast_status"] = "success"
                    
                except Exception as e:
                    print(f"⚠️  Lightcast enhancement failed: {e}")
                    recommendations["lightcast_status"] = "error"
                    recommendations["lightcast_error"] = str(e)
        else:
            recommendations["lightcast_enhanced"] = False
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/lightcast-recommendations")
async def get_lightcast_recommendations(request: CareerRequest):
    """
    Get career recommendations ONLY from Lightcast (bypasses your base system).
    Useful for comparing Lightcast results with your existing engine.
    
    **Requires:** Lightcast API credentials
    
    **Example:**
    ```json
    {
      "skills": ["Python", "Machine Learning", "Data Analysis"],
      "interests": ["Healthcare", "Technology"],
      "top_n": 3
    }
    ```
    """
    if not lightcast_available:
        raise HTTPException(
            status_code=503,
            detail="Lightcast not available. Set LIGHTCAST_CLIENT_ID and LIGHTCAST_CLIENT_SECRET environment variables."
        )
    
    try:
        enhancer = LightcastCareerEnhancer()
        
        careers = enhancer.get_skills_based_careers(
            skills=request.skills,
            interests=request.interests,
            top_n=request.top_n
        )
        
        return {
            "success": True,
            "source": "lightcast_only",
            "count": len(careers),
            "careers": careers,
            "note": "These recommendations are generated purely from Lightcast skill matching"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/student-profile")
async def create_student_profile(profile: StudentProfile):
    """
    Save a complete CUNY student profile and get top 3 career recommendations.
    
    This endpoint:
    1. Saves the student profile (ready for database integration)
    2. Generates personalized career recommendations
    3. Optionally enhances with Lightcast data
    
    **Example:**
    ```json
    {
      "email": "john.doe@baruch.cuny.edu",
      "school": "Baruch College",
      "major": "Computer Science",
      "cip_code": "11.0701",
      "year": "Junior",
      "gender": "Male",
      "first_generation_student": false,
      "passions": "I love solving complex problems and building things with code",
      "skills": ["Python", "JavaScript", "SQL", "Git", "Problem Solving"],
      "career_goals": "I want to work as a software engineer at a tech company"
    }
    ```
    """
    try:
        # TODO: Save profile to database
        # conn = get_db_connection()
        # cursor.execute("INSERT INTO student_profiles ...")
        
        # Generate recommendations
        career_request = CareerRequest(
            major=profile.major,
            cip_code=profile.cip_code,
            interests=[profile.passions],
            skills=profile.skills,
            top_n=3,
            use_lightcast=lightcast_available  # Auto-enable if available
        )
        
        recommendations = await get_career_recommendations(career_request)
        
        return {
            "success": True,
            "message": "Profile created successfully",
            "student": {
                "email": profile.email,
                "school": profile.school,
                "major": profile.major,
                "year": profile.year
            },
            "top_3_careers": recommendations.get("careers", [])[:3],
            "full_recommendations": recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/test-lightcast")
async def test_lightcast_connection():
    """
    Test Lightcast API connection and functionality.
    Use this to verify your credentials are working.
    """
    if not lightcast_available:
        return {
            "available": False,
            "message": "Lightcast integration not installed",
            "instructions": [
                "1. Add lightcast_engine.py to /src/ directory",
                "2. Set LIGHTCAST_CLIENT_ID environment variable",
                "3. Set LIGHTCAST_CLIENT_SECRET environment variable",
                "4. Restart the application"
            ]
        }
    
    try:
        from lightcast_engine import test_lightcast
        
        # Run test
        success = test_lightcast()
        
        return {
            "available": True,
            "test_result": "passed" if success else "failed",
            "message": "Lightcast is working correctly" if success else "Lightcast test failed"
        }
        
    except Exception as e:
        return {
            "available": True,
            "test_result": "failed",
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"\n🚀 Starting CUNY CareerDay API on port {port}")
    print(f"📍 Lightcast: {'✓ Enabled' if lightcast_available else '✗ Disabled'}")
    print(f"📚 Docs: http://localhost:{port}/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=port)