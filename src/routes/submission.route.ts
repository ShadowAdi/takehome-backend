import { Router } from 'express';
import { submissionController } from '../controllers/submission.controller';
import { validate } from '../middlewares/validation.middleware';
import {
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

// Get all submissions for an assessment
submissionRouter.get(
    '/assessment/:assessmentId',
    getAllSubmissionsValidator,
    validate,
    submissionController.getAllSubmissions
);

// Get submission statistics for an assessment
submissionRouter.post(
    '/assessment/:assessmentId/stats',
    getSubmissionStatsValidator,
    validate,
    submissionController.getSubmissionStats
);

// Get submissions by status for an assessment
submissionRouter.post(
    '/assessment/:assessmentId/by-status',
    getSubmissionsByStatusValidator,
    validate,
    submissionController.getSubmissionsByStatus
);

// Get a single submission by ID
submissionRouter.get(
    '/:submissionId',
    getSubmissionByIdValidator,
    validate,
    submissionController.getSubmissionById
);

// Evaluate a submission (general evaluation)
submissionRouter.patch(
    '/:submissionId/evaluate',
    evaluateSubmissionValidator,
    validate,
    submissionController.evaluateSubmission
);

// Reject a submission
submissionRouter.patch(
    '/:submissionId/reject',
    rejectSubmissionValidator,
    validate,
    submissionController.rejectSubmission
);

// Select a submission
submissionRouter.patch(
    '/:submissionId/select',
    selectSubmissionValidator,
    validate,
    submissionController.selectSubmission
);

// Put a submission on hold
submissionRouter.patch(
    '/:submissionId/hold',
    holdSubmissionValidator,
    validate,
    submissionController.holdSubmission
);

// Update submission status
submissionRouter.patch(
    '/:submissionId/status',
    updateSubmissionStatusValidator,
    validate,
    submissionController.updateSubmissionStatus
);

// Add next steps to a submission
submissionRouter.patch(
    '/:submissionId/next-steps',
    addNextStepsValidator,
    validate,
    submissionController.addNextSteps
);
