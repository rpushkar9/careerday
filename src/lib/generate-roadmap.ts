'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import type { StudentData, RoadmapData } from './types';

// Function to extract JSON from a string that might contain markdown formatting
function extractJSON(text: string): string {
  // Check if the text contains markdown code blocks
  if (text.includes('```')) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    }
  }

  // If no code blocks or extraction failed, try to find JSON object directly
  const objectMatch = text.match(/(\{[\s\S]*\})/);
  if (objectMatch && objectMatch[1]) {
    return objectMatch[1];
  }

  // If all extraction attempts fail, return the original text
  return text;
}

export async function generateRoadmap(
  studentData: StudentData
): Promise<RoadmapData> {
  try {
    // First check if we have an API key before attempting to use the AI
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found, using fallback roadmap data');
      return getMajorSpecificRoadmap(studentData);
    }

    // If we have an API key, try to generate with AI
    const majorName = getMajorName(studentData.major);

    const prompt = `
      Create a detailed 4-year academic roadmap for a ${studentData.age}-year-old student studying ${majorName} at ${studentData.university}.
      
      For each year (1-4), provide Fall and Spring semesters with:
      1. 5 courses per semester with course codes, names, and credit hours
      2. 2 academic or extracurricular opportunities per semester
      3. 1 volunteer activity per semester relevant to their field
      4. 1 internship opportunity per semester they should apply for
      5. 1 project per semester they should work on to build their portfolio
      6. Tuition cost per semester (estimate $500 per credit hour)
      
      IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or explanations.
      
      The response should be a valid JSON object with the following structure:
      {
        "university": "University Name",
        "major": "Major Name",
        "years": {
          "year1": {
            "fall": {
              "courses": [
                {"code": "CS101", "name": "Intro to Computer Science", "credits": 3},
                {"code": "MATH101", "name": "Calculus I", "credits": 4},
                ...
              ],
              "opportunities": ["Opportunity 1", "Opportunity 2"],
              "volunteerWork": ["Volunteer Work 1"],
              "internships": ["Internship 1"],
              "projects": ["Project 1"],
              "totalCredits": 15,
              "tuition": 7500
            },
            "spring": { ... },
            "totalCost": 15000
          },
          "year2": { ... },
          "year3": { ... },
          "year4": { ... }
        },
        "totalDegreeCredits": 120,
        "totalDegreeCost": 60000
      }
      
      Make the recommendations specific to the major and realistic for each year of study.
      Use realistic course codes and names for the major.
      Ensure each semester has approximately 15 credits.
    `;

    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt,
      });

      // Process the response to extract JSON if needed
      const processedText = extractJSON(text);

      // Parse the JSON response
      try {
        const roadmapData = JSON.parse(processedText) as RoadmapData;
        return roadmapData;
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.error('Raw response:', text);
        console.error('Processed response:', processedText);
        // If parsing fails, fall back to predefined data
        return getMajorSpecificRoadmap(studentData);
      }
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // If AI generation fails, fall back to predefined data
      return getMajorSpecificRoadmap(studentData);
    }
  } catch (error) {
    console.error('Error in roadmap generation:', error);
    // Final fallback for any other errors
    return getGenericRoadmap(studentData);
  }
}

function getMajorName(majorKey: string): string {
  const majorMap: Record<string, string> = {
    computer_science: 'Computer Science',
    business: 'Business Administration',
    engineering: 'Engineering',
    psychology: 'Psychology',
    biology: 'Biology',
    english: 'English Literature',
    history: 'History',
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    economics: 'Economics',
    political_science: 'Political Science',
    sociology: 'Sociology',
    art: 'Fine Arts',
    music: 'Music',
    accountant: 'Accountant',
  };

  return majorMap[majorKey] || majorKey;
}

