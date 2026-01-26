import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { logger } from "../config/logger";
import { LoginCompanyDto } from "../types/auth/LoginCompanyDto";

class AuthControllerClass {
    async loginCompany(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(`Login attempt for email: ${req.body.email}`);
            console.log(`Login attempt for email: ${req.body.email}`);
            
            const payload: LoginCompanyDto = req.body;
            const result = await AuthService.LoginCompany(payload);
            
            logger.info(`Company logged in successfully: ${result.user.id}`);
            console.log(`Company logged in successfully: ${result.user.id}`);
            
            res.status(200).json({
                success: true,
                message: "Company logged in successfully",
                data: result
            });
        } catch (error: any) {
            logger.error(`Failed to login Company controller: ${error.message}`);
            console.error(`Failed to login Company controller: ${error.message}`);
            next(error);
        }
    }

    async getAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
        try {
            const company_email = req.user?.email;
            
            if (!company_email) {
                logger.error(`Company email not found in request`);
                console.error(`Company email not found in request`);
                throw new Error("Company email not found in request");
            }

            logger.info(`Fetching authenticated Company data for: ${company_email}`);
            console.log(`Fetching authenticated Company data for: ${company_email}`);
            
            const user = await AuthService.getAuthenticatedCompany(company_email);
            
            logger.info(`Authenticated Company data retrieved successfully: ${user._id}`);
            console.log(`Authenticated Company data retrieved successfully: ${user._id}`);
            
            res.status(200).json({
                success: true,
                message: "Company data retrieved successfully",
                data: user
            });
        } catch (error: any) {
            logger.error(`Failed to get authenticated Company controller: ${error.message}`);
            console.error(`Failed to get authenticated Company controller: ${error.message}`);
            next(error);
        }
    }
}

export const AuthController = new AuthControllerClass();