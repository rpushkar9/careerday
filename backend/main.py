# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional
# import os
# import sys
# from pathlib import Path
# import time

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

# # ==================== CAREER CACHE ====================
# CAREER_CACHE = None
# CACHE_TIMESTAMP = None
# CACHE_DURATION = 300  # 5 minutes

# def build_career_cache():
#     """Build the career cache with all careers from multiple CIP codes"""
#     global CAREER_CACHE, CACHE_TIMESTAMP
    
#     if not wrapper:
#         return []
    
#     sys.stderr.write(f"\n{'='*60}\n")
#     sys.stderr.write(f"🔄 Building Career Cache (Comprehensive)\n")
#     sys.stderr.write(f"{'='*60}\n")
#     start_time = time.time()
    
#     # Expanded CIP codes for more career variety
#     cip_codes = [
#         ('11.0701', 'Computer Science'),
#         ('11.0201', 'Computer Programming'),
#         ('11.0401', 'Information Science'),
#         ('52.0201', 'Business Administration'),
#         ('52.0301', 'Accounting'),
#         ('52.1401', 'Marketing'),
#         ('26.0101', 'Biology'),
#         ('26.1301', 'Ecology'),
#         ('42.0101', 'Psychology'),
#         ('42.2706', 'Counseling Psychology'),
#         ('23.0101', 'English'),
#         ('09.0401', 'Journalism'),
#         ('27.0101', 'Mathematics'),
#         ('27.0303', 'Applied Mathematics'),
#         ('40.0501', 'Chemistry'),
#         ('40.0601', 'Geology'),
#         ('45.0601', 'Economics'),
#         ('45.1001', 'Political Science'),
#         ('13.0101', 'Education'),
#         ('13.1202', 'Elementary Education'),
#         ('51.1201', 'Medicine'),
#         ('51.0913', 'Athletic Training'),
#         ('14.0101', 'Engineering'),
#         ('14.0801', 'Civil Engineering'),
#         ('09.0101', 'Communication'),
#         ('09.0102', 'Mass Communication'),
#         ('54.0101', 'History'),
#         ('45.0101', 'Social Sciences'),
#         ('16.0101', 'Foreign Languages'),
#         ('16.0905', 'Spanish'),
#         ('50.0701', 'Art'),
#         ('50.0901', 'Music'),
#     ]
    
#     all_careers = []
#     seen_soc_codes = set()
    
#     # Fetch careers for each CIP code
#     for i, (cip_code, major_name) in enumerate(cip_codes, 1):
#         try:
#             sys.stderr.write(f"[{i}/{len(cip_codes)}] {major_name:30} ")
#             sys.stderr.flush()
            
#             recommendations = wrapper.get_career_recommendations(
#                 major=major_name,
#                 cip_code=cip_code,
#                 interests=[],
#                 skills=[],
#                 top_n=20  # Increased from 15 to get more careers
#             )
            
#             sys.stderr.write(f"found {len(recommendations):2} → ")
#             sys.stderr.flush()
            
#             # Add unique careers
#             added = 0
#             for career in recommendations:
#                 soc_code = career.get('soc_code')
#                 if soc_code and soc_code not in seen_soc_codes:
#                     seen_soc_codes.add(soc_code)
#                     # Initialize related_majors as a list
#                     career['related_majors'] = [major_name]
#                     all_careers.append(career)
#                     added += 1
#                 elif soc_code in seen_soc_codes:
#                     # If career already exists, add this major to its list
#                     for existing_career in all_careers:
#                         if existing_career.get('soc_code') == soc_code:
#                             if major_name not in existing_career['related_majors']:
#                                 existing_career['related_majors'].append(major_name)
#                             break
                    
#             sys.stderr.write(f"added {added:2} unique\n")
            
#         except Exception as e:
#             sys.stderr.write(f"ERROR: {str(e)[:50]}\n")
#             continue
    
#     elapsed = time.time() - start_time
#     sys.stderr.write(f"\n{'='*60}\n")
#     sys.stderr.write(f"✓ Cache Complete\n")
#     sys.stderr.write(f"  Total Unique Careers: {len(all_careers)}\n")
#     sys.stderr.write(f"  Build Time: {elapsed:.1f}s\n")
#     sys.stderr.write(f"  CIP Codes Processed: {len(cip_codes)}\n")
#     sys.stderr.write(f"{'='*60}\n\n")
    
#     # Debug: Show sample careers
#     if len(all_careers) > 0:
#         sys.stderr.write("Sample careers in cache:\n")
#         for i, career in enumerate(all_careers[:5], 1):
#             sys.stderr.write(f"  {i}. {career.get('title')} ({career.get('soc_code')})\n")
#         sys.stderr.write("\n")
    
#     CAREER_CACHE = all_careers
#     CACHE_TIMESTAMP = time.time()
#     return all_careers

# def get_cached_careers():
#     """Get careers from cache, rebuild if expired"""
#     global CAREER_CACHE, CACHE_TIMESTAMP
    
#     if CAREER_CACHE is not None:
#         if CACHE_TIMESTAMP and (time.time() - CACHE_TIMESTAMP) < CACHE_DURATION:
#             return CAREER_CACHE
    
#     return build_career_cache()

# # ======================================================

# @app.get("/")
# async def root():
#     return {"message": "CUNY CareerDay API", "status": "running"}

