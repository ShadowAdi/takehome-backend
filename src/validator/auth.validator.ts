import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { body } = require("express-validator");

export const loginUserValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
];