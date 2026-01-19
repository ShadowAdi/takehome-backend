import { NextFunction, Request, Response } from "express";
import { CreateJobDTO } from "../types/job/job-create.dto";
import { jobService } from "../services/job.service";
import { logger } from "../config/logger";

class JobControllerClass {
    async createJob(req: Request, res: Response, next: NextFunction) {
        try {
            const payload: CreateJobDTO = req.body;
            const job = await jobService.createJob(payload);

            res.status(201).json({
                success: true,
                message: "Job created successfully",
                data: job
            });
        } catch (error) {
            logger.error(`Failed to create job: ${error}`)
            console.error(`Failed to create job: ${error}`)
            next(error);
        }
    }

    async getAllJobs(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobs, totalJobs } = await jobService.getAllJobs()
            res.status(200).json({
                success: true,
                message: "Jobs retrieved successfully",
                jobs: jobs,
                totalJobs: totalJobs
            });
        } catch (error) {
            logger.error(`Failed to get all jobs: ${error}`)
            console.error(`Failed to get all job: ${error}`)
            next(error);
        }
    }

    async getJobById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (Array.isArray(id)) {
                throw new Error("Invalid identifier parameter");
            }
            const job = await jobService.getJob(id);

            res.status(200).json({
                success: true,
                message: "job retrieved successfully",
                data: job
            });
        } catch (error) {
            logger.error(`Failed to get job and error is: ${error}`)
            console.error(`Failed to get job and error is: ${error}`)
            next(error);
        }
    }


}

export const JobController = new JobControllerClass()