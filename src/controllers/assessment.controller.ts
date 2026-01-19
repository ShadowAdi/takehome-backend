import { NextFunction, Request, Response } from "express";
import { CreateAssessmentDto } from "../types/assessment/assessment-create.dto";
import { UpdateAssessmentDto } from "../types/assessment/assessment-update.dto";
import { assessmentService } from "../services/assessment.service";
import { logger } from "../config/logger";
import { jobService } from "../services/job.service";
import { AppError } from "../utils/AppError";


class AssessmentControllerClass {
    async createAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params;
            if (Array.isArray(jobId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const { payload, companyId }: { payload: CreateAssessmentDto, companyId: string } = req.body;
            const assessment = await assessmentService.createAssessment(payload, jobId, companyId);

            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: assessment,
            });
        } catch (error) {
            logger.error(`Failed to create assessment: ${error}`);
            console.error(`Failed to create assessment: ${error}`);
            next(error);
        }
    }

    async createAssessmentByAI(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params;
            if (Array.isArray(jobId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const { companyId, instructionForAi }: { companyId: string, instructionForAi: string } = req.body;
            const assessment = await assessmentService.createAssessmentByAi(jobId, companyId, instructionForAi);

            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: assessment,
            });
        } catch (error) {
            logger.error(`Failed to create assessment by ai : ${error}`);
            console.error(`Failed to create assessment by ai: ${error}`);
            next(error);
        }
    }

    async getAllAssessmentsByJob(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params;
            if (Array.isArray(jobId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const assessments = await assessmentService.getAllAssessmentsByJob(jobId);

            res.status(200).json({
                success: true,
                message: "Assessments retrieved successfully",
                data: assessments,
            });
        } catch (error) {
            logger.error(`Failed to get assessments by job: ${error}`);
            console.error(`Failed to get assessments by job: ${error}`);
            next(error);
        }
    }

    async getAllAssessmentsByCompanyId(req: Request, res: Response, next: NextFunction) {
        try {
            const { companyId } = req.params;
            if (Array.isArray(companyId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const assessments = await assessmentService.getAllAssessmentsByCompanyId(companyId);

            res.status(200).json({
                success: true,
                message: "Assessments retrieved successfully",
                data: assessments,
            });
        } catch (error) {
            logger.error(`Failed to get assessments by company: ${error}`);
            console.error(`Failed to get assessments by company: ${error}`);
            next(error);
        }
    }

    async getSingleAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const assessment = await assessmentService.getSingleAssessment(assessmentId);

            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        } catch (error) {
            logger.error(`Failed to get assessment: ${error}`);
            console.error(`Failed to get assessment: ${error}`);
            next(error);
        }
    }

    async getSingleAssessmentByUniqueId(req: Request, res: Response, next: NextFunction) {
        try {
            const { uniqueId } = req.params;
            if (Array.isArray(uniqueId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const assessment = await assessmentService.getSingleAssessmentByUniqueId(uniqueId);

            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        } catch (error) {
            logger.error(`Failed to get assessment by unique ID: ${error}`);
            console.error(`Failed to get assessment by unique ID: ${error}`);
            next(error);
        }
    }

    async deleteAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const { companyId }: { companyId: string } = req.body;
            const result = await assessmentService.deleteAssignment(assessmentId, companyId);

            res.status(200).json({
                success: true,
                message: result,
            });
        } catch (error) {
            logger.error(`Failed to delete assessment: ${error}`);
            console.error(`Failed to delete assessment: ${error}`);
            next(error);
        }
    }

    async updateAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const { assessmentId } = req.params;
            if (Array.isArray(assessmentId)) {
                throw new AppError("Invalid identifier parameter", 400);
            }
            const { payload, companyId }: { payload: UpdateAssessmentDto, companyId: string } = req.body;
            const assessment = await assessmentService.updateAssessment(assessmentId, companyId, payload);

            res.status(200).json({
                success: true,
                message: "Assessment updated successfully",
                data: assessment,
            });
        } catch (error) {
            logger.error(`Failed to update assessment: ${error}`);
            console.error(`Failed to update assessment: ${error}`);
            next(error);
        }
    }
}

export const AssessmentController = new AssessmentControllerClass();
