import { NextFunction, Request, Response } from "express";
import { CreateJobDTO } from "../types/job/job-create.dto";
import { jobService } from "../services/job.service";
import { logger } from "../config/logger";
import { UpdateJobDTO } from "../types/job/job-update.dto";

class JobControllerClass {
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const company_id = req.user?.id;

      if (!company_id) {
        logger.error(`Company id not found in request`);
        console.error(`Company id not found in request`);
        throw new Error("Company id not found in request");
      }
      const payload = req.body;

      const job = await jobService.createJob({
        ...payload,
        createdBy: company_id
      });

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      logger.error(`Failed to create job: ${error}`);
      console.error(`Failed to create job: ${error}`);
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobs, totalJobs } = await jobService.getAllJobs();
      res.status(200).json({
        success: true,
        message: "Jobs retrieved successfully",
        jobs: jobs,
        totalJobs: totalJobs,
      });
    } catch (error) {
      logger.error(`Failed to get all jobs: ${error}`);
      console.error(`Failed to get all job: ${error}`);
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
        data: job,
      });
    } catch (error) {
      logger.error(`Failed to get job and error is: ${error}`);
      console.error(`Failed to get job and error is: ${error}`);
      next(error);
    }
  }

  async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        throw new Error("Invalid identifier parameter");
      }
      const company_id = req.user?.id;

      if (!company_id) {
        logger.error(`Company id not found in request`);
        console.error(`Company id not found in request`);
        throw new Error("Company id not found in request");
      }
      const updatePayload: UpdateJobDTO = req.body;
      const updatedJob = await jobService.updateJob(id, updatePayload, company_id);

      res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      });
    } catch (error) {
      logger.error(`Failed to update company and error is: ${error}`);
      console.error(`Failed to update company and error is: ${error}`);
      next(error);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        throw new Error("Invalid identifier parameter");
      }
      const company_id = req.user?.id;

      if (!company_id) {
        logger.error(`Company id not found in request`);
        console.error(`Company id not found in request`);
        throw new Error("Company id not found in request");
      }
      const message = await jobService.deleteJob(id, company_id);

      res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      logger.error(`Failed to delete job and error is: ${error}`);
      console.error(`Failed to delete job and error is: ${error}`);
      next(error);
    }
  }

  async updateJobStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (Array.isArray(id)) {
        throw new Error("Invalid identifier parameter");
      }
      const company_id = req.user?.id;

      if (!company_id) {
        logger.error(`Company id not found in request`);
        console.error(`Company id not found in request`);
        throw new Error("Company id not found in request");
      }
      const { status } = req.body as { status: string };
      const updatedJob = await jobService.updateStatus(id, status, company_id);

      res.status(200).json({
        success: true,
        message: `Job Status has been changed`,
        updatedJob,
      });
    } catch (error) {
      logger.error(`Failed to update job status and error is: ${error}`);
      console.error(`Failed to update job status and error is: ${error}`);
      next(error);
    }
  }

  async getAllJobsByCompanyId(req: Request, res: Response, next: NextFunction) {
    try {
      const company_id = req.user?.id;

      if (!company_id) {
        logger.error(`Company id not found in request`);
        console.error(`Company id not found in request`);
        throw new Error("Company id not found in request");
      }

      const { jobs, totalJobs } = await jobService.getAllJobsByCompanyId(company_id);
      res.status(200).json({
        success: true,
        message: "Jobs retrieved successfully",
        jobs: jobs,
        totalJobs: totalJobs,
      });
    } catch (error) {
      logger.error(`Failed to get all jobs: ${error}`);
      console.error(`Failed to get all job: ${error}`);
      next(error);
    }
  }
}

export const JobController = new JobControllerClass();
