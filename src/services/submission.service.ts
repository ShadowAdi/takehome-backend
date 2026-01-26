import { logger } from "../config/logger";
import { AssessmentSubmission } from "../models/assessment-submission.model";
import { AssessmentSubmissionCreateDTO } from "../types/assessment-submission/assessment-submission-create.dto";
import { AssessmentSubmissionUpdateDTO } from "../types/assessment-submission/assessment-submission-update.dto";
import { AppError } from "../utils/AppError";

class SubmissionServiceClass {

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


    public async getAllSubmissions(assessmentId: string, companyId: string) {
        try {
            const allSubmissions = await AssessmentSubmission.find({
                assessmentId: assessmentId,
                companyId: companyId
            }).populate('jobId').populate('assessmentId');

            return allSubmissions;
        } catch (error) {
            console.error(`Failed to get all submissions: ${error}`);
            logger.error(`Failed to get all submissions: ${error}`);
            throw new AppError('Failed to get all submissions', 500);
        }
    }

    public async getSubmissionById(submissionId: string, companyId: string) {
        try {
            const submission = await AssessmentSubmission.findOne({
                _id: submissionId,
                companyId: companyId
            }).populate('jobId').populate('assessmentId');

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId} and company: ${companyId}`);
                throw new AppError('Submission not found', 404);
            }

            return submission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to get submission by ID ${submissionId}: ${error}`);
            logger.error(`Failed to get submission by ID ${submissionId}: ${error}`);
            throw new AppError(`Failed to get submission`, 500);
        }
    }

    public async evaluateSubmission(
        submissionId: string,
        companyId: string,
        evaluationData: AssessmentSubmissionUpdateDTO
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            // Map decision outcome to status if decision is provided
            if (evaluationData.decision?.outcome) {
                switch (evaluationData.decision.outcome) {
                    case "reject":
                        evaluationData.status = "rejected";
                        break;
                    case "select":
                        evaluationData.status = "selected";
                        break;
                    case "hold":
                        evaluationData.status = "on_hold";
                        break;
                }

                // Set decidedAt if not provided
                if (!evaluationData.decision.decidedAt) {
                    evaluationData.decision.decidedAt = new Date();
                }
            }

            // Set evaluatedAt if status is being changed
            if (evaluationData.status && !evaluationData.evaluatedAt) {
                evaluationData.evaluatedAt = new Date();
            }

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: evaluationData },
                { new: true, runValidators: true }
            );

            logger.info(`Submission ${submissionId} evaluated successfully`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to evaluate submission ${submissionId}: ${error}`);
            logger.error(`Failed to evaluate submission ${submissionId}: ${error}`);
            throw new AppError('Failed to evaluate submission', 500);
        }
    }

    public async rejectSubmission(
        submissionId: string,
        companyId: string,
        feedback?: string,
        score?: number,
        messageToCandidate?: string
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            const updateData: AssessmentSubmissionUpdateDTO = {
                status: "rejected",
                feedback,
                score,
                evaluatedAt: new Date(),
                decision: {
                    outcome: "reject",
                    messageToCandidate,
                    decidedAt: new Date()
                }
            };

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            logger.info(`Submission ${submissionId} rejected successfully`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to reject submission ${submissionId}: ${error}`);
            logger.error(`Failed to reject submission ${submissionId}: ${error}`);
            throw new AppError('Failed to reject submission', 500);
        }
    }

    public async selectSubmission(
        submissionId: string,
        companyId: string,
        feedback?: string,
        score?: number,
        messageToCandidate?: string,
        nextSteps?: AssessmentSubmissionUpdateDTO['nextSteps']
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            const updateData: AssessmentSubmissionUpdateDTO = {
                status: "selected",
                feedback,
                score,
                evaluatedAt: new Date(),
                decision: {
                    outcome: "select",
                    messageToCandidate,
                    decidedAt: new Date()
                },
                nextSteps
            };

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            logger.info(`Submission ${submissionId} selected successfully`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to select submission ${submissionId}: ${error}`);
            logger.error(`Failed to select submission ${submissionId}: ${error}`);
            throw new AppError('Failed to select submission', 500);
        }
    }

    public async holdSubmission(
        submissionId: string,
        companyId: string,
        feedback?: string,
        score?: number,
        messageToCandidate?: string
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            const updateData: AssessmentSubmissionUpdateDTO = {
                status: "on_hold",
                feedback,
                score,
                evaluatedAt: new Date(),
                decision: {
                    outcome: "hold",
                    messageToCandidate,
                    decidedAt: new Date()
                }
            };

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            logger.info(`Submission ${submissionId} put on hold successfully`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to hold submission ${submissionId}: ${error}`);
            logger.error(`Failed to hold submission ${submissionId}: ${error}`);
            throw new AppError('Failed to hold submission', 500);
        }
    }

    public async updateSubmissionStatus(
        submissionId: string,
        companyId: string,
        status: "submitted" | "under_review" | "rejected" | "selected" | "on_hold"
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: { status } },
                { new: true, runValidators: true }
            );

            logger.info(`Submission ${submissionId} status updated to ${status}`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to update submission status ${submissionId}: ${error}`);
            logger.error(`Failed to update submission status ${submissionId}: ${error}`);
            throw new AppError('Failed to update submission status', 500);
        }
    }

    public async addNextSteps(
        submissionId: string,
        companyId: string,
        nextSteps: AssessmentSubmissionUpdateDTO['nextSteps']
    ) {
        try {
            const submission = await this.getSubmissionById(submissionId, companyId);

            if (!submission) {
                logger.error(`Submission not found for ID: ${submissionId}`);
                throw new AppError('Submission not found', 404);
            }

            const updatedSubmission = await AssessmentSubmission.findOneAndUpdate(
                { _id: submissionId, companyId: companyId },
                { $set: { nextSteps } },
                { new: true, runValidators: true }
            );

            logger.info(`Next steps added for submission ${submissionId}`);
            return updatedSubmission;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error(`Failed to add next steps for submission ${submissionId}: ${error}`);
            logger.error(`Failed to add next steps for submission ${submissionId}: ${error}`);
            throw new AppError('Failed to add next steps', 500);
        }
    }

    public async getSubmissionsByStatus(
        assessmentId: string,
        companyId: string,
        status: "submitted" | "under_review" | "rejected" | "selected" | "on_hold"
    ) {
        try {
            const submissions = await AssessmentSubmission.find({
                assessmentId,
                companyId,
                status
            }).populate('jobId').populate('assessmentId');

            return submissions;
        } catch (error) {
            console.error(`Failed to get submissions by status: ${error}`);
            logger.error(`Failed to get submissions by status: ${error}`);
            throw new AppError('Failed to get submissions by status', 500);
        }
    }

    public async getSubmissionStats(assessmentId: string, companyId: string) {
        try {
            const stats = await AssessmentSubmission.aggregate([
                {
                    $match: {
                        assessmentId: assessmentId as any,
                        companyId: companyId as any
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgScore: { $avg: '$score' }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            console.error(`Failed to get submission stats: ${error}`);
            logger.error(`Failed to get submission stats: ${error}`);
            throw new AppError('Failed to get submission stats', 500);
        }
    }
}

export const submissionService = new SubmissionServiceClass();
