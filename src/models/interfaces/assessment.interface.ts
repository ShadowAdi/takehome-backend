export interface IAssessment extends Document {
    title: string;
    jobId: string;
    problem_description: string;
    allowedTechStack?: string;
    instructions?: string;
    constraints?: string;


    companyId: string;

    expectedDurationHours?: number;
    submissionDeadlineDays?: number;

    submissionRequirements?: {
        githubUrl?: {
            required: boolean;
            description: string;
        };

        deployedUrl?: {
            required: boolean;
            description: string;
        };

        videoDemo?: {
            required: boolean;
            platform: string;
            description: string;
        };

        documentation?: {
            required: boolean;
            description: string;
        };

        otherUrls?: {
            label: string;
            required: boolean;
            description: string;
        }[];

        additionalInfo?: {
            required: boolean;
            placeholder: string;
            maxLength: number;
        };
    };

    uniqueId: string;

    limitations?: string;

    evaluation?: string;

    status: "draft" | "active" | "closed";

    type:"manual" | "ai"

    createdAt: Date;
    updatedAt: Date;
}