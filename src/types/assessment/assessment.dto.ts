import { Types } from "mongoose";

export interface GetAssessmentPublicDTO {
    id: string;
    title: string;
    jobId: string | Types.ObjectId;
    companyId: string | Types.ObjectId;
    problem_description: string;
    allowedTechStack?: string;
    instructions?: string;
    constraints?: string;
    expectedDurationHours: number;
    submissionDeadlineDays: number;
    submissionRequirements: {
        githubUrl: {
            required: boolean;
            description: string
        },
        deployedUrl: {
            required: boolean;
            description: string
        },
        videoDemo: {
            required: boolean;
            description: string;
            platform: string;
        }
        documentation: {
            required: boolean;
            description: string
        },
        otherUrls: [{
            required: boolean;
            description: string;
            label: string
        }],
        additionalInfo: {
            required: boolean,
            placeholder: string,
            maxLength: number,
        }
    };
    limitations?: string;
    evaluation?: string;
    status?: "draft" | "active" | "closed";
    uniqueId:string;
    createdAt: Date;
    updatedAt: Date;
}