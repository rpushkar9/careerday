#!/usr/bin/env python3
"""
Year 1 Course Data Scraper for CUNY Schools
Scrapes actual course catalogs and bulletins from university websites
"""

# import requests
# from bs4 import BeautifulSoup
# import logging
# import re
# from typing import Dict, List, Optional
# import time

# logger = logging.getLogger(__name__)

# # CUNY School Catalog URLs
# CUNY_CATALOG_URLS = {
#     "City College of New York": {
#         "base_url": "https://www.ccny.cuny.edu",
#         "catalog_url": "https://www.ccny.cuny.edu/bulletin",
#         "course_search": "https://ssb-prod.ec.cuny.edu/PROD/bwckctlg.p_disp_listcrse?term_in=202409&subj_in={major_code}&crse_in=&schd_in="
#     },
#     "Queens College": {
#         "base_url": "https://www.qc.cuny.edu",
#         "catalog_url": "https://www.qc.cuny.edu/academics/undergraduate-bulletin/",
#         "course_search": "https://ssb-prod.ec.cuny.edu/PROD/bwckctlg.p_disp_listcrse?term_in=202409&subj_in={major_code}&crse_in=&schd_in="
#     },
#     "Baruch College": {
#         "base_url": "https://www.baruch.cuny.edu",
#         "catalog_url": "https://registrar.baruch.cuny.edu/academics/undergraduate-bulletin/",
#         "course_search": "https://ssb-prod.ec.cuny.edu/PROD/bwckctlg.p_disp_listcrse?term_in=202409&subj_in={major_code}&crse_in=&schd_in="
#     },
#     "Hunter College": {
#         "base_url": "https://hunter.cuny.edu",
#         "catalog_url": "https://hunter.cuny.edu/undergraduate-studies/academic-programs/",
#         "course_search": "https://ssb-prod.ec.cuny.edu/PROD/bwckctlg.p_disp_listcrse?term_in=202409&subj_in={major_code}&crse_in=&schd_in="
#     },
#     "Brooklyn College": {
#         "base_url": "https://www.brooklyn.cuny.edu",
#         "catalog_url": "https://www.brooklyn.cuny.edu/web/academics/undergraduate-education/bulletin.php",
#         "course_search": "https://ssb-prod.ec.cuny.edu/PROD/bwckctlg.p_disp_listcrse?term_in=202409&subj_in={major_code}&crse_in=&schd_in="
#     }
# }

# # Major code mappings
# MAJOR_CODES = {
#     "Psychology": "PSYCH",
#     "Computer Science": "CSCI",
#     "Biology": "BIOL",
#     "Business": "BUS",
#     "Mathematics": "MATH",
#     "English": "ENGL",
#     "History": "HIST",
#     "Sociology": "SOC",
#     "Political Science": "POLSC",
#     "Economics": "ECON"
# }

# class Year1CourseScraper:
#     """Scrape Year 1 course data from CUNY university websites"""
    
#     def __init__(self):
#         self.session = requests.Session()
#         self.session.headers.update({
#             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
#         })
    
#     def scrape_year1_courses(self, university: str, major: str) -> Dict:
#         """
#         Main method to scrape Year 1 courses for a given university and major
#         """
#         logger.info(f"Scraping Year 1 courses for {major} at {university}")
        
#         try:
#             # Get major code
#             major_code = self._get_major_code(major)
            
#             # Get school URLs
#             school_urls = CUNY_CATALOG_URLS.get(university)
#             if not school_urls:
#                 logger.warning(f"No catalog URL found for {university}, using fallback")
#                 return self._get_fallback_data(university, major)
            
#             # Scrape CUNY course catalog (CUNYfirst system)
#             courses = self._scrape_cunyfirst_catalog(school_urls, major_code)
            
#             if not courses:
#                 logger.warning(f"No courses found via scraping, using fallback")
#                 return self._get_fallback_data(university, major)
            
#             # Organize into Year 1 structure
#             year1_data = self._organize_year1_courses(courses, university, major)
            
#             return year1_data
            
#         except Exception as e:
#             logger.error(f"Error scraping courses: {e}")
#             return self._get_fallback_data(university, major)
    
#     def _scrape_cunyfirst_catalog(self, school_urls: Dict, major_code: str) -> List[Dict]:
#         """
#         Scrape courses from CUNY's CUNYfirst course catalog system
#         """
#         courses = []
        
