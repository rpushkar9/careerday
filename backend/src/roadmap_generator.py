# #!/usr/bin/env python3
# """
# AI-Powered Career Roadmap Generator
# Generates personalized 4-year career roadmaps based on student profile and career goals
# """

# import os
# from typing import Dict, List, Optional
# from dataclasses import dataclass
# import anthropic
# # Alternative: import openai

# @dataclass
# class StudentProfile:
#     name: str
#     email: str
#     school: str
#     major: str
#     year: str
#     skills: List[str]
#     interests: str
#     career_goals: str

# @dataclass
# class CareerGoal:
#     title: str
#     soc_code: str
#     description: str
#     salary: str
#     growth: str

# @dataclass
# class UniversityResources:
#     career_services_url: str
#     cs_department_url: str
#     clubs: List[str]
#     internship_programs: List[str]
#     writing_center_url: str
#     student_life_url: str

# class RoadmapGenerator:
#     """Generate personalized 4-year career roadmaps using AI"""
    
#     def __init__(self, api_key: Optional[str] = None):
#         self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
#         if not self.api_key:
#             raise ValueError("ANTHROPIC_API_KEY not found. Set it in environment or pass to constructor.")
        
#         self.client = anthropic.Anthropic(api_key=self.api_key)
    
#     def generate_roadmap(
#         self,
#         student: StudentProfile,
#         career: CareerGoal,
#         university_resources: UniversityResources
#     ) -> str:
#         """Generate a personalized 4-year roadmap"""
        
#         prompt = self._build_prompt(student, career, university_resources)
        
#         try:
#             message = self.client.messages.create(
#                 model="claude-sonnet-4-20250514",
#                 max_tokens=4000,
#                 messages=[
#                     {"role": "user", "content": prompt}
#                 ]
#             )
            
#             roadmap = message.content[0].text
#             return roadmap
            
#         except Exception as e:
#             return f"Error generating roadmap: {str(e)}"
    
#     def _build_prompt(
#         self,
#         student: StudentProfile,
#         career: CareerGoal,
#         university_resources: UniversityResources
#     ) -> str:
#         """Build the AI prompt for roadmap generation"""
        
#         # Calculate years remaining
#         year_mapping = {
#             'Freshman': 4,
#             'Sophomore': 3,
#             'Junior': 2,
#             'Senior': 1,
#             'Recent Graduate': 0
#         }
#         years_remaining = year_mapping.get(student.year, 4)
        
#         prompt = f"""You are a career advisor creating a personalized roadmap for a CUNY student.

# **Student Profile:**
# - Name: {student.name}
# - School: {student.school}
# - Major: {student.major}
# - Current Year: {student.year} ({years_remaining} years remaining)
# - Skills: {', '.join(student.skills)}
# - Interests: {student.interests}
# - Career Goals: {student.career_goals}

# **Target Career:**
# - Title: {career.title}
# - Description: {career.description}
# - Median Salary: {career.salary}
# - Growth Rate: {career.growth}

# **{student.school} Resources:**
# - Career Services: {university_resources.career_services_url}
# - Department: {university_resources.cs_department_url}
# - Student Clubs: {', '.join(university_resources.clubs)}
# - Writing Center: {university_resources.writing_center_url}
# - Student Life: {university_resources.student_life_url}

# Create a detailed {years_remaining}-year roadmap to help this student achieve their goal of becoming a {career.title}. 

# Structure your response as follows:

# # Your Personalized Career Roadmap: {career.title}

# ## Overview
# [Brief motivational intro about their career path]

# ## Year-by-Year Plan

# ### Year 1: [Title] ({self._get_year_label(student.year, 0)})
# **Fall Semester**
# - **Focus on Coursework:** [List relevant courses for their major]
# - **Skills to Build:** [Technical and soft skills]
# - **Get Involved:** [Specific clubs at {student.school}]
# - **Action Items:** [Concrete steps they can take]

# **Spring Semester**
# - **Further Explore:** [Next steps]
# - **Practice & Learn:** [External resources, online courses]
# - **Start Building:** [Projects or portfolio items]

# [Continue for remaining years based on {years_remaining}]

# ### Year 2: [Title] ({self._get_year_label(student.year, 1)})
# [Similar structure]

# ### Year 3: [Title] ({self._get_year_label(student.year, 2)})
# [Similar structure]

# ### Year 4: [Title] ({self._get_year_label(student.year, 3)})
# [Similar structure - focus on job search and career launch]

