// "use server"

// interface WikipediaSearchResult {
//   title: string
//   snippet: string
// }

// interface WikipediaResponse {
//   query: {
//     search: WikipediaSearchResult[]
//   }
// }

// export async function findJobsForMajor(major: string): Promise<string[]> {
//   try {
//     // Normalize the major input
//     const normalizedMajor = major.toLowerCase().trim()

//     // Create a search query that's likely to return career-related results
//     const searchQuery = `${normalizedMajor} careers jobs professions`

//     // Construct the Wikipedia API URL
//     // This searches Wikipedia for articles related to the major and careers
//     const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`

//     console.log("Calling Wikipedia API:", apiUrl)

//     // Make the API request
//     const response = await fetch(apiUrl)

//     // Check if we got a successful response
//     if (!response.ok) {
//       console.error("Wikipedia API error:", response.status, response.statusText)
//       // Fall back to our local database
//       return getFallbackJobsForMajor(normalizedMajor)
//     }

//     const data: WikipediaResponse = await response.json()

//     // Process the Wikipedia search results to extract job titles
//     // We'll need to do some filtering and processing to get meaningful job titles
//     const searchResults = data.query.search

//     // Extract potential job titles from the search results
//     const jobTitles = extractJobTitlesFromWikipediaResults(searchResults, normalizedMajor)

//     if (jobTitles.length >= 5) {
//       return jobTitles.slice(0, 5)
//     }

//     // If we didn't get enough results, try a different approach
//     // Use a more general search for careers in the field
//     const alternativeQuery = `careers in ${normalizedMajor}`
//     const alternativeUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(alternativeQuery)}&format=json&origin=*`

//     const altResponse = await fetch(alternativeUrl)
//     if (altResponse.ok) {
//       const altData: WikipediaResponse = await altResponse.json()
//       const additionalTitles = extractJobTitlesFromWikipediaResults(altData.query.search, normalizedMajor)

//       // Combine results, remove duplicates, and take the top 5
//       const combinedTitles = [...new Set([...jobTitles, ...additionalTitles])]
//       if (combinedTitles.length >= 5) {
//         return combinedTitles.slice(0, 5)
//       }
//     }

//     // If we still don't have enough results, fall back to our database
//     if (jobTitles.length === 0) {
//       return getFallbackJobsForMajor(normalizedMajor)
//     }

//     // Fill in any remaining slots with fallback data
//     const fallbackJobs = getFallbackJobsForMajor(normalizedMajor)
//     const remainingCount = 5 - jobTitles.length

//     return [...jobTitles, ...fallbackJobs.slice(0, remainingCount)]
//   } catch (error) {
//     console.error("Error fetching job data:", error)
//     // Fall back to our local database in case of errors
//     return getFallbackJobsForMajor(major)
//   }
// }

// // Helper function to extract job titles from Wikipedia search results
// function extractJobTitlesFromWikipediaResults(results: WikipediaSearchResult[], major: string): string[] {
//   // Common job title keywords to look for
//   const jobKeywords = [
//     "engineer",
//     "developer",
//     "analyst",
//     "manager",
//     "specialist",
//     "consultant",
//     "designer",
//     "director",
//     "coordinator",
//     "administrator",
//     "scientist",
//     "technician",
//     "researcher",
//     "teacher",
//     "professor",
//     "advisor",
//   ]

//   // Process each search result to extract potential job titles
//   const jobTitles: string[] = []

//   for (const result of results) {
//     const title = result.title
//     const snippet = result.snippet

//     // Check if the title directly contains a job title
//     for (const keyword of jobKeywords) {
//       if (title.toLowerCase().includes(keyword)) {
//         // Clean up the title if it's a job title
//         const cleanTitle = title
//           .replace(/$$.*?$$/g, "") // Remove parentheses and their contents
//           .replace(/\[.*?\]/g, "") // Remove brackets and their contents
//           .trim()

//         if (!jobTitles.includes(cleanTitle) && !cleanTitle.includes("List of")) {
//           jobTitles.push(cleanTitle)
//           break
//         }
//       }
//     }

//     // If we already have 5 job titles, stop processing
//     if (jobTitles.length >= 5) break

