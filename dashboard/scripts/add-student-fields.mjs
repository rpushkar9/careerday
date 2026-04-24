/**
 * One-shot script: adds email, major, graduationYear, engagementTrend
 * to every rawStudents record in src/data/mock/students.ts
 *
 * Run: node scripts/add-student-fields.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "../src/data/mock/students.ts");

// Lookup table: id → { email, major, graduationYear, engagementTrend }
const additions = {
  "s-001": { email: "aisha.johnson@university.edu",   major: "Biomedical Engineering",      graduationYear: 2026, engagementTrend: "up" },
  "s-002": { email: "marcus.chen@university.edu",     major: "Computer Science",            graduationYear: 2027, engagementTrend: "stable" },
  "s-003": { email: "priya.patel@university.edu",     major: "Biology (Pre-Med)",           graduationYear: 2026, engagementTrend: "up" },
  "s-004": { email: "deshawn.williams@university.edu",major: "Undeclared",                  graduationYear: 2027, engagementTrend: "down" },
  "s-005": { email: "sofia.rodriguez@university.edu", major: "Nursing",                     graduationYear: 2027, engagementTrend: "down" },
  "s-006": { email: "tyler.kim@university.edu",       major: "Computer Science",            graduationYear: 2025, engagementTrend: "up" },
  "s-007": { email: "emma.thompson@university.edu",   major: "Undeclared",                  graduationYear: 2028, engagementTrend: "down" },
  "s-008": { email: "jordan.davis@university.edu",    major: "Construction Technology",     graduationYear: 2026, engagementTrend: "stable" },
  "s-009": { email: "olivia.martinez@university.edu", major: "Environmental Science",       graduationYear: 2025, engagementTrend: "up" },
  "s-010": { email: "liam.obrien@university.edu",     major: "Psychology",                  graduationYear: 2027, engagementTrend: "down" },
  "s-011": { email: "zara.ahmed@university.edu",      major: "Communications & Journalism", graduationYear: 2025, engagementTrend: "stable" },
  "s-012": { email: "noah.jackson@university.edu",    major: "Business Administration",     graduationYear: 2026, engagementTrend: "stable" },
  "s-013": { email: "mia.chang@university.edu",       major: "Data Science",                graduationYear: 2025, engagementTrend: "up" },
  "s-014": { email: "ethan.brown@university.edu",     major: "Undeclared",                  graduationYear: 2028, engagementTrend: "down" },
  "s-015": { email: "isabella.nguyen@university.edu", major: "Political Science",           graduationYear: 2026, engagementTrend: "stable" },
  "s-016": { email: "james.wilson@university.edu",    major: "Mechanical Engineering",      graduationYear: 2026, engagementTrend: "up" },
  "s-017": { email: "ava.lee@university.edu",         major: "Fine Arts",                   graduationYear: 2027, engagementTrend: "down" },
  "s-018": { email: "daniel.garcia@university.edu",   major: "Finance",                     graduationYear: 2025, engagementTrend: "up" },
  "s-019": { email: "chloe.taylor@university.edu",    major: "Education",                   graduationYear: 2026, engagementTrend: "stable" },
  "s-020": { email: "ryan.mitchell@university.edu",   major: "Undeclared",                  graduationYear: 2028, engagementTrend: "down" },
  "s-021": { email: "hannah.lewis@university.edu",    major: "Biochemistry",                graduationYear: 2025, engagementTrend: "up" },
  "s-022": { email: "brandon.scott@university.edu",   major: "Criminal Justice",            graduationYear: 2027, engagementTrend: "down" },
  "s-023": { email: "grace.white@university.edu",     major: "Nursing",                     graduationYear: 2025, engagementTrend: "up" },
  "s-024": { email: "alex.rivera@university.edu",     major: "Theater Arts",                graduationYear: 2026, engagementTrend: "down" },
  "s-025": { email: "natalie.foster@university.edu",  major: "Marketing",                   graduationYear: 2025, engagementTrend: "up" },
  "s-026": { email: "kevin.park@university.edu",      major: "Philosophy",                  graduationYear: 2027, engagementTrend: "stable" },
  "s-027": { email: "sarah.cooper@university.edu",    major: "Civil Engineering",           graduationYear: 2025, engagementTrend: "up" },
  "s-028": { email: "michael.adams@university.edu",   major: "History",                     graduationYear: 2027, engagementTrend: "down" },
  "s-029": { email: "emily.clark@university.edu",     major: "Graphic Design",              graduationYear: 2026, engagementTrend: "stable" },
  "s-030": { email: "david.hernandez@university.edu", major: "Architecture",                graduationYear: 2025, engagementTrend: "up" },
};

let source = readFileSync(filePath, "utf8");

// For each student, find the name: line and inject the four new fields after it.
// Pattern: the id line is immediately followed by name line.
for (const [id, fields] of Object.entries(additions)) {
  const nameLineRegex = new RegExp(
    `(    id: "${id}",\\n    name: "[^"]+",)`,
    "g",
  );
  const replacement = `$1\n    email: "${fields.email}",\n    major: "${fields.major}",\n    graduationYear: ${fields.graduationYear},\n    engagementTrend: "${fields.engagementTrend}" as const,`;
  const updated = source.replace(nameLineRegex, replacement);
  if (updated === source) {
    console.error(`❌  No match for ${id}`);
    process.exit(1);
  }
  source = updated;
}

// Update the top comment to mention new fields
source = source.replace(
  " * 30 mock student records. Raw data — no derived fields (engagementTier,\n * flaggedForAttention). Those are computed in the data-access layer.",
  " * 30 mock student records. Raw data — no derived fields (engagementTier,\n * flaggedForAttention). Those are computed in the data-access layer.\n *\n * New fields: email, major, graduationYear, engagementTrend."
);

writeFileSync(filePath, source, "utf8");
console.log("✅  All 30 records updated.");
