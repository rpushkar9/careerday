# #!/usr/bin/env python3
# from dotenv import load_dotenv
# load_dotenv()
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional
# import os
# import sys
# from pathlib import Path

# # Add src directory to Python path
# script_dir = Path(__file__).parent.absolute()
# src_dir = script_dir / "src"
# sys.path.insert(0, str(src_dir))

# try:
#     from api_wrapper import CareerAPIWrapper
#     wrapper = CareerAPIWrapper()
#     sys.stderr.write("✓ CareerAPIWrapper initialized successfully\n")
# except Exception as e:
#     sys.stderr.write(f"✗ Failed to initialize CareerAPIWrapper: {e}\n")
#     wrapper = None

# # Try to load roadmap generator
# try:
#     from roadmap_generator import (
#         RoadmapGenerator, 
#         StudentProfile as RoadmapStudentProfile,
#         CareerGoal,
#         UniversityResources
#     )
#     from university_scraper import UniversityResourceFetcher
#     sys.stderr.write("✓ Roadmap generator initialized successfully\n")
#     roadmap_available = True
# except Exception as e:
#     sys.stderr.write(f"⚠️  Roadmap generator not available: {e}\n")
#     roadmap_available = False

# # Try to load auth routes
# try:
#     from routes.auth import router as auth_router
#     sys.stderr.write("✓ Auth routes loaded successfully\n")
#     auth_available = True
# except Exception as e:
#     sys.stderr.write(f"⚠️  Auth routes not available: {e}\n")
#     auth_available = False

# app = FastAPI(
#     title="CUNY CareerDay API",
#     version="2.0.0",
#     description="Career recommendations with CareerAPIWrapper integration"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# # Register auth routes
# if auth_available:
#     app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])

# class StudentProfile(BaseModel):
#     email: str
#     school: str
#     major: str
#     cip_code: Optional[str] = ""
#     year: str
#     gender: Optional[str] = None
#     first_generation_student: Optional[bool] = None
#     passions: str
#     skills: List[str]
#     career_goals: str

# @app.get("/")
# async def root():
#     return {"message": "CUNY CareerDay API", "status": "running"}

# @app.get("/api/debug/cip/{cip_code}")
# async def debug_cip_code(cip_code: str):
#     """Debug endpoint to check what careers exist for a CIP code"""
#     if not wrapper:
#         raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")
    
#     try:
#         sys.stderr.write(f"\n=== DEBUG CIP CODE: {cip_code} ===\n")
        
#         if hasattr(wrapper, 'cip_mapper'):
#             occupations = wrapper.cip_mapper.get_related_occupations(
#                 cip_code=cip_code,
#                 max_results=50,
#                 education_filter_type="hierarchy",
#                 experience_filter_type="hierarchy"
#             )
            
#             sys.stderr.write(f"Found {len(occupations)} occupations for CIP {cip_code}\n")
            
#             for i, occ in enumerate(occupations[:10]):
#                 sys.stderr.write(f"  {i+1}. {occ.get('soc_title')} ({occ.get('soc_code')})\n")
            
#             return {
#                 "cip_code": cip_code,
#                 "total_occupations_found": len(occupations),
#                 "sample_occupations": [
#                     {
#                         "soc_code": occ.get('soc_code'),
#                         "title": occ.get('soc_title'),
#                         "education": occ.get('education_level', 'N/A'),
#                         "experience": occ.get('work_experience', 'N/A'),
#                         "median_wage": occ.get('median_wage', 'N/A'),
#                         "employment_2023": occ.get('employment_2023', 'N/A')
#                     }
#                     for occ in occupations[:10]
#                 ]
#             }
#         else:
#             return {"error": "CIP mapper not available"}
            
#     except Exception as e:
#         import traceback
#         sys.stderr.write(f"Error in debug endpoint: {e}\n")
#         return {"error": str(e), "traceback": traceback.format_exc()}

# @app.post("/api/student-profile")
# async def create_student_profile(profile: StudentProfile):
#     """Create student profile and generate top 3 career recommendations."""
#     if not wrapper:
#         raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")

