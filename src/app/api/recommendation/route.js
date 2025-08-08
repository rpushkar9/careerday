// import { NextResponse } from "next/server"

// export async function GET(req) {
//   const { searchParams } = new URL(req.url)
//   const major = searchParams.get("major") || "software engineer"

//   const APP_ID = process.env.ADZUNA_APP_ID
//   const APP_KEY = process.env.ADZUNA_APP_KEY

//   const encodedMajor = encodeURIComponent(major)

//   const apiUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=3&what=${encodedMajor}&content-type=application/json`

//   try {
//     const response = await fetch(apiUrl)
//     const data = await response.json()

//     const recommendedJobs = data.results.map((job) => ({
//       title: job.title,
//       description: job.description,
//       salary: job.salary_is_predicted === "1" ? `$${job.salary_max}` : "N/A",
//       growth: "N/A",
//     }))

//     return NextResponse.json(recommendedJobs)
//   } catch (error) {
//     console.error("Error fetching from Adzuna:", error)
//     return NextResponse.json({ error: "Failed to fetch job recommendations" }, { status: 500 })
//   }
// }
