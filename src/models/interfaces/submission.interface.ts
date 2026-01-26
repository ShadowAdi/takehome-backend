import { Document, Types } from "mongoose";

export interface ISubmission extends Document {
    applicant: {
        name: string;
        email: string;
        phone?: string;
        location?: string;
        resumeUrl: string;
        linkedinUrl?: string;
        githubProfileUrl?: string;
        portfolioUrl?: string;
        coverLetter?: string;
        willingToRelocate?: boolean;
    };

    jobId: Types.ObjectId;
    assessmentId: Types.ObjectId;
    companyId: Types.ObjectId;

    submissionData: {
        githubUrl?: string;
        deployedUrl?: string;
        videoDemoUrl?: string;
        documentationUrl?: string;
        otherUrls?: {
            label: string;
            url: string;
        }[];
        additionalInfo?: string;
    };

    status: "submitted" | "under_review" | "evaluated" | "rejected";
    score?: number;
    feedback?: string;

    submittedAt: Date;
    evaluatedAt?: Date;
}