#     try:
#         sys.stderr.write(f"\n{'='*60}\n")
#         sys.stderr.write(f"📋 Student Profile Request\n")
#         sys.stderr.write(f"{'='*60}\n")
#         sys.stderr.write(f"School: {profile.school}\n")
#         sys.stderr.write(f"Major: {profile.major}\n")
#         sys.stderr.write(f"CIP Code: {profile.cip_code}\n")
#         sys.stderr.write(f"{'='*60}\n\n")

#         if not profile.cip_code or not profile.cip_code.strip():
#             raise HTTPException(
#                 status_code=400, 
#                 detail="CIP code is required"
#             )

#         interests = [profile.passions] if profile.passions else []

#         recommendations = wrapper.get_career_recommendations(
#             major=profile.major,
#             cip_code=profile.cip_code,
#             interests=interests,
#             skills=profile.skills,
#             top_n=10
#         )

#         top_3 = recommendations[:3]

#         return {
#             "success": True,
#             "student": {
#                 "email": profile.email,
#                 "school": profile.school,
#                 "major": profile.major,
#                 "year": profile.year
#             },
#             "top_3_careers": top_3,
#             "debug": {
#                 "cip_code_used": profile.cip_code,
#                 "total_found": len(recommendations),
#                 "returned": len(top_3)
#             }
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         import traceback
#         sys.stderr.write(f"\n❌ ERROR: {e}\n")
#         sys.stderr.write(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/api/generate-roadmap")
# async def generate_roadmap(request: dict):
#     """Generate a personalized 4-year career roadmap using AI."""
    
#     if not roadmap_available:
#         raise HTTPException(
#             status_code=503, 
#             detail="Roadmap generation not available. Check server logs."
#         )
    
#     try:
#         sys.stderr.write(f"\n{'='*60}\n")
#         sys.stderr.write(f"🗺️  Roadmap Generation Request\n")
#         sys.stderr.write(f"{'='*60}\n")
#         sys.stderr.write(f"School: {request.get('school')}\n")
#         sys.stderr.write(f"Major: {request.get('major')}\n")
#         sys.stderr.write(f"Career: {request.get('career_title')}\n")
#         sys.stderr.write(f"{'='*60}\n\n")
        
#         # Create student profile
#         student = RoadmapStudentProfile(
#             name=request.get('name', 'Student'),
#             email=request.get('email'),
#             school=request.get('school'),
#             major=request.get('major'),
#             year=request.get('year'),
#             skills=request.get('skills', []),
#             interests=request.get('interests', ''),
#             career_goals=request.get('career_goals', '')
#         )
        
#         # Create career goal
#         career = CareerGoal(
#             title=request.get('career_title'),
#             soc_code=request.get('soc_code', ''),
#             description=request.get('career_description', ''),
#             salary=request.get('salary', 'N/A'),
#             growth=request.get('growth', 'N/A')
#         )
        
#         # Get university resources
#         sys.stderr.write(f"📚 Fetching resources for {student.school}...\n")
#         resource_fetcher = UniversityResourceFetcher()
#         resources_dict = resource_fetcher.get_resources(student.school)
        
#         # Convert to UniversityResources dataclass
#         university_resources = UniversityResources(
#             career_services_url=resources_dict.get('career_services_url', ''),
#             cs_department_url=resources_dict.get('cs_department_url', ''),
#             clubs=resources_dict.get('clubs', []),
#             internship_programs=resources_dict.get('internship_programs', []),
#             writing_center_url=resources_dict.get('writing_center_url', ''),
#             student_life_url=resources_dict.get('student_life_url', '')
#         )
        
#         # Generate roadmap
#         sys.stderr.write(f"🤖 Generating AI roadmap...\n")
#         generator = RoadmapGenerator()
#         roadmap = generator.generate_roadmap(student, career, university_resources)
        
#         sys.stderr.write(f"✓ Roadmap generated successfully!\n\n")
        
