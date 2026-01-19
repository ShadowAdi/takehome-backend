export interface GetJobDTO {
  id: string;
  createdBy: string;
  jobTitle: string;
  jobDescription: string;
  jobRole: string;
  experience:string;
  techStack: string[];
  employmentType?: string;
  location?: string;
  lastDateToApply?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetJobsQueryDTO {
  page?: number;
  limit?: number;
  jobRole?: string;
  experience?: string
  employmentType?: string;
  location?: string;
  status?: string;
  techStack?: string;
}