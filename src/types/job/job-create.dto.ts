export interface CreateJobDTO {
  jobTitle: string;
  jobDescription: string;
  jobRole: "frontend" | "backend" | "fullstack" | "mobile" | "data" | "embed" | "other";
  seniorityLevel: "intern" | "junior" | "mid" | "senior";
  techStack: string[];
  employmentType?: "internship" | "full-time" | "contract" | "part-time";
  location?: string;
  lastDateToApply?: Date;
}