#         try:
#             # Build the course search URL
#             search_url = school_urls['course_search'].format(major_code=major_code)
            
#             logger.info(f"Fetching courses from: {search_url}")
#             response = self.session.get(search_url, timeout=10)
            
#             if response.status_code != 200:
#                 logger.error(f"Failed to fetch catalog: {response.status_code}")
#                 return courses
            
#             soup = BeautifulSoup(response.content, 'html.parser')
            
#             # Find all course entries (CUNYfirst uses tables)
#             course_blocks = soup.find_all('td', class_='ntdefault')
            
#             for block in course_blocks:
#                 course_title = block.get_text(strip=True)
                
#                 # Parse course code and name
#                 match = re.match(r'([A-Z]+\s+\d+)\s*-\s*(.+)', course_title)
#                 if match:
#                     code = match.group(1)
#                     name = match.group(2)
                    
#                     # Get description from next sibling
#                     desc_block = block.find_next_sibling('td')
#                     description = desc_block.get_text(strip=True) if desc_block else "Course description"
                    
#                     # Extract credits (usually in format "3.00 Credits")
#                     credits_match = re.search(r'(\d+(?:\.\d+)?)\s+Credits', description)
#                     credits = int(float(credits_match.group(1))) if credits_match else 3
                    
#                     courses.append({
#                         "code": code,
#                         "name": name,
#                         "credits": credits,
#                         "description": description[:150] + "..." if len(description) > 150 else description
#                     })
                    
#                     # Only get intro-level courses (usually 100-200 level)
#                     if len(courses) >= 8:
#                         break
            
#             logger.info(f"Successfully scraped {len(courses)} courses")
            
#         except Exception as e:
#             logger.error(f"Error scraping CUNYfirst catalog: {e}")
        
#         return courses
    
#     def _organize_year1_courses(self, courses: List[Dict], university: str, major: str) -> Dict:
#         """
#         Organize scraped courses into Year 1 semester structure
#         """
#         # Split courses between two semesters
#         mid_point = len(courses) // 2
        
#         semester_1_courses = courses[:mid_point]
#         semester_2_courses = courses[mid_point:]
        
#         # Add general education courses if needed
#         semester_1_courses = self._add_gen_ed_courses(semester_1_courses, 1)
#         semester_2_courses = self._add_gen_ed_courses(semester_2_courses, 2)
        
#         total_credits_s1 = sum(c['credits'] for c in semester_1_courses)
#         total_credits_s2 = sum(c['credits'] for c in semester_2_courses)
        
#         return {
#             "success": True,
#             "university": university,
#             "major": major,
#             "year": "Year 1",
#             "semester_1": {
#                 "courses": semester_1_courses,
#                 "total_credits": total_credits_s1
#             },
#             "semester_2": {
#                 "courses": semester_2_courses,
#                 "total_credits": total_credits_s2
#             },
#             "total_year_credits": total_credits_s1 + total_credits_s2,
#             "notes": [
#                 "Courses scraped from official university catalog",
#                 "Consult with academic advisor for personalized course selection",
#                 "Prerequisites may apply for some courses"
#             ]
#         }
    
#     def _add_gen_ed_courses(self, courses: List[Dict], semester: int) -> List[Dict]:
#         """
#         Add general education courses to fill out the schedule
#         """
#         gen_ed_courses = {
#             1: [
#                 {"code": "ENG 110", "name": "Composition I", "credits": 3, "description": "Academic writing"},
#                 {"code": "MATH 118", "name": "Mathematics", "credits": 3, "description": "Mathematical reasoning"}
#             ],
#             2: [
#                 {"code": "ENG 120", "name": "Composition II", "credits": 3, "description": "Research writing"},
#                 {"code": "HIST 101", "name": "History", "credits": 3, "description": "Historical analysis"}
#             ]
#         }
        
#         # Add gen ed courses if we don't have enough
#         if len(courses) < 4:
#             courses.extend(gen_ed_courses.get(semester, []))
        
#         return courses[:5]  # Limit to 5 courses per semester
    
#     def _get_major_code(self, major: str) -> str:
#         """
#         Get the course code prefix for a major
#         """
#         for key, code in MAJOR_CODES.items():
#             if key.lower() in major.lower():
#                 return code
        
