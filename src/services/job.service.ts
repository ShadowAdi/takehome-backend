import { logger } from "../config/logger";
import { Job } from "../models/job.model";
import { CreateJobDTO } from "../types/job/job-create.dto";
import { UpdateJobDTO } from "../types/job/job-update.dto";
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

            if (payload.experience && payload.experience.maxMonths < payload.experience.minMonths) {
                logger.error("Min months cant be more than max months", {
                    minMonths: payload.experience.minMonths,
                    maxMonths: payload.experience.maxMonths
                });

                throw new AppError(
                    "Min months cant be more than max months",
                    401
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

    async updateJob(jobId: string, updateJob: UpdateJobDTO) {
        try {
            const getJob = await Job.findById(jobId)
            if (!getJob) {
                logger.error(`Job with id: ${jobId} not found`);
                console.error(`Job with id: ${jobId} not found`);
                throw new AppError(`Job with id: ${jobId} not found`, 500);
            }
            if (updateJob.techStack && updateJob.techStack.length > 0) {
                const mergedTechStack = Array.from(
                    new Set([...getJob.techStack, ...updateJob.techStack])
                );

                updateJob.techStack = mergedTechStack;
            }

            if (updateJob.experience &&
                updateJob.experience.maxMonths !== undefined &&
                updateJob.experience.minMonths !== undefined &&
                updateJob.experience.maxMonths < updateJob.experience.minMonths) {
                logger.error("Min months cant be more than max months", {
                    minMonths: updateJob.experience.minMonths,
                    maxMonths: updateJob.experience.maxMonths
                });

                throw new AppError(
                    "Min months cant be more than max months",
                    401
                );
            }
            const updatedJob = await Job.findByIdAndUpdate(
                jobId,
                updateJob,
                { new: true }
            );

            return updatedJob;
        } catch (error: any) {
            logger.error(`Failed to update job by id:${jobId}  error: ${error.message}`);
            console.error(`Failed to update job by id:${jobId} error: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async deleteJob(jobId: string) {
        try {
            const getJob = await Job.exists({
                _id: jobId
            })
            if (!getJob) {
                logger.error(`Job with id: ${jobId} not found`);
                console.error(`Job with id: ${jobId} not found`);
                throw new AppError(`Job with id: ${jobId} not found`, 500);
            }

            await Job.findByIdAndDelete(
                jobId
            );

            return `Job with id: ${jobId} got deleted successfully`;
        } catch (error: any) {
            logger.error(`Failed to delete job by id:${jobId}  error: ${error.message}`);
            console.error(`Failed to delete job by id:${jobId} error: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}