import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { validate } from '../middlewares/validation.middleware';
import {
    createAssessmentValidator,
    updateAssessmentValidator,
    getAssessmentByIdValidator,
    getAssessmentByUniqueIdValidator,
    deleteAssessmentValidator,
    getAssessmentsByJobIdValidator,
    getAssessmentsByCompanyIdValidator,
    updateAssessmentStatusValidator,
    updateAssessmentAiValidator,
    generateAssessmentAiValidator
} from '../validator/assessment.validator';

export const assessmentRouter = Router();

// Create assessment for a job
assessmentRouter.post('/job/:jobId', getAssessmentsByJobIdValidator, validate, createAssessmentValidator, validate, AssessmentController.createAssessment);

assessmentRouter.post('/job/generate/:jobId', generateAssessmentAiValidator, validate, AssessmentController.createAssessmentByAI);

// Get all assessments by job ID
assessmentRouter.get('/job/:jobId', getAssessmentsByJobIdValidator, validate, AssessmentController.getAllAssessmentsByJob);

// Get all assessments by company ID
assessmentRouter.get('/company/:companyId', getAssessmentsByCompanyIdValidator, validate, AssessmentController.getAllAssessmentsByCompanyId);

// Get assessment by unique ID
assessmentRouter.get('/unique/:uniqueId', getAssessmentByUniqueIdValidator, validate, AssessmentController.getSingleAssessmentByUniqueId);

// Get assessment by ID
assessmentRouter.get('/:assessmentId', getAssessmentByIdValidator, validate, AssessmentController.getSingleAssessment);

// Update assessment
assessmentRouter.patch('/:assessmentId', updateAssessmentValidator, validate, AssessmentController.updateAssessment);

assessmentRouter.patch('/update/ai/:assessmentId', updateAssessmentAiValidator, validate, AssessmentController.updateAssessmentByAi);


// Delete assessment
assessmentRouter.delete('/:assessmentId', deleteAssessmentValidator, validate, AssessmentController.deleteAssessment);

assessmentRouter.patch('update/:assessmentId', updateAssessmentStatusValidator, validate, AssessmentController.updateAssessmentStatus);

assessmentRouter.get('get-draft/:jobId', getAssessmentsByJobIdValidator, validate, AssessmentController.getDraftAssessments);