//     // Extract job titles from the snippet
//     const snippetText = snippet.replace(/<span.*?>/g, "").replace(/<\/span>/g, "")

//     // Look for patterns like "... as a [job title]" or "... become a [job title]"
//     const jobPatterns = [
//       /as an? ([A-Z][a-z]+ [A-Z][a-z]+)/g,
//       /as an? ([A-Z][a-z]+)/g,
//       /become an? ([A-Z][a-z]+ [A-Z][a-z]+)/g,
//       /become an? ([A-Z][a-z]+)/g,
//       /career as an? ([A-Z][a-z]+ [A-Z][a-z]+)/g,
//       /career as an? ([A-Z][a-z]+)/g,
//     ]

//     for (const pattern of jobPatterns) {
//       const matches = snippetText.matchAll(pattern)
//       for (const match of matches) {
//         if (match[1] && !jobTitles.includes(match[1]) && !match[1].includes("List of")) {
//           jobTitles.push(match[1])
//           if (jobTitles.length >= 5) break
//         }
//       }
//       if (jobTitles.length >= 5) break
//     }
//   }

//   return jobTitles
// }

// // Fallback function that uses our local database
// function getFallbackJobsForMajor(major: string): string[] {
//   const normalizedMajor = major.toLowerCase().trim()

//   // Find exact match
//   if (majorJobDatabase[normalizedMajor]) {
//     return majorJobDatabase[normalizedMajor]
//   }

//   // Find partial match
//   for (const key of Object.keys(majorJobDatabase)) {
//     if (key.includes(normalizedMajor) || normalizedMajor.includes(key)) {
//       return majorJobDatabase[key]
//     }
//   }

//   // If no specific match found, try to categorize by field
//   if (
//     normalizedMajor.includes("comput") ||
//     normalizedMajor.includes("program") ||
//     normalizedMajor.includes("software")
//   ) {
//     return majorJobDatabase["computer science"]
//   } else if (normalizedMajor.includes("engin")) {
//     return majorJobDatabase["engineering"]
//   } else if (
//     normalizedMajor.includes("busi") ||
//     normalizedMajor.includes("admin") ||
//     normalizedMajor.includes("manage")
//   ) {
//     return majorJobDatabase["business"]
//   } else if (normalizedMajor.includes("bio") || normalizedMajor.includes("life") || normalizedMajor.includes("organ")) {
//     return majorJobDatabase["biology"]
//   } else if (normalizedMajor.includes("psych") || normalizedMajor.includes("behav")) {
//     return majorJobDatabase["psychology"]
//   } else if (
//     normalizedMajor.includes("art") ||
//     normalizedMajor.includes("design") ||
//     normalizedMajor.includes("creat")
//   ) {
//     return majorJobDatabase["art"]
//   } else if (normalizedMajor.includes("math") || normalizedMajor.includes("statistic")) {
//     return majorJobDatabase["mathematics"]
//   }

//   // If no match found, return a default set of general careers
//   return [
//     "Project Manager",
//     "Customer Success Manager",
//     "Sales Representative",
//     "Administrative Assistant",
//     "Operations Manager",
//   ]
// }

