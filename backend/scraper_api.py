# backend/scraper_api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Course(BaseModel):
    code: str
    name: str
    credits: int
    description: Optional[str] = ""

class SemesterData(BaseModel):
    totalCredits: int
    tuition: float
    courses: List[Course]
    opportunities: List[str]
    volunteerWork: List[str]
    internships: List[str]
    projects: List[str]

class Year1Data(BaseModel):
    major: str
    university: str
    year: int
    totalYearCost: float
    totalYearCredits: int
    scraped: bool
    fall: SemesterData
    spring: SemesterData

class ScrapeRequest(BaseModel):
    university: str
    major: str
    career_goal: str
    student_name: str

# College-specific scrapers
def scrape_queens_college(major: str):
    """Scrapes Queens College course catalog"""
    try:
        # Example: Scrape Queens College CS courses
        url = f"https://www.qc.cuny.edu/academics/degrees-and-programs/"
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        courses = []
        # Parse course listings (customize based on actual HTML structure)
        course_elements = soup.find_all('div', class_='course')
        
        for elem in course_elements[:8]:  # Get first 8 courses for year 1
            code = elem.find('span', class_='code').text.strip() if elem.find('span', class_='code') else "CSCI 101"
            name = elem.find('span', class_='name').text.strip() if elem.find('span', class_='name') else "Introduction to Computer Science"
            credits = 3
            description = elem.find('p', class_='desc').text.strip() if elem.find('p', class_='desc') else ""
            
            courses.append(Course(code=code, name=name, credits=credits, description=description))
        
        return courses if courses else None
    except Exception as e:
        print(f"Error scraping Queens College: {e}")
        return None

def scrape_hunter_college(major: str):
    """Scrapes Hunter College course catalog"""
    try:
        url = f"https://hunter.cuny.edu/academics/programs/"
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        courses = []
        # Custom parsing logic for Hunter
        return courses if courses else None
    except Exception as e:
        print(f"Error scraping Hunter College: {e}")
        return None

def scrape_nyu(major: str):
    """Scrapes NYU course catalog"""
    try:
        url = f"https://www.nyu.edu/academics/programs.html"
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        courses = []
        # Custom parsing logic for NYU
        return courses if courses else None
    except Exception as e:
        print(f"Error scraping NYU: {e}")
        return None

def generic_scraper(university: str, major: str):
    """Generic fallback scraper for any college"""
    try:
        # Try common URL patterns
        search_urls = [
            f"https://{university.lower().replace(' ', '')}.edu/academics",
            f"https://{university.lower().replace(' ', '')}.edu/catalog",
            f"https://{university.lower().replace(' ', '')}.edu/courses",
        ]
        
        for url in search_urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    # Generic course extraction logic
                    course_elements = soup.find_all(['div', 'li'], class_=re.compile('course'))
                    
                    courses = []
                    for elem in course_elements[:8]:
                        text = elem.get_text()
                        # Extract course code pattern (e.g., CS 101, CSCI-101, etc.)
                        code_match = re.search(r'[A-Z]{2,4}[\s-]?\d{3,4}', text)
                        if code_match:
                            courses.append(Course(
                                code=code_match.group(),
                                name=text[:50],
                                credits=3,
                                description=text[:200]
                            ))
                    
                    if courses:
                        return courses
            except:
                continue
        
        return None
    except Exception as e:
        print(f"Error in generic scraper: {e}")
        return None

def get_default_courses(major: str):
    """Returns default courses based on major when scraping fails"""
    defaults = {
        "Computer Science": [
            Course(code="CS 101", name="Introduction to Computer Science", credits=3, description="Fundamentals of programming and problem-solving"),
            Course(code="CS 102", name="Data Structures", credits=3, description="Arrays, linked lists, trees, and algorithms"),
            Course(code="MATH 141", name="Calculus I", credits=4, description="Limits, derivatives, and integrals"),
            Course(code="MATH 142", name="Calculus II", credits=4, description="Integration techniques and series"),
            Course(code="ENG 101", name="College Writing I", credits=3, description="Academic writing and composition"),
            Course(code="ENG 102", name="College Writing II", credits=3, description="Research and argumentation"),
            Course(code="PHYS 101", name="Physics I", credits=4, description="Mechanics and thermodynamics"),
            Course(code="CS 201", name="Computer Organization", credits=3, description="Hardware and low-level programming"),
        ],
        "Business Administration": [
            Course(code="BUS 101", name="Introduction to Business", credits=3),
            Course(code="ACCT 101", name="Financial Accounting", credits=3),
            Course(code="ECON 101", name="Microeconomics", credits=3),
            Course(code="ECON 102", name="Macroeconomics", credits=3),
            Course(code="MATH 115", name="Business Calculus", credits=3),
            Course(code="ENG 101", name="College Writing I", credits=3),
            Course(code="BUS 201", name="Business Statistics", credits=3),
            Course(code="MGMT 101", name="Principles of Management", credits=3),
        ],
        "Psychology": [
            Course(code="PSY 101", name="Introduction to Psychology", credits=3),
            Course(code="PSY 201", name="Research Methods", credits=3),
            Course(code="PSY 202", name="Statistics for Psychology", credits=3),
            Course(code="BIO 101", name="General Biology", credits=4),
            Course(code="ENG 101", name="College Writing I", credits=3),
            Course(code="ENG 102", name="College Writing II", credits=3),
            Course(code="PSY 210", name="Developmental Psychology", credits=3),
            Course(code="SOC 101", name="Introduction to Sociology", credits=3),
        ],
    }
    
    return defaults.get(major, defaults["Computer Science"])

