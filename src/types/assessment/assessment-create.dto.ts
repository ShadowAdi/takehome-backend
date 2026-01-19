
export interface CreateAssessmentDto {
    title: string
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
}
