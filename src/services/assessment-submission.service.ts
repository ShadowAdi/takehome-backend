import { logger } from "../config/logger";
import { AssessmentSubmission } from "../models/assessment-submission.model";
import { AssessmentSubmissionCreateDTO } from "../types/assessment-submission/assessment-submission-create.dto";
import { AppError } from "../utils/AppError";
import { assessmentService } from "./assessment.service";

class AssessmentSubmissionServiceClass {

    private validateSubmissionRequirements(
        requirements: any,
        submissionData: AssessmentSubmissionCreateDTO["submissionData"]
    ) {
        // GitHub URL
        if (requirements.githubUrl?.required && !submissionData.githubUrl) {
            logger.error("GitHub URL is required but not provided")
            throw new AppError("GitHub URL is required", 400);
        }

        // Deployed URL
        if (requirements.deployedUrl?.required && !submissionData.deployedUrl) {
            logger.error("Deployed URL is required but not provided")
            throw new AppError("Deployed URL is required", 400);
        }

        // Video Demo
        if (requirements.videoDemo?.required && !submissionData.videoDemoUrl) {
            logger.error("Video demo URL is required but not provided")
            throw new AppError("Video demo URL is required", 400);
        }

        // Documentation
        if (requirements.documentation?.required && !submissionData.documentationUrl) {
            logger.error("Documentation URL is required but not provided")
            throw new AppError("Documentation URL is required", 400);
        }

        // Other URLs (array-based validation)
        if (requirements.otherUrls?.length) {
            for (const req of requirements.otherUrls) {
                if (req.required) {
                    const found = submissionData.otherUrls?.some(
                        (u) => u.label === req.label && u.url
                    );

                    if (!found) {
                        logger.error(`Other URL "${req.label}" is required but not provided`)
                        throw new AppError(
                            `Other URL "${req.label}" is required`,
                            400
                        );
                    }
                }
            }
        }

        // Additional Info
        if (requirements.additionalInfo?.required) {
            if (!submissionData.additionalInfo) {
                logger.error("Additional information is required but not provided")
                throw new AppError("Additional information is required", 400);
            }

            if (
                requirements.additionalInfo.maxLength &&
                submissionData.additionalInfo.length >
                requirements.additionalInfo.maxLength
            ) {
                logger.error("Additional information exceeds maximum length")
                throw new AppError(
                    `Additional info must be under ${requirements.additionalInfo.maxLength} characters`,
                    400
                );
            }
        }
    }

    public async submitAssessmentSubmission(payload: AssessmentSubmissionCreateDTO, assessmentId: string) {
        try {
            const getAssignment = await assessmentService.getSingleAssessment(assessmentId)

            if (!getAssignment) {
                logger.error(`Assessment with ID ${assessmentId} not found`)
                throw new AppError('Assessment not found', 404)
            }

            if (getAssignment.status === "closed" || getAssignment.status === "draft") {
                logger.error(`Assessment with ID ${assessmentId} is closed or in draft`)
                throw new AppError('Assessment is closed or in draft', 400)
            }

            if (getAssignment.submissionRequirements) {
                this.validateSubmissionRequirements(
                    getAssignment.submissionRequirements,
                    payload.submissionData
                );
            }

            const submission = await AssessmentSubmission.create({
                ...payload,
                assessmentId: assessmentId,
                companyId: getAssignment.companyId,
                jobId: getAssignment.jobId,
            })
            return submission
        } catch (error) {
            console.error(`Failed to submit your assessment: ${error}`)
            logger.error(`Failed to submit your assessment: ${error}`)
            throw new AppError('Failed to submit your assessment', 500)
        }
    }
}

export const assessmentSubmissionService = new AssessmentSubmissionServiceClass();