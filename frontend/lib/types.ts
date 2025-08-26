export interface StudentData {
  age: number;
  university: string;
  major: string;
}

export interface CourseData {
  code: string;
  name: string;
  credits: number;
}

export interface SemesterData {
  courses: CourseData[];
  opportunities: string[];
  volunteerWork: string[];
  internships: string[];
  projects: string[];
  totalCredits: number;
  tuition: number;
}

export interface YearData {
  fall: SemesterData;
  spring: SemesterData;
  totalCost: number;
}

export interface RoadmapData {
  university: string;
  major: string;
  years: {
    year1: YearData;
    year2: YearData;
    year3: YearData;
    year4: YearData;
  };
  totalDegreeCredits: number;
  totalDegreeCost: number;
}
