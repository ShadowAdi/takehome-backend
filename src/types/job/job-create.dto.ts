import { Types } from "mongoose";

export interface CreateJobDTO {
  jobTitle: string;
  jobDescription: string;
  createdBy: string | Types.ObjectId;
  jobRole: "frontend" | "backend" | "fullstack" | "mobile" | "data" | "embed" | "other" |string;
  experience: {
    minMonths: number;
    maxMonths: number;
  }
  techStack: string[];
  employmentType?: "internship" | "full-time" | "contract" | "part-time";
  location?: string;
  lastDateToApply?: Date;
}