#         # Default fallback
#         return "PSYCH"
    
#     def _get_fallback_data(self, university: str, major: str) -> Dict:
#         """
#         Return pre-defined course data if scraping fails
#         """
#         logger.info(f"Using fallback data for {major} at {university}")
        
#         return {
#             "success": True,
#             "university": university,
#             "major": major,
#             "year": "Year 1",
#             "semester_1": {
#                 "courses": [
#                     {
#                         "code": f"{self._get_major_code(major)} 101",
#                         "name": f"Introduction to {major}",
#                         "credits": 3,
#                         "description": f"Foundational concepts in {major}"
#                     },
#                     {
#                         "code": "ENG 110",
#                         "name": "Composition I",
#                         "credits": 3,
#                         "description": "Academic writing and critical thinking"
#                     },
#                     {
#                         "code": "MATH 118",
#                         "name": "Mathematics",
#                         "credits": 3,
#                         "description": "Mathematical reasoning and problem solving"
#                     }
#                 ],
#                 "total_credits": 9
#             },
#             "semester_2": {
#                 "courses": [
#                     {
#                         "code": f"{self._get_major_code(major)} 102",
#                         "name": f"{major} Fundamentals",
#                         "credits": 3,
#                         "description": f"Core principles of {major}"
#                     },
#                     {
#                         "code": "ENG 120",
#                         "name": "Composition II",
#                         "credits": 3,
#                         "description": "Research writing and argumentation"
#                     }
#                 ],
#                 "total_credits": 6
#             },
#             "total_year_credits": 15,
#             "notes": [
#                 "Using sample course data - actual courses may vary",
#                 "Please consult your academic advisor for accurate course requirements"
#             ]
#         }


# # For testing
# if __name__ == "__main__":
#     logging.basicConfig(level=logging.INFO)
    
#     scraper = Year1CourseScraper()
    
#     # Test scraping
#     result = scraper.scrape_year1_courses("City College of New York", "Psychology")
    
#     print("\n" + "="*60)
#     print("Year 1 Courses")
#     print("="*60)
#     print(f"University: {result['university']}")
#     print(f"Major: {result['major']}")
#     print(f"\nSemester 1: {result['semester_1']['total_credits']} credits")
#     for course in result['semester_1']['courses']:
#         print(f"  - {course['code']}: {course['name']}")
#     print(f"\nSemester 2: {result['semester_2']['total_credits']} credits")
#     for course in result['semester_2']['courses']:
#         print(f"  - {course['code']}: {course['name']}")


#!/usr/bin/env python3
"""
University Resource Scraper
Fetches career services, clubs, and resources from CUNY websites
"""

import requests
from bs4 import BeautifulSoup
from typing import Dict, List
import sys

