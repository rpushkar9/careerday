#!/usr/bin/env python3
"""
CUNY University Resource Scraper
Collects university-specific resources for roadmap generation
"""

import requests
from bs4 import BeautifulSoup
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

# Pre-defined CUNY resources (since scraping can be unreliable)
CUNY_RESOURCES = {
    "Baruch College": {
        "career_services_url": "https://studentaffairs.baruch.cuny.edu/starr-career-development-center/",
        "cs_department_url": "https://www.baruch.cuny.edu/academics/computer-information-systems",
        "clubs": [
            "Baruch Computing and Technology Society",
            "Women in Technology",
            "Cybersecurity Club"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Starr Career Development Center"
        ],
        "writing_center_url": "https://studentaffairs.baruch.cuny.edu/writing-center/",
        "student_life_url": "https://studentaffairs.baruch.cuny.edu/"
    },
    "Brooklyn College": {
        "career_services_url": "https://www.brooklyn.edu/student-services/career-center/",
        "cs_department_url": "https://www.brooklyn.cuny.edu/web/academics/schools/naturalsciences/departments/cis.php",
        "clubs": [
            "Brooklyn College Tech Club",
            "Association for Computing Machinery (ACM)",
            "Women in Computer Science"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Magner Career Center"
        ],
        "writing_center_url": "https://www.brooklyn.edu/student-services/writing-center/",
        "student_life_url": "https://www.brooklyn.edu/student-services/"
    },
    "City College of New York": {
        "career_services_url": "https://www.ccny.cuny.edu/career",
        "cs_department_url": "https://www.ccny.cuny.edu/cs",
        "clubs": [
            "CCNY Computer Science Society",
            "IEEE Student Branch",
            "Women in STEM"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Grove School Career Services"
        ],
        "writing_center_url": "https://www.ccny.cuny.edu/writing",
        "student_life_url": "https://www.ccny.cuny.edu/student-life"
    },
    "Hunter College": {
        "career_services_url": "https://hunter.cuny.edu/students/career-services/",
        "cs_department_url": "https://hunter.cuny.edu/cs/",
        "clubs": [
            "Hunter Computer Science Club",
            "Women in Technology",
            "ACM Student Chapter"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Hunter Career Services"
        ],
        "writing_center_url": "https://hunter.cuny.edu/rwc/",
        "student_life_url": "https://hunter.cuny.edu/students/student-life/"
    },
    "Queens College": {
        "career_services_url": "https://www.qc.cuny.edu/career-services/",
        "cs_department_url": "https://www.qc.cuny.edu/academics/degrees-programs/computer-science",
        "clubs": [
            "Queens College Computer Science Club",
            "Women in Technology",
            "Hack Queens",
            "ACM Student Chapter"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Queens College Career Services"
        ],
        "writing_center_url": "https://www.qc.cuny.edu/writing-center/",
        "student_life_url": "https://www.qc.cuny.edu/student-life/"
    },
    "John Jay College": {
        "career_services_url": "https://www.jjay.cuny.edu/career-development",
        "cs_department_url": "https://www.jjay.cuny.edu/mathematics-computer-science-information-systems",
        "clubs": [
            "John Jay Computer Science Society",
            "Cybersecurity Club",
            "Women in Tech"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Career & Professional Development Institute"
        ],
        "writing_center_url": "https://www.jjay.cuny.edu/writing-center",
        "student_life_url": "https://www.jjay.cuny.edu/student-life"
    },
    "Lehman College": {
        "career_services_url": "https://www.lehman.edu/career-services/",
        "cs_department_url": "https://www.lehman.edu/academics/mathematics-computer-science/",
        "clubs": [
            "Lehman Computer Science Club",
            "ACM Student Chapter"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "Lehman Career Services"
        ],
        "writing_center_url": "https://www.lehman.edu/academics/writing-center/",
        "student_life_url": "https://www.lehman.edu/student-life/"
    },
    "York College": {
        "career_services_url": "https://www.york.cuny.edu/career-services",
        "cs_department_url": "https://www.york.cuny.edu/computer-science",
        "clubs": [
            "York CS Club",
            "Women in STEM"
        ],
        "internship_programs": [
            "CUNY Internship Program",
            "York Career Services"
        ],
        "writing_center_url": "https://www.york.cuny.edu/writing-center",
        "student_life_url": "https://www.york.cuny.edu/student-life"
    }
}

class UniversityResourceFetcher:
    """Fetch university-specific resources for roadmap generation"""
    
    def __init__(self):
        self.resources = CUNY_RESOURCES
    
    def get_resources(self, school_name: str) -> Dict:
        """Get resources for a specific CUNY school"""
        
        # Normalize school name
        normalized_name = self._normalize_school_name(school_name)
        
        # Return pre-defined resources
        if normalized_name in self.resources:
            return self.resources[normalized_name]
        
        # Fallback to generic CUNY resources
        logger.warning(f"No specific resources found for {school_name}, using generic CUNY resources")
        return self._get_generic_cuny_resources(school_name)
    
    def _normalize_school_name(self, school_name: str) -> str:
        """Normalize school name to match our resource keys"""
        # Handle common variations
        name_mapping = {
            "baruch": "Baruch College",
            "brooklyn": "Brooklyn College",
            "city college": "City College of New York",
            "ccny": "City College of New York",
            "hunter": "Hunter College",
            "queens": "Queens College",
            "john jay": "John Jay College",
            "lehman": "Lehman College",
            "york": "York College"
        }
        
        school_lower = school_name.lower()
        for key, value in name_mapping.items():
            if key in school_lower:
                return value
        
        return school_name
    
    def _get_generic_cuny_resources(self, school_name: str) -> Dict:
        """Return generic CUNY resources as fallback"""
        return {
            "career_services_url": "https://www.cuny.edu/current-students/student-resources/",
            "cs_department_url": f"Search for Computer Science at {school_name}",
            "clubs": [
                "Computer Science Club",
                "ACM Student Chapter",
                "Women in Technology"
            ],
            "internship_programs": [
                "CUNY Internship Program"
            ],
            "writing_center_url": f"{school_name} Writing Center",
            "student_life_url": f"{school_name} Student Life"
        }
    
    def scrape_live_resources(self, school_name: str) -> Dict:
        """
        Attempt to scrape live resources from university website
        (Optional - can be implemented for real-time data)
        """
        # This would use BeautifulSoup/Selenium to scrape actual university websites
        # For now, we use pre-defined data which is more reliable
        logger.info(f"Live scraping not implemented, using pre-defined resources for {school_name}")
        return self.get_resources(school_name)


# Example usage
if __name__ == "__main__":
    fetcher = UniversityResourceFetcher()
    
    # Test with different schools
    schools = ["Queens College", "Baruch College", "Hunter College"]
    
    for school in schools:
        print(f"\n{'='*60}")
        print(f"Resources for {school}")
        print('='*60)
        resources = fetcher.get_resources(school)
        for key, value in resources.items():
            print(f"{key}: {value}")