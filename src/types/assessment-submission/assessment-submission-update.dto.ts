export interface AssessmentSubmissionUpdateDTO {
    status?: "submitted" | "under_review" | "rejected" | "selected" | "on_hold";
    
    score?: number;
    feedback?: string;

    decision?: {
        outcome: "reject" | "select" | "hold";
        messageToCandidate?: string;
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

    evaluatedAt?: Date;
}
