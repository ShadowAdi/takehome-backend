import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { submissionService } from "../services/submission.service";
import { AppError } from "../utils/AppError";
import { AssessmentSubmissionUpdateDTO } from "../types/assessment-submission/assessment-submission-update.dto";

class SubmissionControllerClass {
    async getAllSubmissions(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            const { companyId } = req.body;

            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const submissions = await submissionService.getAllSubmissions(assessmentId, companyId);

            res.status(200).json({
                success: true,
                message: "Submissions retrieved successfully",
                data: submissions,
            });
        } catch (error) {
            logger.error(`Failed to get all submissions: ${error}`);
            console.error(`Failed to get all submissions: ${error}`);
            next(error);
        }
    }

    async getSubmissionById(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const submission = await submissionService.getSubmissionById(submissionId, companyId);

            res.status(200).json({
                success: true,
                message: "Submission retrieved successfully",
                data: submission,
            });
        } catch (error) {
            logger.error(`Failed to get submission by ID: ${error}`);
            console.error(`Failed to get submission by ID: ${error}`);
            next(error);
        }
    }

    async evaluateSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, ...evaluationData }: { companyId: string } & AssessmentSubmissionUpdateDTO = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const updatedSubmission = await submissionService.evaluateSubmission(
                submissionId,
                companyId,
                evaluationData
            );

            res.status(200).json({
                success: true,
                message: "Submission evaluated successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to evaluate submission: ${error}`);
            console.error(`Failed to evaluate submission: ${error}`);
            next(error);
        }
    }

    async rejectSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, feedback, score, messageToCandidate } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const updatedSubmission = await submissionService.rejectSubmission(
                submissionId,
                companyId,
                feedback,
                score,
                messageToCandidate
            );

            res.status(200).json({
                success: true,
                message: "Submission rejected successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to reject submission: ${error}`);
            console.error(`Failed to reject submission: ${error}`);
            next(error);
        }
    }

    async selectSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, feedback, score, messageToCandidate, nextSteps } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const updatedSubmission = await submissionService.selectSubmission(
                submissionId,
                companyId,
                feedback,
                score,
                messageToCandidate,
                nextSteps
            );

            res.status(200).json({
                success: true,
                message: "Submission selected successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to select submission: ${error}`);
            console.error(`Failed to select submission: ${error}`);
            next(error);
        }
    }

    async holdSubmission(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, feedback, score, messageToCandidate } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const updatedSubmission = await submissionService.holdSubmission(
                submissionId,
                companyId,
                feedback,
                score,
                messageToCandidate
            );

            res.status(200).json({
                success: true,
                message: "Submission put on hold successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to hold submission: ${error}`);
            console.error(`Failed to hold submission: ${error}`);
            next(error);
        }
    }

    async updateSubmissionStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, status } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            if (!status) {
                throw new AppError("Status is required", 400);
            }

            const validStatuses = ["submitted", "under_review", "rejected", "selected", "on_hold"];
            if (!validStatuses.includes(status)) {
                throw new AppError("Invalid status value", 400);
            }

            const updatedSubmission = await submissionService.updateSubmissionStatus(
                submissionId,
                companyId,
                status
            );

            res.status(200).json({
                success: true,
                message: "Submission status updated successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to update submission status: ${error}`);
            console.error(`Failed to update submission status: ${error}`);
            next(error);
        }
    }

    async addNextSteps(req: Request, res: Response, next: NextFunction) {
        try {
            const { submissionId } = req.params;
            const { companyId, nextSteps } = req.body;

            if (Array.isArray(submissionId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            if (!nextSteps) {
                throw new AppError("Next steps data is required", 400);
            }

            const updatedSubmission = await submissionService.addNextSteps(
                submissionId,
                companyId,
                nextSteps
            );

            res.status(200).json({
                success: true,
                message: "Next steps added successfully",
                data: updatedSubmission,
            });
        } catch (error) {
            logger.error(`Failed to add next steps: ${error}`);
            console.error(`Failed to add next steps: ${error}`);
            next(error);
        }
    }

    async getSubmissionsByStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            const { companyId, status } = req.body;

            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            if (!status) {
                throw new AppError("Status is required", 400);
            }

            const validStatuses = ["submitted", "under_review", "rejected", "selected", "on_hold"];
            if (!validStatuses.includes(status)) {
                throw new AppError("Invalid status value", 400);
            }

            const submissions = await submissionService.getSubmissionsByStatus(
                assessmentId,
                companyId,
                status
            );

            res.status(200).json({
                success: true,
                message: "Submissions retrieved successfully",
                data: submissions,
            });
        } catch (error) {
            logger.error(`Failed to get submissions by status: ${error}`);
            console.error(`Failed to get submissions by status: ${error}`);
            next(error);
        }
    }

    async getSubmissionStats(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            const { companyId } = req.body;

            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }

            if (!companyId) {
                throw new AppError("Company ID is required", 400);
            }

            const stats = await submissionService.getSubmissionStats(assessmentId, companyId);

            res.status(200).json({
                success: true,
                message: "Submission statistics retrieved successfully",
                data: stats,
            });
        } catch (error) {
            logger.error(`Failed to get submission stats: ${error}`);
            console.error(`Failed to get submission stats: ${error}`);
            next(error);
        }
    }
}

export const submissionController = new SubmissionControllerClass();
