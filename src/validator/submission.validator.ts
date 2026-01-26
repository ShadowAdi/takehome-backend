import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders.js';

// Public route - no companyId needed
export const createSubmissionValidator = [
    param('assessmentId')
        .notEmpty()
        .withMessage('Assessment ID is required')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),

    body('candidateInfo.name')
        .notEmpty()
        .withMessage('Candidate name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim(),

    body('candidateInfo.email')
        .notEmpty()
        .withMessage('Candidate email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('candidateInfo.phone')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Phone must be between 1 and 20 characters')
        .trim(),

    body('candidateInfo.resume')
        .optional()
        .isURL()
        .withMessage('Resume must be a valid URL'),

    body('submissionData.githubUrl')
        .optional()
        .isURL()
        .withMessage('GitHub URL must be a valid URL'),

    body('submissionData.deployedUrl')
        .optional()
        .isURL()
        .withMessage('Deployed URL must be a valid URL'),

    body('submissionData.videoDemoUrl')
        .optional()
        .isURL()
        .withMessage('Video demo URL must be a valid URL'),

    body('submissionData.documentationUrl')
        .optional()
        .isURL()
        .withMessage('Documentation URL must be a valid URL'),

    body('submissionData.additionalInfo')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Additional info must be under 5000 characters')
        .trim()
];

// Authenticated route - companyId comes from req.user
export const getAllSubmissionsValidator = [
    param('assessmentId')
        .notEmpty()
        .withMessage('Assessment ID is required')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID')
];

// Authenticated route - companyId comes from req.user
export const getSubmissionByIdValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID')
];

// Authenticated route - companyId comes from req.user
export const evaluateSubmissionValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('status')
        .optional()
        .isIn(['submitted', 'under_review', 'rejected', 'selected', 'on_hold'])
        .withMessage('Status must be one of: submitted, under_review, rejected, selected, on_hold'),

    body('score')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be a number between 0 and 100')
        .toFloat(),

    body('feedback')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Feedback must be between 1 and 5000 characters')
        .trim(),

    body('decision.outcome')
        .optional()
        .isIn(['reject', 'select', 'hold'])
        .withMessage('Decision outcome must be one of: reject, select, hold'),

    body('decision.messageToCandidate')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message to candidate must be between 1 and 2000 characters')
        .trim(),

    body('decision.decidedAt')
        .optional()
        .isISO8601()
        .withMessage('Decided at must be a valid date')
        .toDate(),

    body('nextSteps.type')
        .optional()
        .isIn(['meeting', 'call', 'email', 'task'])
        .withMessage('Next steps type must be one of: meeting, call, email, task'),

    body('nextSteps.description')
        .optional()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Next steps description must be between 1 and 1000 characters')
        .trim(),

    body('nextSteps.meeting.platform')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Meeting platform must be between 1 and 100 characters')
        .trim(),

    body('nextSteps.meeting.meetingLink')
        .optional()
        .isURL()
        .withMessage('Meeting link must be a valid URL'),

    body('nextSteps.meeting.scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Scheduled at must be a valid date')
        .toDate(),

    body('nextSteps.meeting.durationMinutes')
        .optional()
        .isInt({ min: 1, max: 480 })
        .withMessage('Duration must be between 1 and 480 minutes')
        .toInt(),

    body('nextSteps.contact.email')
        .optional()
        .isEmail()
        .withMessage('Contact email must be a valid email address')
        .normalizeEmail(),

    body('nextSteps.contact.phone')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Contact phone must be between 1 and 20 characters')
        .trim(),

    body('nextSteps.task.title')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Task title must be between 1 and 200 characters')
        .trim(),

    body('nextSteps.task.instructions')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Task instructions must be between 1 and 5000 characters')
        .trim(),

    body('nextSteps.task.deadline')
        .optional()
        .isISO8601()
        .withMessage('Task deadline must be a valid date')
        .toDate(),

    body('evaluatedAt')
        .optional()
        .isISO8601()
        .withMessage('Evaluated at must be a valid date')
        .toDate()
];

// Authenticated route - companyId comes from req.user
export const rejectSubmissionValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('feedback')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Feedback must be between 1 and 5000 characters')
        .trim(),

    body('score')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be a number between 0 and 100')
        .toFloat(),

    body('messageToCandidate')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message to candidate must be between 1 and 2000 characters')
        .trim()
];

