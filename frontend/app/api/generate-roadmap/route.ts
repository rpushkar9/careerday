// "use client"
// import { NextResponse } from "next/server"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"
// import type { StudentData, RoadmapData } from "@/lib/types"

// // Function to extract JSON from a string that might contain markdown formatting
// function extractJSON(text: string): string {
//   // Check if the text contains markdown code blocks
//   if (text.includes("```")) {
//     // Try to extract JSON from markdown code blocks
//     const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
//     if (jsonMatch && jsonMatch[1]) {
//       return jsonMatch[1]
//     }
//   }

//   // If no code blocks or extraction failed, try to find JSON object directly
//   const objectMatch = text.match(/(\{[\s\S]*\})/)
//   if (objectMatch && objectMatch[1]) {
//     return objectMatch[1]
//   }

//   // If all extraction attempts fail, return the original text
//   return text
// }

// export async function POST(request: Request) {
//   try {
//     const studentData = (await request.json()) as StudentData

//     // Check if we have an API key before attempting to use the AI
//     if (!process.env.OPENAI_API_KEY) {
//       console.log("No OpenAI API key found in API route, using fallback roadmap data")
//       return NextResponse.json(getMajorSpecificRoadmap(studentData))
//     }

//     // Get major name
//     const majorName = getMajorName(studentData.major)

//     const prompt = `
//       Create a detailed 4-year academic roadmap for a ${studentData.age}-year-old student studying ${majorName} at ${studentData.university}.

//       For each year (1-4), provide Fall and Spring semesters with:
//       1. 5 courses per semester with course codes, names, and credit hours
//       2. 2 academic or extracurricular opportunities per semester
//       3. 1 volunteer activity per semester relevant to their field
//       4. 1 internship opportunity per semester they should apply for
//       5. 1 project per semester they should work on to build their portfolio
//       6. Tuition cost per semester (estimate $500 per credit hour)

//       IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or explanations.

//       The response should be a valid JSON object with the following structure:
//       {
//         "university": "University Name",
//         "major": "Major Name",
//         "years": {
//           "year1": {
//             "fall": {
//               "courses": [
//                 {"code": "CS101", "name": "Intro to Computer Science", "credits": 3},
//                 {"code": "MATH101", "name": "Calculus I", "credits": 4},
//                 ...
//               ],
//               "opportunities": ["Opportunity 1", "Opportunity 2"],
//               "volunteerWork": ["Volunteer Work 1"],
//               "internships": ["Internship 1"],
//               "projects": ["Project 1"],
//               "totalCredits": 15,
//               "tuition": 7500
//             },
//             "spring": { ... },
//             "totalCost": 15000
//           },
//           "year2": { ... },
//           "year3": { ... },
//           "year4": { ... }
//         },
//         "totalDegreeCredits": 120,
//         "totalDegreeCost": 60000
//       }

//       Make the recommendations specific to the major and realistic for each year of study.
//       Use realistic course codes and names for the major.
//       Ensure each semester has approximately 15 credits.
//     `

//     try {
//       const { text } = await generateText({
//         model: openai("gpt-4o"),
//         prompt,
//       })

//       // Process the response to extract JSON if needed
//       const processedText = extractJSON(text)

//       // Parse the JSON response
//       try {
//         const roadmapData = JSON.parse(processedText) as RoadmapData
//         return NextResponse.json(roadmapData)
//       } catch (parseError) {
//         console.error("Error parsing AI response:", parseError)
//         console.error("Raw response:", text)
//         console.error("Processed response:", processedText)
//         // If parsing fails, fall back to predefined data
//         return NextResponse.json(getMajorSpecificRoadmap(studentData))
//       }
//     } catch (aiError) {
//       console.error("AI generation error:", aiError)
//       // If AI generation fails, fall back to predefined data
//       return NextResponse.json(getMajorSpecificRoadmap(studentData))
//     }
//   } catch (error) {
//     console.error("Error in roadmap generation API:", error)
//     // Final fallback for any other errors
//     return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
//   }
// }

// // Import the getMajorName, getMajorSpecificRoadmap, and getGenericRoadmap functions from lib/generate-roadmap.ts
// // Since we can't directly import server components in API routes, we'll need to duplicate these functions

// function getMajorName(majorKey: string): string {
//   const majorMap: Record<string, string> = {
//     computer_science: "Computer Science",
//     business: "Business Administration",
//     engineering: "Engineering",
//     psychology: "Psychology",
//     biology: "Biology",
//     english: "English Literature",
//     history: "History",
//     mathematics: "Mathematics",
//     physics: "Physics",
//     chemistry: "Chemistry",
//     economics: "Economics",
//     political_science: "Political Science",
//     sociology: "Sociology",
//     art: "Fine Arts",
//     music: "Music",
//   }