// Major-specific roadmap data
function getMajorSpecificRoadmap(studentData: StudentData): RoadmapData {
  const majorName = getMajorName(studentData.major);

  // Computer Science specific roadmap
  if (studentData.major === 'computer_science') {
    return {
      university: studentData.university,
      major: majorName,
      years: {
        year1: {
          fall: {
            courses: [
              {
                code: 'CS101',
                name: 'Introduction to Computer Science',
                credits: 3,
              },
              { code: 'MATH141', name: 'Calculus I', credits: 4 },
              { code: 'ENGL101', name: 'Academic Writing', credits: 3 },
              {
                code: 'CMSC131',
                name: 'Object-Oriented Programming I',
                credits: 4,
              },
              { code: 'UNIV100', name: 'First Year Experience', credits: 1 },
            ],
            opportunities: [
              'Join Computer Science Club',
              'Attend programming workshops',
            ],
            volunteerWork: ['Tech support for campus events'],
            internships: ['IT Help Desk (on-campus)'],
            projects: ['Personal portfolio website'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              {
                code: 'CMSC132',
                name: 'Object-Oriented Programming II',
                credits: 4,
              },
              { code: 'MATH142', name: 'Calculus II', credits: 4 },
              { code: 'CMSC250', name: 'Discrete Structures', credits: 4 },
              { code: 'COMM107', name: 'Oral Communication', credits: 3 },
              {
                code: 'PSYC100',
                name: 'Introduction to Psychology',
                credits: 3,
              },
            ],
            opportunities: [
              'Participate in coding competitions',
              'Join study groups for CS courses',
            ],
            volunteerWork: ['Teaching basic coding to kids'],
            internships: ['Junior Developer (Summer)'],
            projects: ['Simple mobile app or game'],
            totalCredits: 18,
            tuition: 9000,
          },
          totalCost: 16500,
        },
        year2: {
          fall: {
            courses: [
              {
                code: 'CMSC216',
                name: 'Introduction to Computer Systems',
                credits: 4,
              },
              {
                code: 'CMSC330',
                name: 'Organization of Programming Languages',
                credits: 3,
              },
              { code: 'MATH240', name: 'Linear Algebra', credits: 3 },
              {
                code: 'STAT400',
                name: 'Applied Probability and Statistics',
                credits: 3,
              },
              { code: 'HIST200', name: 'Technology in History', credits: 3 },
            ],
            opportunities: [
              'Undergraduate research assistant',
              'Hackathons participation',
            ],
            volunteerWork: ['Peer tutoring in programming courses'],
            internships: ['Software Development Intern'],
            projects: ['Data structures implementation project'],
            totalCredits: 16,
            tuition: 8000,
          },
          spring: {
            courses: [
              { code: 'CMSC351', name: 'Algorithms', credits: 3 },
              {
                code: 'CMSC320',
                name: 'Introduction to Data Science',
                credits: 3,
              },
              {
                code: 'CMSC335',
                name: 'Web Application Development',
                credits: 3,
              },
              { code: 'PHIL105', name: 'Critical Thinking', credits: 3 },
              { code: 'BSCI105', name: 'Principles of Biology', credits: 4 },
            ],
            opportunities: [
              'Open source contributions',
              'Tech meetups and conferences',
            ],
            volunteerWork: ['Technical support for campus events'],
            internships: ['QA Testing Intern'],
            projects: ['Full-stack web application'],
            totalCredits: 16,
            tuition: 8000,
          },
          totalCost: 16000,
        },
        year3: {
          fall: {
            courses: [
              { code: 'CMSC412', name: 'Operating Systems', credits: 3 },
              { code: 'CMSC420', name: 'Advanced Data Structures', credits: 3 },
              {
                code: 'CMSC421',
                name: 'Introduction to Artificial Intelligence',
                credits: 3,
              },
              {
                code: 'CMSC389',
                name: 'Special Topics in Computer Science',
                credits: 3,
              },
              {
                code: 'ARTT100',
                name: 'Two-Dimensional Design Fundamentals',
                credits: 3,
              },
            ],
            opportunities: [
              'Study abroad in tech hub',
              'Teaching assistant position',
            ],
            volunteerWork: ['Mentoring junior CS students'],
            internships: ['Software Engineer Intern at tech company'],
            projects: ['Machine learning application'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              { code: 'CMSC417', name: 'Computer Networks', credits: 3 },
              { code: 'CMSC430', name: 'Compiler Design', credits: 3 },
              {
                code: 'CMSC434',
                name: 'Human-Computer Interaction',
                credits: 3,
              },
              {
                code: 'CMSC436',
                name: 'Programming Handheld Systems',
                credits: 3,
              },
              {
                code: 'ECON200',
                name: 'Principles of Microeconomics',
                credits: 3,
              },
            ],
            opportunities: [
              'Industry conference attendance',
              'Competitive programming team',
            ],
            volunteerWork: ['Developing software for local charities'],
            internships: ['Data Science Intern'],
            projects: ['Mobile app with backend integration'],
            totalCredits: 15,
            tuition: 7500,
          },
          totalCost: 15000,
        },
        year4: {
          fall: {
            courses: [
              {
                code: 'CMSC451',
                name: 'Design and Analysis of Computer Algorithms',
                credits: 3,
              },
              {
                code: 'CMSC411',
                name: 'Computer Systems Architecture',
                credits: 3,
              },
              {
                code: 'CMSC414',
                name: 'Computer and Network Security',
                credits: 3,
              },
              { code: 'CMSC435', name: 'Software Engineering', credits: 3 },
              { code: 'GVPT170', name: 'American Government', credits: 3 },
            ],
            opportunities: [
              'Present research at symposium',
              'Lead a student tech project',
            ],
            volunteerWork: ['Organizing coding workshops'],
            internships: ['Pre-professional internship in specialization'],
            projects: ['Comprehensive capstone project (part 1)'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              { code: 'CMSC498', name: 'Senior Capstone Project', credits: 4 },
              { code: 'CMSC425', name: 'Game Programming', credits: 3 },
              { code: 'CMSC422', name: 'Machine Learning', credits: 3 },
              { code: 'CMSC424', name: 'Database Design', credits: 3 },
              {
                code: 'CMSC389E',
                name: 'Ethics in Computer Science',
                credits: 1,
              },
            ],
            opportunities: [
              'Network with industry professionals',
              'Job fairs and interviews',
            ],
            volunteerWork: ['Contributing to major open source projects'],
            internships: ['Research internship in advanced topics'],
            projects: ['Comprehensive capstone project (part 2)'],
            totalCredits: 14,
            tuition: 7000,
          },
          totalCost: 14500,
        },
      },
      totalDegreeCredits: 124,
      totalDegreeCost: 62000,
    };
  }

  // Business specific roadmap
  else if (studentData.major === 'business') {
    return {
      university: studentData.university,
      major: majorName,
      years: {
        year1: {
          fall: {
            courses: [
              { code: 'BMGT110', name: 'Introduction to Business', credits: 3 },
              {
                code: 'ECON200',
                name: 'Principles of Microeconomics',
                credits: 3,
              },
              { code: 'MATH120', name: 'Business Mathematics', credits: 3 },
              { code: 'ENGL101', name: 'Academic Writing', credits: 3 },
              { code: 'UNIV100', name: 'First Year Experience', credits: 1 },
            ],
            opportunities: [
              'Join Business Students Association',
              'Attend entrepreneurship workshops',
            ],
            volunteerWork: ['Fundraising for campus organizations'],
            internships: ['Administrative Assistant (on-campus)'],
            projects: ['Business plan for hypothetical startup'],
            totalCredits: 13,
            tuition: 6500,
          },
          spring: {
            courses: [
              {
                code: 'ECON201',
                name: 'Principles of Macroeconomics',
                credits: 3,
              },
              {
                code: 'BMGT220',
                name: 'Principles of Accounting I',
                credits: 3,
              },
              { code: 'COMM107', name: 'Oral Communication', credits: 3 },
              { code: 'STAT100', name: 'Elementary Statistics', credits: 3 },
              {
                code: 'PSYC100',
                name: 'Introduction to Psychology',
                credits: 3,
              },
            ],
            opportunities: [
              'Participate in business case competitions',
              'Join finance or marketing club',
            ],
            volunteerWork: ['Community financial literacy programs'],
            internships: ['Customer Service Representative'],
            projects: ['Market analysis of local business'],
            totalCredits: 15,
            tuition: 7500,
          },
          totalCost: 14000,
        },
        year2: {
          fall: {
            courses: [
              {
                code: 'BMGT221',
                name: 'Principles of Accounting II',
                credits: 3,
              },
              { code: 'BMGT230', name: 'Business Statistics', credits: 3 },
              { code: 'BMGT350', name: 'Marketing Principles', credits: 3 },
              {
                code: 'BMGT364',
                name: 'Management and Organization',
                credits: 3,
              },
              { code: 'PHIL140', name: 'Business Ethics', credits: 3 },
            ],
            opportunities: [
              'Case competition participation',
              'Networking events with alumni',
            ],
            volunteerWork: ['Volunteer for business conferences'],
            internships: ['Marketing Assistant Intern'],
            projects: ['Marketing campaign for campus event'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              { code: 'BMGT340', name: 'Business Finance', credits: 3 },
              { code: 'BMGT380', name: 'Business Law I', credits: 3 },
              {
                code: 'BMGT301',
                name: 'Introduction to Information Systems',
                credits: 3,
              },
              { code: 'BMGT360', name: 'Strategic Management', credits: 3 },
              { code: 'HIST200', name: 'Technology in History', credits: 3 },
            ],
            opportunities: [
              'Business leadership program',
              'Professional development workshops',
            ],
            volunteerWork: ['Consulting for local small businesses'],
            internships: ['Finance or Accounting Intern'],
            projects: ['Financial analysis project'],
            totalCredits: 15,
            tuition: 7500,
          },
          totalCost: 15000,
        },
        year3: {
          fall: {
            courses: [
              {
                code: 'BMGT302',
                name: 'Business Computer Application Programming',
                credits: 3,
              },
              {
                code: 'BMGT332',
                name: 'Operations Research for Management Decisions',
                credits: 3,
              },
              {
                code: 'BMGT392',
                name: 'Introduction to International Business',
                credits: 3,
              },
              { code: 'BMGT385', name: 'Operations Management', credits: 3 },
              {
                code: 'COMM200',
                name: 'Critical Thinking and Speaking',
                credits: 3,
              },
            ],
            opportunities: [
              'Study abroad in business hub',
              'Leadership role in business club',
            ],
            volunteerWork: ['Nonprofit organization consulting'],
            internships: ['Business Analyst Intern'],
            projects: ['Business process improvement project'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              { code: 'BMGT365', name: 'Entrepreneurship', credits: 3 },
              {
                code: 'BMGT372',
                name: 'Introduction to Logistics and Supply Chain Management',
                credits: 3,
              },
              { code: 'BMGT402', name: 'Database Systems', credits: 3 },
              {
                code: 'BMGT403',
                name: 'Systems Analysis and Design',
                credits: 3,
              },
              {
                code: 'ECON305',
                name: 'Intermediate Macroeconomic Theory',
                credits: 3,
              },
            ],
            opportunities: [
              'Industry certification preparation',
              'Business plan competitions',
            ],
            volunteerWork: ['Business plan development for charities'],
            internships: ['Project Management Intern'],
            projects: ['Investment portfolio management simulation'],
            totalCredits: 15,
            tuition: 7500,
          },
          totalCost: 15000,
        },
        year4: {
          fall: {
            courses: [
              { code: 'BMGT495', name: 'Business Policies', credits: 3 },
              {
                code: 'BMGT443',
                name: 'Applied Equity Analysis and Portfolio Management',
                credits: 3,
              },
              { code: 'BMGT484', name: 'Electronic Marketing', credits: 3 },
              {
                code: 'BMGT496',
                name: 'Business Ethics and Society',
                credits: 3,
              },
              {
                code: 'BMGT411',
                name: 'Ethics and Professionalism in Accounting',
                credits: 3,
              },
            ],
            opportunities: [
              'Business plan competition',
              'Mentorship program with executives',
            ],
            volunteerWork: ['Mentoring junior business students'],
            internships: ['Management Trainee position'],
            projects: ['Comprehensive business plan (part 1)'],
            totalCredits: 15,
            tuition: 7500,
          },
          spring: {
            courses: [
              {
                code: 'BMGT499',
                name: 'Advanced Business Capstone',
                credits: 4,
              },
              {
                code: 'BMGT468',
                name: 'Special Topics in Management',
                credits: 3,
              },
              {
                code: 'BMGT450',
                name: 'Integrated Marketing Communications',
                credits: 3,
              },
              { code: 'BMGT455', name: 'Sales Management', credits: 3 },
              { code: 'BMGT493', name: 'Honors Study', credits: 1 },
            ],
            opportunities: [
              'Professional certification',
              'Job fairs and interviews',
            ],
            volunteerWork: ['Pro bono consulting for startups'],
            internships: ['Specialized internship in career focus area'],
            projects: ['Comprehensive business plan (part 2)'],
            totalCredits: 14,
            tuition: 7000,
          },
          totalCost: 14500,
        },
      },
      totalDegreeCredits: 117,
      totalDegreeCost: 58500,
    };
  }

  // For other majors, return the generic roadmap
  return getGenericRoadmap(studentData);
}

