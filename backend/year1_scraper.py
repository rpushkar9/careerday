# backend/year1_scraper.py
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

class Year1CourseScraper:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {"User-Agent": "Mozilla/5.0"}

    def scrape_year1_courses(self, university: str, major: str):
        university = university.lower().strip()
        major = major.lower().strip()

        if "queens" in university:
            return self.scrape_queens_college(major)
        elif "hunter" in university:
            return self.scrape_hunter_college(major)
        elif "nyu" in university:
            return self.scrape_nyu(major)
        else:
            return self.generic_scraper(university, major)

    # ------------------- Queens College -------------------
    def scrape_queens_college(self, major: str):
        url = "https://www.qc.cuny.edu/academics/degrees-and-programs/undergraduate-programs/"
        res = self.session.get(url, headers=self.headers, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        # Find major link
        major_link = None
        for link in soup.find_all("a", href=True):
            if major in link.text.lower():
                major_link = link["href"]
                break

        if not major_link:
            raise Exception("Major not found on Queens College page")

        # Go to department page
        if not major_link.startswith("http"):
            major_link = f"https://www.qc.cuny.edu{major_link}"
        res = self.session.get(major_link, headers=self.headers)
        soup = BeautifulSoup(res.text, "html.parser")

        # Try to find course list
        course_blocks = soup.find_all(["p", "div", "li"], string=re.compile(r"[A-Z]{2,4}\s?\d{3}"))
        courses = []

        for block in course_blocks[:8]:
            text = block.get_text(" ", strip=True)
            code_match = re.search(r"[A-Z]{2,4}\s?\d{3}", text)
            if code_match:
                code = code_match.group()
                name = text.replace(code, "").strip().split(".")[0]
                courses.append({
                    "code": code,
                    "name": name,
                    "credits": 3,
                    "description": text
                })

        return {
            "success": True,
            "university": "Queens College",
            "major": major,
            "courses": courses,
            "scraped_at": datetime.now().isoformat()
        }

    # ------------------- Hunter College -------------------
    def scrape_hunter_college(self, major: str):
        url = "https://hunter-undergraduate.catalog.cuny.edu/departments"
        res = self.session.get(url, headers=self.headers, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        # Find department link
        major_link = None
        for link in soup.find_all("a", href=True):
            if major in link.text.lower():
                major_link = "https://hunter-undergraduate.catalog.cuny.edu" + link["href"]
                break

        if not major_link:
            raise Exception("Major not found in Hunter catalog")

        res = self.session.get(major_link, headers=self.headers)
        soup = BeautifulSoup(res.text, "html.parser")

        courses = []
        for course in soup.find_all("div", class_="courseblock"):
            title = course.find("p", class_="courseblocktitle").get_text(" ", strip=True)
            desc = course.find("p", class_="courseblockdesc").get_text(" ", strip=True)
            code_match = re.search(r"[A-Z]{2,4}\s?\d{3}", title)
            code = code_match.group() if code_match else "UNKNOWN"
            name = title.replace(code, "").strip(" -")

            courses.append({
                "code": code,
                "name": name,
                "credits": 3,
                "description": desc
            })

        return {
            "success": True,
            "university": "Hunter College",
            "major": major,
            "courses": courses[:8],
            "scraped_at": datetime.now().isoformat()
        }

    # ------------------- NYU -------------------
    def scrape_nyu(self, major: str):
        url = "https://bulletins.nyu.edu/undergraduate/cas/programs/"
        res = self.session.get(url, headers=self.headers, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        major_link = None
        for link in soup.find_all("a", href=True):
            if major in link.text.lower():
                major_link = "https://bulletins.nyu.edu" + link["href"]
                break

        if not major_link:
            raise Exception("Major not found in NYU catalog")

        res = self.session.get(major_link, headers=self.headers)
        soup = BeautifulSoup(res.text, "html.parser")

        courses = []
        for course in soup.find_all("div", class_="courseblock"):
            title = course.find("p", class_="courseblocktitle").get_text(" ", strip=True)
            desc = course.find("p", class_="courseblockdesc").get_text(" ", strip=True)
            code_match = re.search(r"[A-Z]{2,4}\s?\d{3}", title)
            code = code_match.group() if code_match else "UNKNOWN"
            name = title.replace(code, "").strip(" -")

            courses.append({
                "code": code,
                "name": name,
                "credits": 3,
                "description": desc
            })

        return {
            "success": True,
            "university": "NYU",
            "major": major,
            "courses": courses[:8],
            "scraped_at": datetime.now().isoformat()
        }

    # ------------------- Generic fallback -------------------
    def generic_scraper(self, university: str, major: str):
        urls = [
            f"https://{university}.edu/academics/{major.replace(' ', '-')}",
            f"https://{university}.edu/programs/{major.replace(' ', '-')}",
            f"https://{university}.edu/catalog/{major.replace(' ', '-')}"
        ]

        for url in urls:
            try:
                res = self.session.get(url, headers=self.headers, timeout=10)
                if res.status_code == 200:
                    soup = BeautifulSoup(res.text, "html.parser")
                    courses = []
                    for line in soup.get_text().split("\n"):
                        code_match = re.search(r"[A-Z]{2,4}\s?\d{3}", line)
                        if code_match:
                            code = code_match.group()
                            courses.append({
                                "code": code,
                                "name": line.strip()[:50],
                                "credits": 3,
                                "description": line.strip()
                            })
                    if courses:
                        return {
                            "success": True,
                            "university": university,
                            "major": major,
                            "courses": courses[:8],
                            "scraped_at": datetime.now().isoformat()
                        }
            except Exception as e:
                continue

        return {
            "success": False,
            "university": university,
            "major": major,
            "courses": [],
            "scraped_at": datetime.now().isoformat(),
            "error": "No data found"
        }
