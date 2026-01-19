import { Router } from "express";
import { createJobValidator, deleteJobValidator, getJobByIdValidator, updateJobStatusValidator, updateJobValidator } from "../validator/job.validator";
import { validate } from "../middlewares/validation.middleware";
import { JobController } from "../controllers/job.controller";

export const jobRouter = Router();

jobRouter.post('/', createJobValidator, validate, JobController.createJob);

jobRouter.get('/', JobController.getAllJobs);

jobRouter.get('/:id', getJobByIdValidator, validate, JobController.getJobById);

jobRouter.patch('/update/status', updateJobStatusValidator, validate, JobController.updateJobStatus);

jobRouter.patch('/:id', updateJobValidator, validate, JobController.updateJob);

jobRouter.delete('/:id', deleteJobValidator, validate, JobController.deleteJob);


