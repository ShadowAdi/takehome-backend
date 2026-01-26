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

    status: 
        | "submitted"
        | "under_review"
        | "rejected"
        | "selected"
        | "on_hold";

    score?: number;
    feedback?: string;

    decision?: {
        outcome: "reject" | "select" | "hold";
        messageToCandidate?: string; // shown on UI
        decidedAt?: Date;
    };

    nextSteps?: {
        type: "meeting" | "call" | "email" | "task";

        description?: string;

        meeting?: {
            platform: "Google Meet" | "Zoom" | "Teams" | string;
            meetingLink?: string;
            scheduledAt?: Date;
            durationMinutes?: number;
        };

        contact?: {
            email?: string;
            phone?: string;
        };

        task?: {
            title: string;
            instructions: string;
            deadline?: Date;
        };
    };

    submittedAt: Date;
    evaluatedAt?: Date;
}
