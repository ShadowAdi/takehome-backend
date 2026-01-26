import { Router } from 'express';
import { submissionController } from '../controllers/submission.controller';
import { validate } from '../middlewares/validation.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import {
    createSubmissionValidator,
    getAllSubmissionsValidator,
    getSubmissionByIdValidator,
    evaluateSubmissionValidator,
    rejectSubmissionValidator,
    selectSubmissionValidator,
    holdSubmissionValidator,
    updateSubmissionStatusValidator,
    addNextStepsValidator,
    getSubmissionsByStatusValidator,
    getSubmissionStatsValidator
} from '../validator/submission.validator';

export const submissionRouter = Router();

// Submit a new submission (public - no authentication required)
submissionRouter.post(
    '/assessment/:assessmentId/submit',
    createSubmissionValidator,
    validate,
    submissionController.createSubmission
);

// Get all submissions for an assessment (authenticated)
submissionRouter.get(
    '/assessment/:assessmentId',
    AuthMiddleware,
    getAllSubmissionsValidator,
    validate,
    submissionController.getAllSubmissions
);

// Get submission statistics for an assessment (authenticated)
submissionRouter.post(
    '/assessment/:assessmentId/stats',
    AuthMiddleware,
    getSubmissionStatsValidator,
    validate,
    submissionController.getSubmissionStats
);

// Get submissions by status for an assessment (authenticated)
submissionRouter.post(
    '/assessment/:assessmentId/by-status',
    AuthMiddleware,
    getSubmissionsByStatusValidator,
    validate,
    submissionController.getSubmissionsByStatus
);

// Get a single submission by ID (authenticated)
submissionRouter.get(
    '/:submissionId',
    AuthMiddleware,
    getSubmissionByIdValidator,
    validate,
    submissionController.getSubmissionById
);

// Evaluate a submission (general evaluation) (authenticated)
submissionRouter.patch(
    '/:submissionId/evaluate',
    AuthMiddleware,
    evaluateSubmissionValidator,
    validate,
    submissionController.evaluateSubmission
);

// Reject a submission (authenticated)
submissionRouter.patch(
    '/:submissionId/reject',
    AuthMiddleware,
    rejectSubmissionValidator,
    validate,
    submissionController.rejectSubmission
);

// Select a submission (authenticated)
submissionRouter.patch(
    '/:submissionId/select',
    AuthMiddleware,
    selectSubmissionValidator,
    validate,
    submissionController.selectSubmission
);

// Put a submission on hold (authenticated)
submissionRouter.patch(
    '/:submissionId/hold',
    AuthMiddleware,
    holdSubmissionValidator,
    validate,
    submissionController.holdSubmission
);

// Update submission status (authenticated)
submissionRouter.patch(
    '/:submissionId/status',
    AuthMiddleware,
    updateSubmissionStatusValidator,
    validate,
    submissionController.updateSubmissionStatus
);

// Add next steps to a submission (authenticated)
submissionRouter.patch(
    '/:submissionId/next-steps',
    AuthMiddleware,
    addNextStepsValidator,
    validate,
    submissionController.addNextSteps
);
