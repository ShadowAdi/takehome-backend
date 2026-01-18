import { logger } from "../config/logger";
import { Job } from "../models/job.model";
import { CreateJobDTO } from "../types/job/job-create.dto";
import { AppError } from "../utils/AppError";

class JobService {
    async createJob(payload: CreateJobDTO) {
        try {
            const exists = await Job.findOne({
                jobTitle: payload.jobTitle
            });

            const now = new Date();

            if (exists && now > exists.lastDateToApply) {
                logger.error("Job application attempted after deadline", {
                    jobId: exists._id,
                    lastDateToApply: exists.lastDateToApply
                });

                throw new AppError(
                    "Applications for this job are closed.",
                    409
                );
            }


            const job = await Job.create({
                ...payload,
            });

            return job
        } catch (error: any) {
            logger.error(`Failed to create job service: ${error.message}`);
            console.error(`Failed to create job service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async getAllJobs() {
        try {
            const jobs = await Job.find()
            return {
                jobs,
                totalJobs: jobs.length
            }
        } catch (error: any) {
            logger.error(`Failed to get all jobs service: ${error.message}`);
            console.error(`Failed to get all jobs service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async getJob(jobId: string) {
        try {
            const job = await Job.findById(jobId)
            return job
        } catch (error: any) {
            logger.error(`Failed to get job by id:${jobId}  error: ${error.message}`);
            console.error(`Failed to get job by id:${jobId} error: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}