// // Simulated database of majors and related job categories
// const majorJobDatabase: Record<string, string[]> = {
//   "computer science": [
//     "Software Developer",
//     "Data Scientist",
//     "Web Developer",
//     "Systems Analyst",
//     "Database Administrator",
//   ],
//   business: [
//     "Marketing Manager",
//     "Financial Analyst",
//     "Management Consultant",
//     "Human Resources Specialist",
//     "Business Development Manager",
//   ],
//   psychology: [
//     "Clinical Psychologist",
//     "School Counselor",
//     "Human Resources Specialist",
//     "Market Research Analyst",
//     "Social Worker",
//   ],
//   engineering: [
//     "Mechanical Engineer",
//     "Civil Engineer",
//     "Electrical Engineer",
//     "Chemical Engineer",
//     "Industrial Engineer",
//   ],
//   biology: [
//     "Research Scientist",
//     "Healthcare Administrator",
//     "Pharmaceutical Sales",
//     "Laboratory Technician",
//     "Environmental Scientist",
//   ],
//   english: [
//     "Content Writer",
//     "Editor",
//     "Public Relations Specialist",
//     "Technical Writer",
//     "Marketing Communications Manager",
//   ],
//   communications: [
//     "Public Relations Specialist",
//     "Social Media Manager",
//     "Journalist",
//     "Marketing Coordinator",
//     "Corporate Communications Manager",
//   ],
//   education: ["Teacher", "School Administrator", "Curriculum Developer", "Education Consultant", "Corporate Trainer"],
//   nursing: [
//     "Registered Nurse",
//     "Nurse Practitioner",
//     "Clinical Nurse Specialist",
//     "Nurse Educator",
//     "Healthcare Administrator",
//   ],
//   economics: ["Economist", "Financial Analyst", "Market Research Analyst", "Data Analyst", "Management Consultant"],
//   art: ["Graphic Designer", "Art Director", "Illustrator", "UI/UX Designer", "Multimedia Artist"],
//   history: ["Museum Curator", "Archivist", "History Teacher", "Research Analyst", "Historical Consultant"],
//   physics: ["Physicist", "Research Scientist", "Data Analyst", "Laboratory Technician", "Engineering Consultant"],
//   chemistry: [
//     "Chemist",
//     "Research Scientist",
//     "Laboratory Technician",
//     "Pharmaceutical Researcher",
//     "Quality Control Specialist",
//   ],
//   mathematics: ["Statistician", "Data Scientist", "Actuary", "Operations Research Analyst", "Mathematician"],
//   finance: ["Financial Analyst", "Investment Banker", "Financial Advisor", "Portfolio Manager", "Risk Analyst"],
//   marketing: [
//     "Marketing Manager",
//     "Brand Manager",
//     "Marketing Research Analyst",
//     "Digital Marketing Specialist",
//     "Social Media Manager",
//   ],
//   music: ["Music Teacher", "Sound Engineer", "Music Producer", "Composer/Arranger", "Music Therapist"],
//   "political science": [
//     "Policy Analyst",
//     "Legislative Assistant",
//     "Political Campaign Manager",
//     "Public Relations Specialist",
//     "Government Affairs Director",
//   ],
//   sociology: [
//     "Social Worker",
//     "Human Resources Specialist",
//     "Community Service Manager",
//     "Market Research Analyst",
//     "Diversity and Inclusion Specialist",
//   ],
// }

'use server';

interface WikipediaSearchResult {
  title: string;
  snippet: string;
}

interface WikipediaResponse {
  query: {
    search: WikipediaSearchResult[];
  };
}

interface Job {
  title: string;
  description: string;
  salary: string;
  growth: string;
}

export async function findJobsForMajor(major: string): Promise<Job[]> {
  try {
    // Normalize the major input
    const normalizedMajor = major.toLowerCase().trim();

    // Create a search query that's likely to return career-related results
    const searchQuery = `${normalizedMajor} careers jobs professions`;

    // Construct the Wikipedia API URL
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`;

    console.log('Calling Wikipedia API:', apiUrl);

    // Make the API request
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        'Wikipedia API error:',
        response.status,
        response.statusText
      );
      return getFallbackJobsForMajor(normalizedMajor);
    }

    const data: WikipediaResponse = await response.json();

    // Process the Wikipedia search results to extract job details
    const searchResults = data.query.search;

    const jobDetails = extractJobDetailsFromWikipediaResults(
      searchResults,
      normalizedMajor
    );

    if (jobDetails.length >= 5) {
      return jobDetails.slice(0, 5);
    }

    // If we didn't get enough results, try a more general search for careers in the field
    const alternativeQuery = `careers in ${normalizedMajor}`;
    const alternativeUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(alternativeQuery)}&format=json&origin=*`;

    const altResponse = await fetch(alternativeUrl);
    if (altResponse.ok) {
      const altData: WikipediaResponse = await altResponse.json();
      const additionalDetails = extractJobDetailsFromWikipediaResults(
        altData.query.search,
        normalizedMajor
      );

      const combinedDetails = [
        ...new Set([...jobDetails, ...additionalDetails]),
      ];
      if (combinedDetails.length >= 5) {
        return combinedDetails.slice(0, 5);
      }
    }

    // If we still don't have enough results, fall back to our database
    if (jobDetails.length === 0) {
      return getFallbackJobsForMajor(normalizedMajor);
    }

    const fallbackJobs = getFallbackJobsForMajor(normalizedMajor);
    const remainingCount = 5 - jobDetails.length;

    return [...jobDetails, ...fallbackJobs.slice(0, remainingCount)];
  } catch (error) {
    console.error('Error fetching job data:', error);
    return getFallbackJobsForMajor(major);
  }
}