// Authenticated route - companyId comes from req.user
export const selectSubmissionValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('feedback')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Feedback must be between 1 and 5000 characters')
        .trim(),

    body('score')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be a number between 0 and 100')
        .toFloat(),

    body('messageToCandidate')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message to candidate must be between 1 and 2000 characters')
        .trim(),

    body('nextSteps.type')
        .optional()
        .isIn(['meeting', 'call', 'email', 'task'])
        .withMessage('Next steps type must be one of: meeting, call, email, task'),

    body('nextSteps.description')
        .optional()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Next steps description must be between 1 and 1000 characters')
        .trim(),

    body('nextSteps.meeting.platform')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Meeting platform must be between 1 and 100 characters')
        .trim(),

    body('nextSteps.meeting.meetingLink')
        .optional()
        .isURL()
        .withMessage('Meeting link must be a valid URL'),

    body('nextSteps.meeting.scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Scheduled at must be a valid date')
        .toDate(),

    body('nextSteps.meeting.durationMinutes')
        .optional()
        .isInt({ min: 1, max: 480 })
        .withMessage('Duration must be between 1 and 480 minutes')
        .toInt(),

    body('nextSteps.contact.email')
        .optional()
        .isEmail()
        .withMessage('Contact email must be a valid email address')
        .normalizeEmail(),

    body('nextSteps.contact.phone')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Contact phone must be between 1 and 20 characters')
        .trim(),

    body('nextSteps.task.title')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Task title must be between 1 and 200 characters')
        .trim(),

    body('nextSteps.task.instructions')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Task instructions must be between 1 and 5000 characters')
        .trim(),

    body('nextSteps.task.deadline')
        .optional()
        .isISO8601()
        .withMessage('Task deadline must be a valid date')
        .toDate()
];

// Authenticated route - companyId comes from req.user
export const holdSubmissionValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('feedback')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Feedback must be between 1 and 5000 characters')
        .trim(),

    body('score')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Score must be a number between 0 and 100')
        .toFloat(),

    body('messageToCandidate')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message to candidate must be between 1 and 2000 characters')
        .trim()
];

// Authenticated route - companyId comes from req.user
export const updateSubmissionStatusValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['submitted', 'under_review', 'rejected', 'selected', 'on_hold'])
        .withMessage('Status must be one of: submitted, under_review, rejected, selected, on_hold')
];

// Authenticated route - companyId comes from req.user
export const addNextStepsValidator = [
    param('submissionId')
        .notEmpty()
        .withMessage('Submission ID is required')
        .isMongoId()
        .withMessage('Please provide a valid submission ID'),

    body('nextSteps.type')
        .notEmpty()
        .withMessage('Next steps type is required')
        .isIn(['meeting', 'call', 'email', 'task'])
        .withMessage('Next steps type must be one of: meeting, call, email, task'),

    body('nextSteps.description')
        .optional()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Next steps description must be between 1 and 1000 characters')
        .trim(),

    body('nextSteps.meeting.platform')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Meeting platform must be between 1 and 100 characters')
        .trim(),

    body('nextSteps.meeting.meetingLink')
        .optional()
        .isURL()
        .withMessage('Meeting link must be a valid URL'),

    body('nextSteps.meeting.scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Scheduled at must be a valid date')
        .toDate(),

    body('nextSteps.meeting.durationMinutes')
        .optional()
        .isInt({ min: 1, max: 480 })
        .withMessage('Duration must be between 1 and 480 minutes')
        .toInt(),

    body('nextSteps.contact.email')
        .optional()
        .isEmail()
        .withMessage('Contact email must be a valid email address')
        .normalizeEmail(),

    body('nextSteps.contact.phone')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Contact phone must be between 1 and 20 characters')
        .trim(),

    body('nextSteps.task.title')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Task title must be between 1 and 200 characters')
        .trim(),

    body('nextSteps.task.instructions')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Task instructions must be between 1 and 5000 characters')
        .trim(),

    body('nextSteps.task.deadline')
        .optional()
        .isISO8601()
        .withMessage('Task deadline must be a valid date')
        .toDate()
];

// Authenticated route - companyId comes from req.user
export const getSubmissionsByStatusValidator = [
    param('assessmentId')
        .notEmpty()
        .withMessage('Assessment ID is required')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['submitted', 'under_review', 'rejected', 'selected', 'on_hold'])
        .withMessage('Status must be one of: submitted, under_review, rejected, selected, on_hold')
];

// Authenticated route - companyId comes from req.user
export const getSubmissionStatsValidator = [
    param('assessmentId')
        .notEmpty()
        .withMessage('Assessment ID is required')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID')
];