# ## Key Resources & Tools
# - **Coding Practice:** [Relevant platforms]
# - **Online Learning:** [Courses and certifications]
# - **{student.school} Specific:** [Link to actual resources provided above]
# - **Networking:** [LinkedIn, Meetup, professional organizations]
# - **Job Search:** [LinkedIn, Handshake, Glassdoor, Indeed]

# ## Skills Checklist
# Create a checklist of skills they should master, organized by priority.

# ## Next Steps
# [3-5 immediate action items they can do this month]

# IMPORTANT: 
# - Use ONLY the actual {student.school} resources provided (the URLs above)
# - Make the roadmap specific to their major ({student.major}) and career goal
# - Include their current skills ({', '.join(student.skills)}) and suggest how to advance them
# - Be realistic about timelines given they are a {student.year}
# - Include both technical and soft skills development
# - Mention specific courses relevant to {student.major} at CUNY schools
# """
        
#         return prompt
    
#     def _get_year_label(self, current_year: str, offset: int) -> str:
#         """Get the year label for a given offset"""
#         year_sequence = ['Freshman', 'Sophomore', 'Junior', 'Senior']
        
#         try:
#             current_index = year_sequence.index(current_year)
#             new_index = min(current_index + offset, 3)
#             return year_sequence[new_index]
#         except ValueError:
#             return f"Year {offset + 1}"


# # Alternative implementation using OpenAI
# class RoadmapGeneratorOpenAI:
#     """Generate personalized 4-year roadmaps using OpenAI"""
    
#     def __init__(self, api_key: Optional[str] = None):
#         import openai
#         self.api_key = api_key or os.getenv('OPENAI_API_KEY')
#         openai.api_key = self.api_key
#         self.client = openai
    
#     def generate_roadmap(
#         self,
#         student: StudentProfile,
#         career: CareerGoal,
#         university_resources: UniversityResources
#     ) -> str:
#         """Generate a personalized 4-year roadmap using OpenAI"""
        
#         prompt = self._build_prompt(student, career, university_resources)
        
#         try:
#             response = self.client.chat.completions.create(
#                 model="gpt-4-turbo-preview",
#                 messages=[
#                     {"role": "system", "content": "You are an expert career advisor for CUNY students."},
#                     {"role": "user", "content": prompt}
#                 ],
#                 max_tokens=4000,
#                 temperature=0.7
#             )
            
#             return response.choices[0].message.content
            
#         except Exception as e:
#             return f"Error generating roadmap: {str(e)}"
    
#     def _build_prompt(self, student, career, university_resources):
#         """Same prompt building logic as RoadmapGenerator"""
#         # Use the same _build_prompt method from RoadmapGenerator
#         generator = RoadmapGenerator(api_key="dummy")
#         return generator._build_prompt(student, career, university_resources)


# # Example usage
# if __name__ == "__main__":
#     # Example student profile
#     student = StudentProfile(
#         name="Jane Doe",
#         email="jane@cuny.edu",
#         school="Queens College",
#         major="Computer Science",
#         year="Sophomore",
#         skills=["Python", "JavaScript", "Communication"],
#         interests="AI and machine learning",
#         career_goals="I want to become a software engineer at a tech company"
#     )
    
#     # Example career goal
#     career = CareerGoal(
#         title="Software Developers",
#         soc_code="15-1252",
#         description="Research, design, and develop computer and network software",
#         salary="$120,730",
#         growth="25%"
#     )
    
#     # Example university resources
#     resources = UniversityResources(
#         career_services_url="https://www.qc.cuny.edu/career-services/",
#         cs_department_url="https://www.qc.cuny.edu/academics/cs/",
#         clubs=["CS Club", "Women in Technology", "Hack Queens"],
#         internship_programs=["CUNY Internship Program"],
#         writing_center_url="https://www.qc.cuny.edu/writing-center/",
#         student_life_url="https://www.qc.cuny.edu/student-life/"
#     )
    
#     # Generate roadmap
#     generator = RoadmapGenerator()
#     roadmap = generator.generate_roadmap(student, career, resources)
#     print(roadmap)


#!/usr/bin/env python3
"""
AI-Powered Career Roadmap Generator using OpenAI
"""

import os
from typing import Dict, List, Optional
from dataclasses import dataclass
from openai import OpenAI

@dataclass
class StudentProfile:
    name: str
    email: str
    school: str
    major: str
    year: str
    skills: List[str]
    interests: str
    career_goals: str

@dataclass
class CareerGoal:
    title: str
    soc_code: str
    description: str
    salary: str
    growth: str

@dataclass
class UniversityResources:
    career_services_url: str
    cs_department_url: str
    clubs: List[str]
    internship_programs: List[str]
    writing_center_url: str
    student_life_url: str