# @app.get("/api/cache-stats")
# async def cache_stats():
#     """Get statistics about the career cache"""
#     global CAREER_CACHE, CACHE_TIMESTAMP
    
#     if CAREER_CACHE is None:
#         return {
#             "cached": False,
#             "message": "Cache not built yet. Call /api/all-careers to build it."
#         }
    
#     # Count careers by education level
#     education_counts = {}
#     major_counts = {}
    
#     for career in CAREER_CACHE:
#         edu = career.get('education_level', 'Unknown')
#         education_counts[edu] = education_counts.get(edu, 0) + 1
        
#         for major in career.get('related_majors', []):
#             major_counts[major] = major_counts.get(major, 0) + 1
    
#     cache_age = time.time() - CACHE_TIMESTAMP if CACHE_TIMESTAMP else 0
    
#     return {
#         "cached": True,
#         "total_careers": len(CAREER_CACHE),
#         "cache_age_seconds": round(cache_age, 1),
#         "education_breakdown": education_counts,
#         "top_10_majors": dict(sorted(major_counts.items(), key=lambda x: x[1], reverse=True)[:10]),
#         "sample_careers": [
#             {
#                 "title": c.get('title'),
#                 "education": c.get('education_level'),
#                 "majors": c.get('related_majors', [])
#             }
#             for c in CAREER_CACHE[:10]
#         ]
#     }

# @app.post("/api/student-profile")
# async def create_student_profile(profile: StudentProfile):
#     """Create student profile and generate top 3 career recommendations."""
#     if not wrapper:
#         raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")

#     try:
#         if not profile.cip_code or not profile.cip_code.strip():
#             raise HTTPException(status_code=400, detail="CIP code is required")

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

# # ==================== OPTIMIZED ALL CAREERS ENDPOINT ====================
# @app.get("/api/all-careers")
# async def get_all_careers(
#     limit: Optional[int] = 50,
#     offset: Optional[int] = 0,
#     education_level: Optional[str] = None,
#     min_salary: Optional[int] = None
# ):
#     """
#     Get a comprehensive list of careers (CACHED for speed).
#     Query parameters:
#     - limit: Number of careers per page (default: 50)
#     - offset: Starting position for pagination (default: 0)
#     - education_level: Filter by education level (optional)
#     - min_salary: Minimum salary filter in thousands (optional)
#     """
#     if not wrapper:
#         raise HTTPException(status_code=500, detail="CareerAPIWrapper not initialized")
    
#     try:
#         request_start = time.time()
        
#         # Get cached careers
#         all_careers = get_cached_careers()
        
#         # Apply filters
#         filtered_careers = all_careers.copy()
        
#         # Education filter
#         if education_level and education_level != "":
#             sys.stderr.write(f"Filtering by education: {education_level}\n")
#             filtered_careers = [
#                 c for c in filtered_careers 
#                 if c.get('education_level', '').strip().lower() == education_level.strip().lower()
#             ]
        
#         # Salary filter
#         if min_salary and min_salary > 0:
#             sys.stderr.write(f"Filtering by min salary: ${min_salary}k\n")
#             filtered_careers = [
#                 c for c in filtered_careers
#                 if c.get('median_wage') and extract_salary(c.get('median_wage', '')) >= min_salary * 1000
#             ]
        
#         # Apply pagination
#         total_filtered = len(filtered_careers)
#         paginated_careers = filtered_careers[offset:offset + limit]
        
#         elapsed = time.time() - request_start
        
#         sys.stderr.write(f"✓ Returned {len(paginated_careers)} careers (offset: {offset}, total: {total_filtered}) in {elapsed:.2f}s\n")
        
#         return {
#             "success": True,
#             "total_careers": len(all_careers),
#             "filtered_count": total_filtered,
#             "returned_count": len(paginated_careers),
#             "offset": offset,
#             "limit": limit,
#             "has_more": (offset + limit) < total_filtered,
#             "careers": paginated_careers,
#             "filters_applied": {
#                 "education_level": education_level,
#                 "min_salary": min_salary
#             },
#             "cached": True,
#             "response_time_seconds": round(elapsed, 2)
#         }
        
#     except Exception as e:
#         import traceback
#         sys.stderr.write(f"\n❌ ERROR in get_all_careers: {e}\n")
#         sys.stderr.write(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=str(e))

# def extract_salary(salary_str: str) -> int:
#     """Extract numeric salary from string like '$75,000' or '$75,000 per year'"""
#     try:
#         # Remove $, commas, and everything after space
#         cleaned = salary_str.replace('$', '').replace(',', '').split()[0]
#         return int(cleaned)
#     except:
#         return 0

# @app.post("/api/clear-cache")
# async def clear_cache():
#     """Clear the career cache"""
#     global CAREER_CACHE, CACHE_TIMESTAMP
#     CAREER_CACHE = None
#     CACHE_TIMESTAMP = None
#     sys.stderr.write("🗑️  Career cache cleared\n")
#     return {"success": True, "message": "Career cache cleared"}

# # ====================================================================

# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.environ.get("PORT", 5001))
    
#     if "--port" in sys.argv:
#         idx = sys.argv.index("--port")
#         if len(sys.argv) > idx + 1:
#             try:
#                 port = int(sys.argv[idx + 1])
#             except ValueError:
#                 pass

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