#         return {
#             "success": True,
#             "roadmap": roadmap,
#             "student": {
#                 "name": student.name,
#                 "school": student.school,
#                 "major": student.major,
#                 "year": student.year
#             },
#             "career": {
#                 "title": career.title,
#                 "salary": career.salary,
#                 "growth": career.growth
#             }
#         }
        
#     except Exception as e:
#         import traceback
#         sys.stderr.write(f"\n❌ ERROR in generate_roadmap\n")
#         sys.stderr.write(f"Error: {e}\n")
#         sys.stderr.write(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/api/scrape-year1-data")
# async def scrape_year1_data(request: dict):
#     """
#     Forward Year 1 scraping request to the scraper service on port 8001
#     """
#     try:
#         sys.stderr.write(f"\n{'='*60}\n")
#         sys.stderr.write(f"📚 Year 1 Data Request (forwarding to scraper)\n")
#         sys.stderr.write(f"{'='*60}\n")
#         sys.stderr.write(f"University: {request.get('university')}\n")
#         sys.stderr.write(f"Major: {request.get('major')}\n")
#         sys.stderr.write(f"{'='*60}\n\n")
        
#         # Forward to scraper service on port 8001
#         import requests
#         response = requests.post(
#             'http://localhost:8001/api/scrape-year1-data',
#             json=request,
#             timeout=30
#         )
        
#         if not response.ok:
#             raise HTTPException(status_code=response.status_code, detail=response.text)
        
#         year1_data = response.json()
#         sys.stderr.write(f"✓ Year 1 data received from scraper\n\n")
        
#         return year1_data
        
#     except requests.exceptions.ConnectionError:
#         sys.stderr.write(f"❌ Could not connect to scraper service on port 8001\n")
#         raise HTTPException(
#             status_code=503, 
#             detail="Scraper service not available. Please start: python scraper_api.py"
#         )
#     except Exception as e:
#         import traceback
#         sys.stderr.write(f"\n❌ ERROR: {e}\n")
#         sys.stderr.write(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.environ.get("PORT", 5001))
#     sys.stderr.write(f"\n🚀 Starting server on port {port}...\n\n")
#     uvicorn.run(app, host="0.0.0.0", port=port)


#!/usr/bin/env python3
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor

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

# Try to load roadmap generator
try:
    from roadmap_generator import (
        RoadmapGenerator, 
        StudentProfile as RoadmapStudentProfile,
        CareerGoal,
        UniversityResources
    )
    from university_scraper import UniversityResourceFetcher
    sys.stderr.write("✓ Roadmap generator initialized successfully\n")
    roadmap_available = True
except Exception as e:
    sys.stderr.write(f"⚠️  Roadmap generator not available: {e}\n")
    roadmap_available = False

# Try to load auth routes
try:
    from routes.auth import router as auth_router
    sys.stderr.write("✓ Auth routes loaded successfully\n")
    auth_available = True
except Exception as e:
    sys.stderr.write(f"⚠️  Auth routes not available: {e}\n")
    auth_available = False

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

# Register auth routes
if auth_available:
    app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])

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
        
        if hasattr(wrapper, 'cip_mapper'):
            occupations = wrapper.cip_mapper.get_related_occupations(
                cip_code=cip_code,
                max_results=50,
                education_filter_type="hierarchy",
                experience_filter_type="hierarchy"
            )
            
            sys.stderr.write(f"Found {len(occupations)} occupations for CIP {cip_code}\n")
            
            for i, occ in enumerate(occupations[:10]):
                sys.stderr.write(f"  {i+1}. {occ.get('soc_title')} ({occ.get('soc_code')})\n")
            
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
        return {"error": str(e), "traceback": traceback.format_exc()}

