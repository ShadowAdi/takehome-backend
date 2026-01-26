import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders.js';

export const createJobValidator = [
    body('jobTitle')
        .notEmpty()
        .withMessage('Job title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Job title must be between 3 and 200 characters')
        .trim(),

    body('jobDescription')
        .notEmpty()
        .withMessage('Job description is required')
        .isLength({ min: 20, max: 5000 })
        .withMessage('Job description must be between 20 and 5000 characters')
        .trim(),

    body('jobRole')
        .notEmpty()
        .withMessage('Job role is required'),

    body('experience')
        .notEmpty()
        .withMessage('Experience is required'),

    body('techStack')
        .notEmpty()
        .withMessage('Tech stack is required')
        .isArray({ min: 1 })
        .withMessage('Tech stack must be a non-empty array'),

    body('techStack.*')
        .isString()
        .withMessage('Each tech stack item must be a string')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tech stack item must be between 1 and 50 characters'),

    body('employmentType')
        .optional()
        .isIn(['internship', 'full-time', 'contract', 'part-time'])
        .withMessage('Employment type must be one of: internship, full-time, contract, part-time'),

    body('location')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('Location must be between 2 and 200 characters')
        .trim(),

    body('lastDateToApply')
        .optional()
];

export const updateJobValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid job ID'),

    body('jobTitle')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('Job title must be between 3 and 200 characters')
        .trim(),

    body('jobDescription')
        .optional()
        .isLength({ min: 20, max: 5000 })
        .withMessage('Job description must be between 20 and 5000 characters')
        .trim(),

    body('jobRole')
        .optional(),

    body('experience')
        .notEmpty()
        .withMessage('Experience is required'),

    body('techStack')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Tech stack must be a non-empty array'),

    body('techStack.*')
        .optional()
        .isString()
        .withMessage('Each tech stack item must be a string')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each tech stack item must be between 1 and 50 characters'),

    body('employmentType')
        .optional()
        .isIn(['internship', 'full-time', 'contract', 'part-time'])
        .withMessage('Employment type must be one of: internship, full-time, contract, part-time'),

    body('location')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('Location must be between 2 and 200 characters')
        .trim(),

    body('lastDateToApply')
        .optional()
        .isISO8601()
        .withMessage('Last date to apply must be a valid date')
        .toDate()
        .custom((value: any) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                throw new Error('Last date to apply cannot be in the past');
            }
            return true;
        }),

    body('status')
        .optional()
        .isIn(['draft', 'open', 'archived',"closed"])
        .withMessage('Status must be one of: draft, open, archived'),
];

export const getJobByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid job ID'),
];

export const deleteJobValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid job ID'),
];

export const updateJobStatusValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid job ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['draft', 'open', 'archived', "closed"])
        .withMessage('Status must be one of: draft, open, archived'),
];