class UniversityResourceFetcher:
    """Scrapes and fetches university-specific resources"""
    
    def __init__(self):
        self.cuny_resources = {
            "Hunter College": {
                "career_services_url": "https://hunter.cuny.edu/students/career-services/",
                "cs_department_url": "https://www.hunter.cuny.edu/csci/",
                "clubs": [
                    "Computer Science Club",
                    "Women in Technology",
                    "Coding Club",
                    "ACM Chapter"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Break Through Tech",
                    "Hunter Career Services Internship Database"
                ],
                "writing_center_url": "https://hunter.cuny.edu/rwc/",
                "student_life_url": "https://hunter.cuny.edu/students/"
            },
            "City College": {
                "career_services_url": "https://www.ccny.cuny.edu/careerservices",
                "cs_department_url": "https://www.ccny.cuny.edu/cs",
                "clubs": [
                    "CS Society",
                    "IEEE Student Chapter",
                    "Google Developer Student Club"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Break Through Tech",
                    "City College Career Center"
                ],
                "writing_center_url": "https://www.ccny.cuny.edu/writing",
                "student_life_url": "https://www.ccny.cuny.edu/studentaffairs"
            },
            "Baruch College": {
                "career_services_url": "https://studentaffairs.baruch.cuny.edu/starr-career-development-center/",
                "cs_department_url": "https://www.baruch.cuny.edu/cs",
                "clubs": [
                    "Tech Club",
                    "Data Science Society",
                    "Blockchain Club"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Starr Career Development Center",
                    "Baruch Computing & Technology Center"
                ],
                "writing_center_url": "https://www.baruch.cuny.edu/writing",
                "student_life_url": "https://studentaffairs.baruch.cuny.edu/"
            },
            "Queens College": {
                "career_services_url": "https://www.qc.cuny.edu/qcce/",
                "cs_department_url": "https://www.qc.cuny.edu/cs/",
                "clubs": [
                    "Computer Science Club",
                    "Cybersecurity Club",
                    "Women in STEM"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Queens College Career Center",
                    "Break Through Tech"
                ],
                "writing_center_url": "https://www.qc.cuny.edu/writing/",
                "student_life_url": "https://www.qc.cuny.edu/studentaffairs/"
            },
            "Brooklyn College": {
                "career_services_url": "https://www.brooklyn.cuny.edu/web/about/offices/studentaffairs/student-support-services/magner.php",
                "cs_department_url": "https://www.brooklyn.cuny.edu/web/academics/schools/naturalsciences/undergraduate/computerscience.php",
                "clubs": [
                    "Computer Science Club",
                    "Women in Computing",
                    "Tech Innovation Club"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Magner Career Center",
                    "Break Through Tech"
                ],
                "writing_center_url": "https://www.brooklyn.cuny.edu/web/about/offices/undergrad/learning/writing.php",
                "student_life_url": "https://www.brooklyn.cuny.edu/web/about/offices/studentaffairs.php"
            },
            "Lehman College": {
                "career_services_url": "https://www.lehman.edu/career-services/",
                "cs_department_url": "https://www.lehman.edu/academics/mathematics-computer-science/",
                "clubs": [
                    "Computer Science Club",
                    "STEM Society"
                ],
                "internship_programs": [
                    "CUNY Tech Prep",
                    "Lehman Career Services",
                    "Break Through Tech"
                ],
                "writing_center_url": "https://www.lehman.edu/academics/writing-center/",
                "student_life_url": "https://www.lehman.edu/student-affairs/"
            }
        }
        
        # Default resources for unknown schools
        self.default_resources = {
            "career_services_url": "https://www.cuny.edu/current-students/student-affairs/",
            "cs_department_url": "",
            "clubs": [
                "Computer Science Club",
                "Tech Club"
            ],
            "internship_programs": [
                "CUNY Tech Prep",
                "Break Through Tech"
            ],
            "writing_center_url": "https://www.cuny.edu/current-students/student-affairs/",
            "student_life_url": "https://www.cuny.edu/current-students/"
        }
    
    def get_resources(self, university: str) -> Dict:
        """
        Get resources for a specific university
        
        Args:
            university: Name of the university (e.g., "Hunter College")
            
        Returns:
            Dictionary of university resources
        """
        sys.stderr.write(f"📚 Fetching resources for: {university}\n")
        
        # Try exact match first
        if university in self.cuny_resources:
            sys.stderr.write(f"✓ Found specific resources for {university}\n")
            return self.cuny_resources[university]
        
        # Try partial match (case-insensitive)
        university_lower = university.lower()
        for school_name, resources in self.cuny_resources.items():
            if school_name.lower() in university_lower or university_lower in school_name.lower():
                sys.stderr.write(f"✓ Found resources for {school_name} (matched {university})\n")
                return resources
        
        # Return default if no match
        sys.stderr.write(f"⚠️  Using default CUNY resources for {university}\n")
        return self.default_resources
    
    def scrape_live_resources(self, university: str, url: str) -> Dict:
        """
        Scrape live resources from university website (future enhancement)
        
        Args:
            university: Name of the university
            url: Base URL of the university
            
        Returns:
            Dictionary of scraped resources
        """
        # TODO: Implement live scraping
        # For now, return cached data
        return self.get_resources(university)


# Standalone test
if __name__ == "__main__":
    fetcher = UniversityResourceFetcher()
    
    print("\n" + "="*60)
    print("Testing University Resource Fetcher")
    print("="*60 + "\n")
    
    # Test different universities
    test_schools = [
        "Hunter College",
        "City College",
        "Brooklyn College",
        "Unknown College"
    ]
    
    for school in test_schools:
        print(f"\n🏫 {school}")
        print("-" * 60)
        resources = fetcher.get_resources(school)
        print(f"Career Services: {resources['career_services_url']}")
        print(f"Clubs: {', '.join(resources['clubs'][:3])}")
        print(f"Internships: {', '.join(resources['internship_programs'][:2])}")