def generate_opportunities(major: str, career: str):
    """Generates career-aligned opportunities"""
    opportunities_map = {
        "Computer Science": [
            "Hackathons and coding competitions",
            "Open source contributions",
            "CS club membership",
            "Tech meetups and workshops"
        ],
        "Business": [
            "Business club membership",
            "Case competitions",
            "Networking events",
            "Entrepreneurship workshops"
        ],
    }
    return opportunities_map.get(major, ["Study groups", "Academic workshops", "Campus clubs"])

def generate_internships(major: str, career: str):
    """Generates internship opportunities"""
    return [
        f"Summer internship in {career}",
        f"Part-time position related to {major}",
        "On-campus research assistant",
        "Industry mentorship programs"
    ]

def generate_volunteer_work(major: str):
    """Generates volunteer opportunities"""
    return [
        "Tutoring underclassmen",
        "Community service projects",
        "Campus outreach programs",
        "Peer mentoring"
    ]

def generate_projects(major: str, career: str):
    """Generates project ideas"""
    projects_map = {
        "Computer Science": [
            "Build a personal website/portfolio",
            "Create a mobile app",
            "Contribute to open-source projects",
            "Develop a game or simulation"
        ],
        "Business": [
            "Analyze a business case study",
            "Create a business plan",
            "Conduct market research project",
            "Design a marketing campaign"
        ],
    }
    return projects_map.get(major, ["Complete a major-related project", "Research paper on current trends"])

def estimate_tuition(university: str):
    """Estimates tuition based on university (placeholder logic)"""
    tuition_estimates = {
        "CUNY": 3465,  # Per semester for NY residents
        "SUNY": 3535,
        "NYU": 29910,
        "Columbia": 33528,
    }
    
    for key, value in tuition_estimates.items():
        if key.lower() in university.lower():
            return value
    
    return 5000  # Default estimate

@app.post("/api/scrape-year1-data")
async def scrape_year1_data(request: ScrapeRequest):
    """
    Main endpoint that scrapes college data and returns Year 1 plan
    """
    try:
        university = request.university
        major = request.major
        career = request.career_goal
        
        # Try college-specific scrapers first
        courses = None
        scraped = False
        
        if "queens" in university.lower():
            courses = scrape_queens_college(major)
        elif "hunter" in university.lower():
            courses = scrape_hunter_college(major)
        elif "nyu" in university.lower():
            courses = scrape_nyu(major)
        else:
            courses = generic_scraper(university, major)
        
        # Fall back to defaults if scraping failed
        if not courses:
            courses = get_default_courses(major)
            scraped = False
        else:
            scraped = True
        
        # Split courses into Fall and Spring
        fall_courses = courses[:4]
        spring_courses = courses[4:8]
        
        # Calculate totals
        fall_credits = sum(c.credits for c in fall_courses)
        spring_credits = sum(c.credits for c in spring_courses)
        
        tuition_per_semester = estimate_tuition(university)
        
        # Build response
        year1_data = Year1Data(
            major=major,
            university=university,
            year=1,
            totalYearCost=tuition_per_semester * 2,
            totalYearCredits=fall_credits + spring_credits,
            scraped=scraped,
            fall=SemesterData(
                totalCredits=fall_credits,
                tuition=tuition_per_semester,
                courses=fall_courses,
                opportunities=generate_opportunities(major, career),
                volunteerWork=generate_volunteer_work(major),
                internships=generate_internships(major, career),
                projects=generate_projects(major, career)
            ),
            spring=SemesterData(
                totalCredits=spring_credits,
                tuition=tuition_per_semester,
                courses=spring_courses,
                opportunities=generate_opportunities(major, career),
                volunteerWork=generate_volunteer_work(major),
                internships=generate_internships(major, career),
                projects=generate_projects(major, career)
            )
        )
        
        return year1_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)