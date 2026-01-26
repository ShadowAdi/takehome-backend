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

            const job = await Job.create({
                ...payload
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

    async updateJob(jobId: string, updateJob: UpdateJobDTO, companyId: string) {
        try {
            const getJob = await Job.findById(jobId)
            if (!getJob) {
                logger.error(`Job with id: ${jobId} not found`);
                console.error(`Job with id: ${jobId} not found`);
                throw new AppError(`Job with id: ${jobId} not found`, 404);
            }

            // Authorization check: ensure the job belongs to the company
            if (getJob.createdBy.toString() !== companyId) {
                logger.error(`Unauthorized: Company ${companyId} trying to update job ${jobId} owned by ${getJob.createdBy}`);
                throw new AppError("Unauthorized: You can only update your own jobs", 403);
            }

            if (updateJob.techStack && updateJob.techStack.length > 0) {
                const mergedTechStack = Array.from(
                    new Set([...getJob.techStack, ...updateJob.techStack])
                );

                updateJob.techStack = mergedTechStack;
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

    async deleteJob(jobId: string, companyId: string) {
        try {
            const getJob = await Job.findById(jobId);
            if (!getJob) {
                logger.error(`Job with id: ${jobId} not found`);
                console.error(`Job with id: ${jobId} not found`);
                throw new AppError(`Job with id: ${jobId} not found`, 404);
            }

            // Authorization check: ensure the job belongs to the company
            if (getJob.createdBy.toString() !== companyId) {
                logger.error(`Unauthorized: Company ${companyId} trying to delete job ${jobId} owned by ${getJob.createdBy}`);
                throw new AppError("Unauthorized: You can only delete your own jobs", 403);
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

    async updateStatus(jobId: string, status: string, companyId: string) {
        try {
            const getJob = await Job.findById(jobId)
            if (!getJob) {
                logger.error(`Job with id: ${jobId} not found`);
                console.error(`Job with id: ${jobId} not found`);
                throw new AppError(`Job with id: ${jobId} not found`, 404);
            }

            // Authorization check: ensure the job belongs to the company
            if (getJob.createdBy.toString() !== companyId) {
                logger.error(`Unauthorized: Company ${companyId} trying to update status of job ${jobId} owned by ${getJob.createdBy}`);
                throw new AppError("Unauthorized: You can only update status of your own jobs", 403);
            }

            if (getJob.status === status) {
                logger.error(`Job has already same status`);
                console.error(`Job has already same status`);
                throw new AppError(`Job has already same status`, 400);
            }

            const updatedJob = await Job.findByIdAndUpdate(
                jobId,
                { status },
                {
                    new: true
                }
            );

            return updatedJob;
        } catch (error: any) {
            logger.error(`Failed to update job status by id:${jobId}  error: ${error.message}`);
            console.error(`Failed to update job status by id:${jobId} error: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async getAllJobsByCompanyId(companyId: string) {
        try {
            const jobs = await Job.find({
                createdBy: companyId
            })
            return {
                jobs,
                totalJobs: jobs.length
            }
        } catch (error: any) {
            logger.error(`Failed to get all jobs by company id service: ${error.message}`);
            console.error(`Failed to get all jobs by company id service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}

export const jobService = new JobService();