// Helper function to extract job details from Wikipedia search results
function extractJobDetailsFromWikipediaResults(
  results: WikipediaSearchResult[],
  major: string
): Job[] {
  const jobDetails: Job[] = [];

  for (const result of results) {
    const title = result.title;
    const snippet = result.snippet;
    const jobTitle = extractJobTitleFromSnippet(title);

    if (jobTitle) {
      const description = snippet
        .replace(/<span.*?>/g, '')
        .replace(/<\/span>/g, '');
      const salary = extractSalaryFromSnippet(description);
      const growth = extractGrowthFromSnippet(description);

      jobDetails.push({
        title: jobTitle,
        description,
        salary,
        growth,
      });

      // Stop processing once we have 5 job details
      if (jobDetails.length >= 5) break;
    }
  }

  return jobDetails;
}

// Function to extract a job title from a snippet
function extractJobTitleFromSnippet(title: string): string | null {
  const jobKeywords = [
    'engineer',
    'developer',
    'analyst',
    'manager',
    'specialist',
    'consultant',
    'designer',
    'director',
    'coordinator',
    'administrator',
    'scientist',
    'technician',
    'researcher',
    'teacher',
    'professor',
    'advisor',
  ];

  for (const keyword of jobKeywords) {
    if (title.toLowerCase().includes(keyword)) {
      return title
        .replace(/$$.*?$$/g, '')
        .replace(/\[.*?\]/g, '')
        .trim();
    }
  }
  return null;
}

// Function to extract salary from snippet (basic placeholder)
function extractSalaryFromSnippet(description: string): string {
  // Placeholder: You can implement specific logic to extract salary information from description
  const salaryMatch = description.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/);
  return salaryMatch ? salaryMatch[0] : 'Not Available';
}

// Function to extract job growth from snippet (basic placeholder)
function extractGrowthFromSnippet(description: string): string {
  // Placeholder: You can implement specific logic to extract growth information from description
  const growthMatch = description.match(/growth rate of (\d+%)/);
  return growthMatch ? growthMatch[1] : 'Not Available';
}

// Fallback function that uses our local database
function getFallbackJobsForMajor(major: string): Job[] {
  const normalizedMajor = major.toLowerCase().trim();

  const fallbackJobs =
    majorJobDatabase[normalizedMajor] || majorJobDatabase['general'];

  return fallbackJobs.map(title => ({
    title,
    description: 'Job description not available.',
    salary: 'Not Available',
    growth: 'Not Available',
  }));
}

// Simulated database of majors and related job categories
const majorJobDatabase: Record<string, string[]> = {
  'computer science': [
    'Software Developer',
    'Data Scientist',
    'Web Developer',
    'Systems Analyst',
    'Database Administrator',
  ],
  business: [
    'Marketing Manager',
    'Financial Analyst',
    'Management Consultant',
    'Human Resources Specialist',
    'Business Development Manager',
  ],
  psychology: [
    'Clinical Psychologist',
    'School Counselor',
    'Human Resources Specialist',
    'Market Research Analyst',
    'Social Worker',
  ],
  engineering: [
    'Mechanical Engineer',
    'Civil Engineer',
    'Electrical Engineer',
    'Chemical Engineer',
    'Industrial Engineer',
  ],
  biology: [
    'Research Scientist',
    'Healthcare Administrator',
    'Pharmaceutical Sales',
    'Laboratory Technician',
    'Environmental Scientist',
  ],
  general: [
    'Project Manager',
    'Customer Success Manager',
    'Sales Representative',
    'Administrative Assistant',
    'Operations Manager',
  ],
};