class RoadmapGenerator:
    """Generate personalized 4-year career roadmaps using OpenAI"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found. Set it in environment or pass to constructor.")
        
        self.client = OpenAI(api_key=self.api_key)
    
    def generate_roadmap(
        self,
        student: StudentProfile,
        career: CareerGoal,
        university_resources: UniversityResources
    ) -> str:
        """Generate a personalized 4-year roadmap"""
        
        prompt = self._build_prompt(student, career, university_resources)
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",  # or "gpt-4-turbo" or "gpt-3.5-turbo"
                messages=[
                    {"role": "system", "content": "You are an expert career advisor for CUNY students, specializing in creating personalized career roadmaps."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4000,
                temperature=0.7
            )
            
            roadmap = response.choices[0].message.content
            return roadmap
            
        except Exception as e:
            return f"Error generating roadmap: {str(e)}"
    
    def _build_prompt(
        self,
        student: StudentProfile,
        career: CareerGoal,
        university_resources: UniversityResources
    ) -> str:
        """Build the AI prompt for roadmap generation"""
        
        # Calculate years remaining
        year_mapping = {
            'Freshman': 4,
            'Sophomore': 3,
            'Junior': 2,
            'Senior': 1,
            'Recent Graduate': 0
        }
        years_remaining = year_mapping.get(student.year, 4)
        
        prompt = f"""You are a career advisor creating a personalized roadmap for a CUNY student.

**Student Profile:**
- Name: {student.name}
- School: {student.school}
- Major: {student.major}
- Current Year: {student.year} ({years_remaining} years remaining)
- Skills: {', '.join(student.skills)}
- Interests: {student.interests}
- Career Goals: {student.career_goals}

**Target Career:**
- Title: {career.title}
- Description: {career.description}
- Median Salary: {career.salary}
- Growth Rate: {career.growth}

**{student.school} Resources:**
- Career Services: {university_resources.career_services_url}
- Department: {university_resources.cs_department_url}
- Student Clubs: {', '.join(university_resources.clubs)}
- Writing Center: {university_resources.writing_center_url}
- Student Life: {university_resources.student_life_url}

Create a detailed {years_remaining}-year roadmap to help this student achieve their goal of becoming a {career.title}. 

Structure your response as follows:

# Your Personalized Career Roadmap: {career.title}

## Overview
[Brief motivational intro about their career path]

## Year-by-Year Plan

### Year 1: [Title] ({self._get_year_label(student.year, 0)})
**Fall Semester**
- **Coursework:** [List relevant courses for their major]
- **Skills to Build:** [Technical and soft skills]
- **Get Involved:** [Specific clubs at {student.school}]
- **Action Items:** [Concrete steps they can take]

**Spring Semester**
- **Further Explore:** [Next steps]
- **Practice & Learn:** [External resources, online courses]
- **Start Building:** [Projects or portfolio items]

[Continue for remaining years based on {years_remaining}]

### Year 2: [Title] ({self._get_year_label(student.year, 1)})
[Similar structure]

### Year 3: [Title] ({self._get_year_label(student.year, 2)})
[Similar structure]

### Year 4: [Title] ({self._get_year_label(student.year, 3)})
[Similar structure - focus on job search and career launch]

## Key Resources & Tools
- **Coding Practice:** [Relevant platforms]
- **Online Learning:** [Courses and certifications]
- **{student.school} Specific:** [Link to actual resources provided above]
- **Networking:** [LinkedIn, Meetup, professional organizations]
- **Job Search:** [LinkedIn, Handshake, Glassdoor, Indeed]

## Skills Checklist
Create a checklist of skills they should master, organized by priority.

## Next Steps
[3-5 immediate action items they can do this month]

IMPORTANT: 
- Use ONLY the actual {student.school} resources provided (the URLs above)
- Make the roadmap specific to their major ({student.major}) and career goal
- Include their current skills ({', '.join(student.skills)}) and suggest how to advance them
- Be realistic about timelines given they are a {student.year}
- Include both technical and soft skills development
- Mention specific courses relevant to {student.major} at CUNY schools
"""
        
        return prompt
    
    def _get_year_label(self, current_year: str, offset: int) -> str:
        """Get the year label for a given offset"""
        year_sequence = ['Freshman', 'Sophomore', 'Junior', 'Senior']
        
        try:
            current_index = year_sequence.index(current_year)
            new_index = min(current_index + offset, 3)
            return year_sequence[new_index]
        except ValueError:
            return f"Year {offset + 1}"