// Generic fallback roadmap
function getGenericRoadmap(studentData: StudentData): RoadmapData {
  const majorName = getMajorName(studentData.major);

  return {
    university: studentData.university,
    major: majorName,
    years: {
      year1: {
        fall: {
          courses: [
            { code: '101', name: 'Introduction to Major', credits: 3 },
            { code: 'CORE101', name: 'Core Requirement 1', credits: 3 },
            { code: 'CORE102', name: 'Core Requirement 2', credits: 3 },
            { code: 'GEN101', name: 'General Education Course 1', credits: 3 },
            { code: 'ENGL101', name: 'Academic Writing', credits: 3 },
          ],
          opportunities: [
            'Join a relevant student club or organization',
            'Attend department orientation events',
          ],
          volunteerWork: ['Campus community service day'],
          internships: ['Research assistant (on-campus)'],
          projects: ['Introductory course project'],
          totalCredits: 15,
          tuition: 7500,
        },
        spring: {
          courses: [
            { code: '102', name: 'Fundamentals of Major', credits: 3 },
            { code: 'CORE103', name: 'Core Requirement 3', credits: 3 },
            { code: 'CORE104', name: 'Core Requirement 4', credits: 3 },
            { code: 'GEN102', name: 'General Education Course 2', credits: 3 },
            { code: 'COMM101', name: 'Public Speaking', credits: 3 },
          ],
          opportunities: [
            'Meet with academic advisor regularly',
            'Attend career exploration workshops',
          ],
          volunteerWork: ['Department-sponsored outreach program'],
          internships: ['Entry-level summer internship'],
          projects: ['Personal portfolio development'],
          totalCredits: 15,
          tuition: 7500,
        },
        totalCost: 15000,
      },
      year2: {
        fall: {
          courses: [
            { code: '201', name: 'Intermediate Major Course 1', credits: 3 },
            { code: '202', name: 'Intermediate Major Course 2', credits: 3 },
            { code: 'ELEC201', name: 'Related Elective 1', credits: 3 },
            { code: 'GEN201', name: 'General Education Course 3', credits: 3 },
            { code: 'STAT201', name: 'Statistics for Major', credits: 3 },
          ],
          opportunities: [
            'Apply for department scholarships',
            'Attend career fairs',
          ],
          volunteerWork: ['Peer tutoring'],
          internships: ['Summer internship in related field'],
          projects: ['Team-based course project'],
          totalCredits: 15,
          tuition: 7500,
        },
        spring: {
          courses: [
            { code: '203', name: 'Intermediate Major Course 3', credits: 3 },
            { code: '204', name: 'Intermediate Major Course 4', credits: 3 },
            { code: 'ELEC202', name: 'Related Elective 2', credits: 3 },
            { code: 'GEN202', name: 'General Education Course 4', credits: 3 },
            {
              code: 'MINOR201',
              name: 'Minor Course (if applicable)',
              credits: 3,
            },
          ],
          opportunities: [
            'Join study groups',
            'Undergraduate research opportunities',
          ],
          volunteerWork: ['Community organization related to field'],
          internships: ['Part-time job related to major'],
          projects: ['Independent study project'],
          totalCredits: 15,
          tuition: 7500,
        },
        totalCost: 15000,
      },
      year3: {
        fall: {
          courses: [
            { code: '301', name: 'Advanced Major Course 1', credits: 3 },
            { code: '302', name: 'Advanced Major Course 2', credits: 3 },
            { code: '303', name: 'Advanced Major Course 3', credits: 3 },
            { code: 'ELEC301', name: 'Related Elective 3', credits: 3 },
            {
              code: 'MINOR301',
              name: 'Minor Course (if applicable)',
              credits: 3,
            },
          ],
          opportunities: ['Study abroad program', 'Research with faculty'],
          volunteerWork: ['Leadership role in campus organization'],
          internships: ['Summer internship in target career field'],
          projects: ['Research project'],
          totalCredits: 15,
          tuition: 7500,
        },
        spring: {
          courses: [
            { code: '304', name: 'Advanced Major Course 4', credits: 3 },
            { code: '305', name: 'Advanced Major Course 5', credits: 3 },
            { code: 'ELEC302', name: 'Related Elective 4', credits: 3 },
            {
              code: 'MINOR302',
              name: 'Minor Course (if applicable)',
              credits: 3,
            },
            { code: 'GEN301', name: 'Advanced General Education', credits: 3 },
          ],
          opportunities: [
            'Professional conference attendance',
            'Leadership development programs',
          ],
          volunteerWork: ['Industry-related volunteer work'],
          internships: ['Co-op or part-time professional position'],
          projects: ['Professional portfolio development'],
          totalCredits: 15,
          tuition: 7500,
        },
        totalCost: 15000,
      },
      year4: {
        fall: {
          courses: [
            { code: '401', name: 'Senior Seminar', credits: 3 },
            { code: '402', name: 'Pre-Capstone Course', credits: 3 },
            { code: 'ELEC401', name: 'Specialized Elective 1', credits: 3 },
            { code: 'ELEC402', name: 'Specialized Elective 2', credits: 3 },
            {
              code: 'PROF401',
              name: 'Professional Development Course',
              credits: 3,
            },
          ],
          opportunities: [
            'Present at undergraduate research symposium',
            'Network with alumni',
          ],
          volunteerWork: ['Mentor underclassmen'],
          internships: ['Pre-professional internship'],
          projects: ['Senior thesis (part 1)'],
          totalCredits: 15,
          tuition: 7500,
        },
        spring: {
          courses: [
            { code: '499', name: 'Capstone Course', credits: 4 },
            { code: 'ELEC403', name: 'Specialized Elective 3', credits: 3 },
            { code: 'ELEC404', name: 'Specialized Elective 4', credits: 3 },
            { code: 'PROF402', name: 'Career Preparation', credits: 3 },
            {
              code: 'MINOR401',
              name: 'Minor Capstone (if applicable)',
              credits: 2,
            },
          ],
          opportunities: [
            'Graduate school application preparation',
            'Job interviews and career planning',
          ],
          volunteerWork: ['Professional organization volunteer'],
          internships: ['Job shadowing in target career'],
          projects: ['Senior thesis or capstone project (part 2)'],
          totalCredits: 15,
          tuition: 7500,
        },
        totalCost: 15000,
      },
    },
    totalDegreeCredits: 120,
    totalDegreeCost: 60000,
  };
}