//   return majorMap[majorKey] || majorKey
// }

// // Major-specific roadmap data (same as in lib/generate-roadmap.ts)
// function getMajorSpecificRoadmap(studentData: StudentData): RoadmapData {
//   // This function should be identical to the one in lib/generate-roadmap.ts
//   // For brevity, I'm not duplicating the entire implementation here
//   // In a real application, you would either duplicate the code or refactor to share it

//   return {
//     university: studentData.university,
//     major: getMajorName(studentData.major),
//     years: {
//       year1: {
//         fall: {
//           courses: [
//             { code: "101", name: "Introduction to Major", credits: 3 },
//             { code: "CORE101", name: "Core Requirement 1", credits: 3 },
//             { code: "CORE102", name: "Core Requirement 2", credits: 3 },
//             { code: "GEN101", name: "General Education Course 1", credits: 3 },
//             { code: "ENGL101", name: "Academic Writing", credits: 3 },
//           ],
//           opportunities: ["Join a relevant student club or organization", "Attend department orientation events"],
//           volunteerWork: ["Campus community service day"],
//           internships: ["Research assistant (on-campus)"],
//           projects: ["Introductory course project"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         spring: {
//           courses: [
//             { code: "102", name: "Fundamentals of Major", credits: 3 },
//             { code: "CORE103", name: "Core Requirement 3", credits: 3 },
//             { code: "CORE104", name: "Core Requirement 4", credits: 3 },
//             { code: "GEN102", name: "General Education Course 2", credits: 3 },
//             { code: "COMM101", name: "Public Speaking", credits: 3 },
//           ],
//           opportunities: ["Meet with academic advisor regularly", "Attend career exploration workshops"],
//           volunteerWork: ["Department-sponsored outreach program"],
//           internships: ["Entry-level summer internship"],
//           projects: ["Personal portfolio development"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         totalCost: 15000,
//       },
//       year2: {
//         fall: {
//           courses: [
//             { code: "201", name: "Intermediate Major Course 1", credits: 3 },
//             { code: "202", name: "Intermediate Major Course 2", credits: 3 },
//             { code: "ELEC201", name: "Related Elective 1", credits: 3 },
//             { code: "GEN201", name: "General Education Course 3", credits: 3 },
//             { code: "STAT201", name: "Statistics for Major", credits: 3 },
//           ],
//           opportunities: ["Apply for department scholarships", "Attend career fairs"],
//           volunteerWork: ["Peer tutoring"],
//           internships: ["Summer internship in related field"],
//           projects: ["Team-based course project"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         spring: {
//           courses: [
//             { code: "203", name: "Intermediate Major Course 3", credits: 3 },
//             { code: "204", name: "Intermediate Major Course 4", credits: 3 },
//             { code: "ELEC202", name: "Related Elective 2", credits: 3 },
//             { code: "GEN202", name: "General Education Course 4", credits: 3 },
//             { code: "MINOR201", name: "Minor Course (if applicable)", credits: 3 },
//           ],
//           opportunities: ["Join study groups", "Undergraduate research opportunities"],
//           volunteerWork: ["Community organization related to field"],
//           internships: ["Part-time job related to major"],
//           projects: ["Independent study project"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         totalCost: 15000,
//       },
//       year3: {
//         fall: {
//           courses: [
//             { code: "301", name: "Advanced Major Course 1", credits: 3 },
//             { code: "302", name: "Advanced Major Course 2", credits: 3 },
//             { code: "303", name: "Advanced Major Course 3", credits: 3 },
//             { code: "ELEC301", name: "Related Elective 3", credits: 3 },
//             { code: "MINOR301", name: "Minor Course (if applicable)", credits: 3 },
//           ],
//           opportunities: ["Study abroad program", "Research with faculty"],
//           volunteerWork: ["Leadership role in campus organization"],
//           internships: ["Summer internship in target career field"],
//           projects: ["Research project"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         spring: {
//           courses: [
//             { code: "304", name: "Advanced Major Course 4", credits: 3 },
//             { code: "305", name: "Advanced Major Course 5", credits: 3 },
//             { code: "ELEC302", name: "Related Elective 4", credits: 3 },
//             { code: "MINOR302", name: "Minor Course (if applicable)", credits: 3 },
//             { code: "GEN301", name: "Advanced General Education", credits: 3 },
//           ],
//           opportunities: ["Professional conference attendance", "Leadership development programs"],
//           volunteerWork: ["Industry-related volunteer work"],
//           internships: ["Co-op or part-time professional position"],
//           projects: ["Professional portfolio development"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         totalCost: 15000,
//       },
//       year4: {
//         fall: {
//           courses: [
//             { code: "401", name: "Senior Seminar", credits: 3 },
//             { code: "402", name: "Pre-Capstone Course", credits: 3 },
//             { code: "ELEC401", name: "Specialized Elective 1", credits: 3 },
//             { code: "ELEC402", name: "Specialized Elective 2", credits: 3 },
//             { code: "PROF401", name: "Professional Development Course", credits: 3 },
//           ],
//           opportunities: ["Present at undergraduate research symposium", "Network with alumni"],
//           volunteerWork: ["Mentor underclassmen"],
//           internships: ["Pre-professional internship"],
//           projects: ["Senior thesis (part 1)"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         spring: {
//           courses: [
//             { code: "499", name: "Capstone Course", credits: 4 },
//             { code: "ELEC403", name: "Specialized Elective 3", credits: 3 },
//             { code: "ELEC404", name: "Specialized Elective 4", credits: 3 },
//             { code: "PROF402", name: "Career Preparation", credits: 3 },
//             { code: "MINOR401", name: "Minor Capstone (if applicable)", credits: 2 },
//           ],
//           opportunities: ["Graduate school application preparation", "Job interviews and career planning"],
//           volunteerWork: ["Professional organization volunteer"],
//           internships: ["Job shadowing in target career"],
//           projects: ["Senior thesis or capstone project (part 2)"],
//           totalCredits: 15,
//           tuition: 7500,
//         },
//         totalCost: 15000,
//       },
//     },
//     totalDegreeCredits: 120,
//     totalDegreeCost: 60000,
//   }
// }

