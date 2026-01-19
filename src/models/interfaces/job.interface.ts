import { Document, Types } from "mongoose";

export interface IJob extends Document {
  createdBy: Types.ObjectId;

  jobTitle: string;
  jobDescription: string;

  jobRole:
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "data"
  | "embed"
  | "other"
  | string;

  experience: string

  techStack: string[];

  employmentType?: "internship" | "full-time" | "contract" | "part-time";
  location?: string;

  lastDateToApply?: Date;

  status: "draft" | "open" | "archived" | "closed";

  createdAt: Date;
  updatedAt: Date;
}
