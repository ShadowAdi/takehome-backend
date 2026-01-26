import { Router } from "express";
import { createJobValidator, deleteJobValidator, getJobByIdValidator, updateJobStatusValidator, updateJobValidator } from "../validator/job.validator";
import { validate } from "../middlewares/validation.middleware";
import { JobController } from "../controllers/job.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export const jobRouter = Router();

jobRouter.post('/', AuthMiddleware, createJobValidator, validate, JobController.createJob);

jobRouter.get('/', JobController.getAllJobs);

jobRouter.get('/by-company/', AuthMiddleware, JobController.getAllJobsByCompanyId);

jobRouter.get('/:id', getJobByIdValidator, validate, JobController.getJobById);

jobRouter.patch('/status/:id', AuthMiddleware, updateJobStatusValidator, validate, JobController.updateJobStatus);

jobRouter.patch('/:id', AuthMiddleware, updateJobValidator, validate, JobController.updateJob);

jobRouter.delete('/:id', AuthMiddleware, deleteJobValidator, validate, JobController.deleteJob);