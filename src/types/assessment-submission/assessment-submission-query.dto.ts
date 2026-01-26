export interface AssessmentSubmissionQueryDTO {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    
    // Filter options
    jobId?: string;
    assessmentId?: string;
    companyId?: string;
    status?: "submitted" | "under_review" | "rejected" | "selected" | "on_hold";
    applicantEmail?: string;
    
    // Date range filters
    submittedAfter?: Date;
    submittedBefore?: Date;
    evaluatedAfter?: Date;
    evaluatedBefore?: Date;
}

export interface GetSubmissionsByJobDTO {
    jobId: string;
    page?: number;
    limit?: number;
    status?: "submitted" | "under_review" | "rejected" | "selected" | "on_hold";
}

export interface GetSubmissionsByAssessmentDTO {
    assessmentId: string;
    page?: number;
    limit?: number;
    status?: "submitted" | "under_review" | "rejected" | "selected" | "on_hold";
}

export interface AssessmentSubmissionListResponseDTO {
    submissions: AssessmentSubmissionDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Import for the response
import { AssessmentSubmissionDTO } from "./assessment-submission.dto";