@app.post("/api/student-profile")
async def create_student_profile(profile: StudentProfile):
    """Create student profile and generate top 3 career recommendations."""
    if not wrapper:
        raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")

    try:
        sys.stderr.write(f"\n{'='*60}\n")
        sys.stderr.write(f"📋 Student Profile Request\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"School: {profile.school}\n")
        sys.stderr.write(f"Major: {profile.major}\n")
        sys.stderr.write(f"CIP Code: {profile.cip_code}\n")
        sys.stderr.write(f"{'='*60}\n\n")

        if not profile.cip_code or not profile.cip_code.strip():
            raise HTTPException(
                status_code=400, 
                detail="CIP code is required"
            )

        interests = [profile.passions] if profile.passions else []

        recommendations = wrapper.get_career_recommendations(
            major=profile.major,
            cip_code=profile.cip_code,
            interests=interests,
            skills=profile.skills,
            top_n=10
        )

        top_3 = recommendations[:3]

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
        sys.stderr.write(f"\n❌ ERROR: {e}\n")
        sys.stderr.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-roadmap")
async def generate_roadmap(request: dict):
    """Generate a personalized 4-year career roadmap using AI."""
    
    if not roadmap_available:
        raise HTTPException(
            status_code=503, 
            detail="Roadmap generation not available. Check server logs."
        )
    
    try:
        sys.stderr.write(f"\n{'='*60}\n")
        sys.stderr.write(f"🗺️  Roadmap Generation Request\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"School: {request.get('school')}\n")
        sys.stderr.write(f"Major: {request.get('major')}\n")
        sys.stderr.write(f"Career: {request.get('career_title')}\n")
        sys.stderr.write(f"{'='*60}\n\n")
        
        # Create student profile
        student = RoadmapStudentProfile(
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
        
        # Convert to UniversityResources dataclass
        university_resources = UniversityResources(
            career_services_url=resources_dict.get('career_services_url', ''),
            cs_department_url=resources_dict.get('cs_department_url', ''),
            clubs=resources_dict.get('clubs', []),
            internship_programs=resources_dict.get('internship_programs', []),
            writing_center_url=resources_dict.get('writing_center_url', ''),
            student_life_url=resources_dict.get('student_life_url', '')
        )
        
        # Generate roadmap
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
        sys.stderr.write(f"Error: {e}\n")
        sys.stderr.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ==================== NEW: PARALLEL SCRAPER + AI ====================
@app.post("/api/scrape-year1-data")
async def scrape_year1_data(request: dict):
    """
    Scrape Year 1 course data and generate AI roadmap insights simultaneously
    """
    try:
        sys.stderr.write(f"\n{'='*60}\n")
        sys.stderr.write(f"📚 Year 1 Data Request (Parallel AI + Scraping)\n")
        sys.stderr.write(f"{'='*60}\n")
        sys.stderr.write(f"University: {request.get('university')}\n")
        sys.stderr.write(f"Major: {request.get('major')}\n")
        sys.stderr.write(f"{'='*60}\n\n")
        
        # Create thread pool for blocking I/O operations
        executor = ThreadPoolExecutor(max_workers=2)
        loop = asyncio.get_event_loop()
        
        # Task 1: Web Scraping
        def scrape_courses():
            sys.stderr.write("🔍 [SCRAPER] Starting web scraping...\n")
            from year1_scraper import Year1CourseScraper
            
            scraper = Year1CourseScraper()
            result = scraper.scrape_year1_courses(
                university=request.get('university'),
                major=request.get('major')
            )
            sys.stderr.write("✓ [SCRAPER] Web scraping complete\n")
            return result
        
        # Task 2: AI Roadmap Generation for Year 1
        def generate_ai_insights():
            sys.stderr.write("🤖 [AI] Starting roadmap generation...\n")
            
            if not roadmap_available:
                sys.stderr.write("⚠️  [AI] Roadmap generator not available\n")
                return {
                    "ai_available": False,
                    "message": "AI roadmap generation not configured"
                }
            
            try:
                from roadmap_generator import RoadmapGenerator
                from university_scraper import UniversityResourceFetcher
                
                # Create student profile for Year 1
                student = RoadmapStudentProfile(
                    name=request.get('name', 'Student'),
                    email=request.get('email', 'student@cuny.edu'),
                    school=request.get('university'),
                    major=request.get('major'),
                    year='Freshman',  # Year 1
                    skills=request.get('skills', []),
                    interests=request.get('interests', ''),
                    career_goals=request.get('career_goals', '')
                )
                
                # Create career goal (if provided)
                career = CareerGoal(
                    title=request.get('career_title', 'Exploring Options'),
                    soc_code=request.get('soc_code', ''),
                    description=request.get('career_description', ''),
                    salary=request.get('salary', 'N/A'),
                    growth=request.get('growth', 'N/A')
                )
                
                # Get university resources
                resource_fetcher = UniversityResourceFetcher()
                resources_dict = resource_fetcher.get_resources(student.school)
                
                university_resources = UniversityResources(
                    career_services_url=resources_dict.get('career_services_url', ''),
                    cs_department_url=resources_dict.get('cs_department_url', ''),
                    clubs=resources_dict.get('clubs', []),
                    internship_programs=resources_dict.get('internship_programs', []),
                    writing_center_url=resources_dict.get('writing_center_url', ''),
                    student_life_url=resources_dict.get('student_life_url', '')
                )
                
                # Generate roadmap
                generator = RoadmapGenerator()
                roadmap = generator.generate_roadmap(student, career, university_resources)
                
                sys.stderr.write("✓ [AI] Roadmap generation complete\n")
                
                # Extract Year 1 specific insights
                year1_insights = {
                    "ai_available": True,
                    "year1_recommendations": roadmap.get('year_1', {}),
                    "skills_to_develop": roadmap.get('skills_timeline', {}).get('year_1', []),
                    "suggested_activities": roadmap.get('extracurriculars', {}).get('year_1', []),
                    "full_roadmap": roadmap
                }
                
                return year1_insights
                
            except Exception as e:
                sys.stderr.write(f"⚠️  [AI] Error: {e}\n")
                return {
                    "ai_available": False,
                    "error": str(e)
                }
        
        # Run both tasks in parallel
        sys.stderr.write("⚡ Launching parallel tasks...\n\n")
        
        scraping_future = loop.run_in_executor(executor, scrape_courses)
        ai_future = loop.run_in_executor(executor, generate_ai_insights)
        
        # Wait for both to complete
        scraped_data, ai_insights = await asyncio.gather(
            scraping_future,
            ai_future,
            return_exceptions=True
        )
        
        # Handle errors gracefully
        if isinstance(scraped_data, Exception):
            sys.stderr.write(f"❌ [SCRAPER] Error: {scraped_data}\n")
            scraped_data = {
                "success": False,
                "error": str(scraped_data),
                "courses": []
            }
        
        if isinstance(ai_insights, Exception):
            sys.stderr.write(f"❌ [AI] Error: {ai_insights}\n")
            ai_insights = {
                "ai_available": False,
                "error": str(ai_insights)
            }
        
        sys.stderr.write(f"\n✓ All processing complete!\n")
        sys.stderr.write(f"  • Courses scraped: {len(scraped_data.get('courses', []))}\n")
        sys.stderr.write(f"  • AI insights: {'Yes' if ai_insights.get('ai_available') else 'No'}\n\n")
        
        # Combine results
        return {
            "success": True,
            "university": request.get('university'),
            "major": request.get('major'),
            "year": "Year 1",
            
            # Scraped course data
            "courses": scraped_data.get('courses', []),
            "prerequisites": scraped_data.get('prerequisites', {}),
            "course_descriptions": scraped_data.get('descriptions', {}),
            
            # AI-generated insights
            "ai_insights": ai_insights,
            
            # Combined recommendations
            "year1_plan": {
                "required_courses": scraped_data.get('courses', []),
                "ai_recommendations": ai_insights.get('year1_recommendations', {}),
                "skills_focus": ai_insights.get('skills_to_develop', []),
                "activities": ai_insights.get('suggested_activities', [])
            },
            
            "metadata": {
                "scraped_at": scraped_data.get('scraped_at'),
                "processing_method": "parallel",
                "services_used": ["web_scraper", "ai_roadmap"]
            }
        }
        
    except Exception as e:
        import traceback
        sys.stderr.write(f"\n❌ CRITICAL ERROR: {e}\n")
        sys.stderr.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
# ====================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    sys.stderr.write(f"\n🚀 Starting server on port {port}...\n\n")
    uvicorn.run(app, host="0.0.0.0", port=port)