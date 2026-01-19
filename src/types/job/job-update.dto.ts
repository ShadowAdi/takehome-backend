export interface UpdateJobDTO {
  jobTitle?: string;
  jobDescription?: string;
  jobRole?: "frontend" | "backend" | "fullstack" | "mobile" | "data" | "embed" | "other" | string;
  experience?: {
    minMonths?: number;
    maxMonths?: number;
  }
  techStack?: string[];
  employmentType?: "internship" | "full-time" | "contract" | "part-time";
  location?: string;
  lastDateToApply?: Date;
  status?: "draft" | "open" | "archived" | "closed";
}