// app/api/generate-roadmap/route.ts
// import { openai } from "@ai-sdk/openai"
// import { generateText } from "ai"
// import { NextResponse } from "next/server"

// export const maxDuration = 30 // Extend function timeout to 30 seconds

// export async function POST(req: Request) {
//   try {
//     const { careerTitle, careerDescription } = await req.json()

//     if (!careerTitle) {
//       return NextResponse.json({ error: "Career title is required" }, { status: 400 })
//     }

//     const prompt = `
//       Create a detailed educational roadmap for a student pursuing a career as a "${careerTitle}".
//       ${careerDescription ? `The career involves: ${careerDescription}` : ""}

//       The roadmap should cover 8 semesters (4 years) of college education, with specific courses,
//       skills to develop, projects to work on, and milestones to achieve for each semester.

//       Format the response as a JSON array with the following structure:
//       [
//         {
//           "number": 1,
//           "semester": "Freshman Fall Semester",
//           "title": "Title for this semester's focus",
//           "description": "Detailed description of what to learn and do"
//         },
//         ...
//       ]

//       Include only the JSON array in your response, with no additional text.
//     `

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       prompt,
//     })

//     // Parse the response as JSON
//     let roadmap
//     try {
//       // Find JSON array in the response
//       const jsonMatch = text.match(/\[[\s\S]*\]/)
//       if (jsonMatch) {
//         roadmap = JSON.parse(jsonMatch[0])
//       } else {
//         throw new Error("No valid JSON found in response")
//       }
//     } catch (error) {
//       console.error("Error parsing AI response:", error)
//       return NextResponse.json({ error: "Failed to parse roadmap data" }, { status: 500 })
//     }

//     return NextResponse.json({ roadmap })
//   } catch (error) {
//     console.error("Error generating roadmap:", error)
//     return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
//   }
// }

// import type { NextApiRequest, NextApiResponse } from 'next'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   try {
//     const { title, description } = req.body

//     const generatedRoadmap = {
//       stages: [
//         {
//           stage: `Step 1: Foundation in ${title}`,
//           description: `Begin by learning the core concepts of ${title}. ${description}`,
//           duration: "3-6 months",
//           keySkills: ["Fundamentals", "Basic Concepts"],
//           resources: ["Online Courses", "Introductory Books"]
//         },
//         {
//           stage: `Step 2: Intermediate ${title} Skills`,
//           description: `Build upon your foundation with more advanced topics in ${title}.`,
//           duration: "6-12 months",
//           keySkills: ["Advanced Techniques", "Problem Solving"],
//           resources: ["Advanced Courses", "Practice Projects"]
//         },
//         // Add more generated steps as needed
//       ]
//     }

//     res.status(200).json({ roadmap: generatedRoadmap })
//   } catch (error) {
//     console.error('Error generating roadmap:', error)
//     res.status(500).json({ error: 'Failed to generate roadmap' })
//   }
// }
