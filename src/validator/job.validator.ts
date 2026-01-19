import { body, param } from 'express-validator';

export const createJobValidator = [
    body('createdBy')
        .notEmpty()
        .withMessage('Company ID (createdBy) is required')
        .isMongoId()
        .withMessage('Please provide a valid company ID'),

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
        .withMessage('Job role is required')
        .isIn(['frontend', 'backend', 'fullstack', 'mobile', 'data', 'embed', 'other'])
        .withMessage('Job role must be one of: frontend, backend, fullstack, mobile, data, embed, other'),

    body('experience.minMonths')
        .notEmpty()
        .withMessage('Minimum experience in months is required')
        .isInt({ min: 0, max: 600 })
        .withMessage('Minimum experience must be between 0 and 600 months')
        .toInt(),

    body('experience.maxMonths')
        .notEmpty()
        .withMessage('Maximum experience in months is required')
        .isInt({ min: 0, max: 600 })
        .withMessage('Maximum experience must be between 0 and 600 months')
        .toInt()
        .custom((value, { req }) => {
            if (value < req.body.experience?.minMonths) {
                throw new Error('Maximum experience cannot be less than minimum experience');
            }
            return true;
        }),

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
        .isISO8601()
        .withMessage('Last date to apply must be a valid date')
        .toDate()
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                throw new Error('Last date to apply cannot be in the past');
            }
            return true;
        }),
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
        .optional()
        .isIn(['frontend', 'backend', 'fullstack', 'mobile', 'data', 'embed', 'other'])
        .withMessage('Job role must be one of: frontend, backend, fullstack, mobile, data, embed, other'),

    body('experience.minMonths')
        .optional()
        .isInt({ min: 0, max: 600 })
        .withMessage('Minimum experience must be between 0 and 600 months')
        .toInt(),

    body('experience.maxMonths')
        .optional()
        .isInt({ min: 0, max: 600 })
        .withMessage('Maximum experience must be between 0 and 600 months')
        .toInt()
        .custom((value, { req }) => {
            if (req.body.experience?.minMonths !== undefined && value !== undefined) {
                if (value < req.body.experience.minMonths) {
                    throw new Error('Maximum experience cannot be less than minimum experience');
                }
            }
            return true;
        }),

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
        .custom((value) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (value < today) {
                throw new Error('Last date to apply cannot be in the past');
            }
            return true;
        }),

    body('status')
        .optional()
        .isIn(['draft', 'active', 'archived'])
        .withMessage('Status must be one of: draft, active, archived'),
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
        .isIn(['draft', 'active', 'archived'])
        .withMessage('Status must be one of: draft, active, archived'),
];
