import { JWT_SECRET_KEY } from "../config/dotenv";
import { logger } from "../config/logger";
import { LoginCompanyDto } from "../types/auth/LoginCompanyDto";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { companyService } from "./company.service";
import { comparePassword } from "../utils/password";


class AuthServiceClass {
    async LoginUser({
        email,
        password,
    }: LoginCompanyDto) {
        try {
            if (!JWT_SECRET_KEY) {
                logger.error(`Failed to get The JWT Key. Please Provide it First`);
                throw new AppError(`INTERNAL SERVER ERROR`, 500);
            }

            const isCompanyExists = await companyService.findCompanyByEmail(email);
            if (!isCompanyExists) {
                logger.error(`Company with mail: ${email} not found`);
                throw new AppError(`Company with mail: ${email} not found`, 404);
            }

            const hashedPassword = comparePassword(password, isCompanyExists.password);
            if (!hashedPassword) {
                logger.error(`Invalid Credentials`);
                throw new AppError(`Invalid Credentials`, 404);
            }

            const payload = {
                company_email: isCompanyExists.company_email,
                id: isCompanyExists._id,
            };


            const token = jwt.sign(payload, JWT_SECRET_KEY, {
                expiresIn: "7d",
            });

            return {
                user: {
                    email: isCompanyExists.email,
                    id: isCompanyExists._id,
                },
                token
            };
        } catch (error) {
            logger.error(`Failed to signin Company: ${error}`);
            console.error(`Failed to signin Company: ${error}`)
            throw new AppError(
                error instanceof AppError ? error.message : "Failed to signin Company",
                error instanceof AppError ? error.statusCode : 500
            );
        }
    };

    async getAuthenticatedUser(email: string) {
        try {
            logger.info(`Fetching authenticated user with email: ${email}`);
            console.log(`Fetching authenticated user with email: ${email}`);

            const company = await companyService.findOneCompany(email);

            if (!company) {
                logger.error(`Authenticated company not found with email: ${email}`);
                throw new AppError(`company not found`, 404);
            }

            logger.info(`Authenticated company retrieved successfully: ${company._id}`);
            console.log(`Authenticated company retrieved successfully: ${company._id}`);

            return {
                ...company
            };
        } catch (error) {
            logger.error(`Failed to get authenticated company: ${error}`);
            console.error(`Failed to get authenticated company: ${error}`);
            throw new AppError(
                error instanceof AppError ? error.message : "Failed to get authenticated company",
                error instanceof AppError ? error.statusCode : 500
            );
        }
    }
}

export const AuthService = new AuthServiceClass()