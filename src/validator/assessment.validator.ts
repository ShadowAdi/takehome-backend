import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders.js';

export const createAssessmentValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .trim(),

    body('problem_description')
        .notEmpty()
        .withMessage('Problem description is required')
        .isLength({ min: 20, max: 10000 })
        .withMessage('Problem description must be between 20 and 10000 characters')
        .trim(),

    body('allowedTechStack')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Allowed tech stack must be between 1 and 500 characters')
        .trim(),

    body('instructions')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Instructions must be between 1 and 5000 characters')
        .trim(),

    body('constraints')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Constraints must be between 1 and 2000 characters')
        .trim(),

    body('expectedDurationHours')
        .notEmpty()
        .withMessage('Expected duration in hours is required')
        .isInt({ min: 0, max: 720 })
        .withMessage('Expected duration must be between 0 and 720 hours (30 days)')
        .toInt(),

    body('submissionDeadlineDays')
        .notEmpty()
        .withMessage('Submission deadline in days is required')
        .isInt({ min: 0, max: 365 })
        .withMessage('Submission deadline must be between 0 and 365 days')
        .toInt(),

    // Submission Requirements - githubUrl
    body('submissionRequirements.githubUrl.required')
        .notEmpty()
        .withMessage('GitHub URL requirement flag is required')
        .isBoolean()
        .withMessage('GitHub URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.githubUrl.description')
        .notEmpty()
        .withMessage('GitHub URL description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('GitHub URL description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - deployedUrl
    body('submissionRequirements.deployedUrl.required')
        .notEmpty()
        .withMessage('Deployed URL requirement flag is required')
        .isBoolean()
        .withMessage('Deployed URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.deployedUrl.description')
        .notEmpty()
        .withMessage('Deployed URL description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Deployed URL description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - videoDemo
    body('submissionRequirements.videoDemo.required')
        .notEmpty()
        .withMessage('Video demo requirement flag is required')
        .isBoolean()
        .withMessage('Video demo required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.videoDemo.description')
        .notEmpty()
        .withMessage('Video demo description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Video demo description must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.videoDemo.platform')
        .notEmpty()
        .withMessage('Video demo platform is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Video demo platform must be between 1 and 100 characters')
        .trim(),

    // Submission Requirements - documentation
    body('submissionRequirements.documentation.required')
        .notEmpty()
        .withMessage('Documentation requirement flag is required')
        .isBoolean()
        .withMessage('Documentation required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.documentation.description')
        .notEmpty()
        .withMessage('Documentation description is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Documentation description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - otherUrls (array validation)
    body('submissionRequirements.otherUrls')
        .notEmpty()
        .withMessage('Other URLs is required')
        .isArray()
        .withMessage('Other URLs must be an array'),

    body('submissionRequirements.otherUrls.*.required')
        .optional()
        .isBoolean()
        .withMessage('Other URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.otherUrls.*.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Other URL description must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.otherUrls.*.label')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Other URL label must be between 1 and 100 characters')
        .trim(),

    // Submission Requirements - additionalInfo
    body('submissionRequirements.additionalInfo.required')
        .notEmpty()
        .withMessage('Additional info requirement flag is required')
        .isBoolean()
        .withMessage('Additional info required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.additionalInfo.placeholder')
        .notEmpty()
        .withMessage('Additional info placeholder is required')
        .isLength({ min: 1, max: 500 })
        .withMessage('Additional info placeholder must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.additionalInfo.maxLength')
        .notEmpty()
        .withMessage('Additional info max length is required')
        .isInt({ min: 1, max: 10000 })
        .withMessage('Additional info max length must be between 1 and 10000')
        .toInt(),

    body('limitations')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Limitations must be between 1 and 2000 characters')
        .trim(),

    body('evaluation')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Evaluation criteria must be between 1 and 5000 characters')
        .trim(),

    body('status')
        .optional()
        .isIn(['draft', 'active', 'closed'])
        .withMessage('Status must be one of: draft, active, closed'),
];

export const updateAssessmentValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),

    body('title')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters')
        .trim(),

    body('problem_description')
        .optional()
        .isLength({ min: 20, max: 10000 })
        .withMessage('Problem description must be between 20 and 10000 characters')
        .trim(),

    body('allowedTechStack')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Allowed tech stack must be between 1 and 500 characters')
        .trim(),

    body('instructions')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Instructions must be between 1 and 5000 characters')
        .trim(),

    body('constraints')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Constraints must be between 1 and 2000 characters')
        .trim(),

    body('expectedDurationHours')
        .optional()
        .isInt({ min: 0, max: 720 })
        .withMessage('Expected duration must be between 0 and 720 hours (30 days)')
        .toInt(),

    body('submissionDeadlineDays')
        .optional()
        .isInt({ min: 0, max: 365 })
        .withMessage('Submission deadline must be between 0 and 365 days')
        .toInt(),

    // Submission Requirements - githubUrl (optional for update)
    body('submissionRequirements.githubUrl.required')
        .optional()
        .isBoolean()
        .withMessage('GitHub URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.githubUrl.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('GitHub URL description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - deployedUrl
    body('submissionRequirements.deployedUrl.required')
        .optional()
        .isBoolean()
        .withMessage('Deployed URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.deployedUrl.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Deployed URL description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - videoDemo
    body('submissionRequirements.videoDemo.required')
        .optional()
        .isBoolean()
        .withMessage('Video demo required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.videoDemo.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Video demo description must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.videoDemo.platform')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Video demo platform must be between 1 and 100 characters')
        .trim(),

    // Submission Requirements - documentation
    body('submissionRequirements.documentation.required')
        .optional()
        .isBoolean()
        .withMessage('Documentation required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.documentation.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Documentation description must be between 1 and 500 characters')
        .trim(),

    // Submission Requirements - otherUrls (array validation)
    body('submissionRequirements.otherUrls')
        .optional()
        .isArray()
        .withMessage('Other URLs must be an array'),

    body('submissionRequirements.otherUrls.*.required')
        .optional()
        .isBoolean()
        .withMessage('Other URL required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.otherUrls.*.description')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Other URL description must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.otherUrls.*.label')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Other URL label must be between 1 and 100 characters')
        .trim(),

    // Submission Requirements - additionalInfo
    body('submissionRequirements.additionalInfo.required')
        .optional()
        .isBoolean()
        .withMessage('Additional info required must be a boolean')
        .toBoolean(),

    body('submissionRequirements.additionalInfo.placeholder')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Additional info placeholder must be between 1 and 500 characters')
        .trim(),

    body('submissionRequirements.additionalInfo.maxLength')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('Additional info max length must be between 1 and 10000')
        .toInt(),

    body('limitations')
        .optional()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Limitations must be between 1 and 2000 characters')
        .trim(),

    body('evaluation')
        .optional()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Evaluation criteria must be between 1 and 5000 characters')
        .trim(),

    body('status')
        .optional()
        .isIn(['draft', 'active', 'closed'])
        .withMessage('Status must be one of: draft, active, closed'),
];

export const getAssessmentByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),
];

export const getAssessmentByUniqueIdValidator = [
    param('uniqueId')
        .notEmpty()
        .withMessage('Unique ID is required')
        .trim(),
];

export const deleteAssessmentValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),
];

export const updateAssessmentStatusValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid assessment ID'),

    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['draft', 'active', 'closed'])
        .withMessage('Status must be one of: draft, active, closed'),
];

export const getAssessmentsByJobIdValidator = [
    param('jobId')
        .isMongoId()
        .withMessage('Please provide a valid job ID'),
];

export const getAssessmentsByCompanyIdValidator = [
    param('companyId')
        .isMongoId()
        .withMessage('Please provide a valid company ID'),
];
