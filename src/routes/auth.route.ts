import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { loginUserValidator } from "../validator/auth.validator";

export const authRouter = Router();

// Login user
authRouter.post(
    "/login", 
    loginUserValidator, 
    validate, 
    AuthController.loginCompany.bind(AuthController)
);

// Get authenticated user
authRouter.get(
    "/me", 
    AuthMiddleware, 
    AuthController.getAuthenticatedUser.bind(AuthController)
);