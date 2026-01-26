export interface AssessmentSubmissionCreateDTO {
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

    jobId: string;
    assessmentId: string;
    companyId: string;

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
}
