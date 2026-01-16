export interface GetJobDTO {
  id: string;
  createdBy: string;
  jobTitle: string;
  jobDescription: string;
  jobRole: string;
  seniorityLevel: string;
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
  seniorityLevel?: string;
  employmentType?: string;
  location?: string;
  status?: string;
  techStack?: string;
}