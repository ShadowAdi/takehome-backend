import { NextFunction, Request, Response } from "express";
import { CreateAssessmentDto } from "../types/assessment/assessment-create.dto";
import { assessmentService } from "../services/assessment.service";
import { logger } from "../config/logger";


class AssessmentControllerClass {
    async createAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params
            if (Array.isArray(jobId)) {
                throw new Error("Invalid identifier parameter");
            }
            const { payload, companyId }: { payload: CreateAssessmentDto, companyId: string } = req.body;
            const job = await assessmentService.createAssessment(payload, jobId, companyId);

            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: job,
            });
        } catch (error) {
            logger.error(`Failed to create job: ${error}`);
            console.error(`Failed to create job: ${error}`);
            next(error);
        }
    }
}

export const AssessmentController = new AssessmentControllerClass();
