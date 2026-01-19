import { body, param } from 'express-validator/lib/middlewares/validation-chain-builders.js';

export const createCompanyValidator = [
    body('company_name')
        .notEmpty()
        .withMessage('Company name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters')
        .trim(),

    body('company_email')
        .notEmpty()
        .withMessage('Company email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('company_description')
        .notEmpty()
        .withMessage('Company description is required')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Company description must be between 10 and 1000 characters')
        .trim(),

    body('address.street')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Street address must be between 1 and 200 characters')
        .trim(),

    body('address.city')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('City must be between 1 and 100 characters')
        .trim(),

    body('address.state')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('State must be between 1 and 100 characters')
        .trim(),

    body('address.country')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Country must be between 1 and 100 characters')
        .trim(),

    body('address.postal_code')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Postal code must be between 1 and 20 characters')
        .trim(),

    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL'),

    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),

    body('company_logo')
        .optional()
        .isURL()
        .withMessage('Please provide a valid logo URL'),

    body('industury')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Industry must be between 1 and 100 characters')
        .trim(),

    body('company_linkedin')
        .optional()
        .isURL()
        .withMessage('Please provide a valid LinkedIn URL'),

    body('founder_email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid founder email address')
        .normalizeEmail(),

    body('founder_name')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Founder name must be between 1 and 100 characters')
        .trim(),
];

export const updateCompanyValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid company ID'),

    body('company_name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Company name must be between 2 and 100 characters')
        .trim(),

    body('company_description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Company description must be between 10 and 1000 characters')
        .trim(),

    // Optional address fields
    body('address.street')
        .optional()
        .isLength({ min: 1, max: 200 })
        .withMessage('Street address must be between 1 and 200 characters')
        .trim(),

    body('address.city')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('City must be between 1 and 100 characters')
        .trim(),

    body('address.state')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('State must be between 1 and 100 characters')
        .trim(),

    body('address.country')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Country must be between 1 and 100 characters')
        .trim(),

    body('address.postal_code')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('Postal code must be between 1 and 20 characters')
        .trim(),

    body('website')
        .optional()
        .isURL()
        .withMessage('Please provide a valid website URL'),

    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),

    body('company_logo')
        .optional()
        .isURL()
        .withMessage('Please provide a valid logo URL'),

    body('industury')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Industry must be between 1 and 100 characters')
        .trim(),

    body('company_linkedin')
        .optional()
        .isURL()
        .withMessage('Please provide a valid LinkedIn URL'),

    body('founder_email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid founder email address')
        .normalizeEmail(),

    body('founder_name')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Founder name must be between 1 and 100 characters')
        .trim(),
];

export const getCompanyByIdValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid company ID'),
];

export const findOneCompanyValidator = [
    param('identifier')
        .notEmpty()
        .withMessage('Identifier (email or company name) is required')
        .trim(),
];

export const deleteCompanyValidator = [
    param('id')
        .isMongoId()
        .withMessage('Please provide a valid company ID'),
];
