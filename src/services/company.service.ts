// services/company.service.ts
import bcrypt from "bcrypt";
import { logger } from "../config/logger";
import { CreateCompanyDTO } from "../types/company/company-create.dto";
import { AppError } from "../utils/AppError";
import { Company } from "../models/company.model";
import { hashPassword } from "../utils/password";

class CompanyService {
    async createCompany(payload: CreateCompanyDTO) {
        try {
            const exists = await Company.findOne({
                $or: [
                    { company_email: payload.company_email },
                    { company_name: payload.company_name },
                ],
            });

            if (exists) {
                console.error(`Company already exists ${exists}`);
                logger.error(`Company already exists  ${exists}`);
                throw new AppError("Company already exists", 409);
            }

            const hashedPassword = await hashPassword(payload.password);

            const company = await Company.create({
                ...payload,
                password: hashedPassword,
            });

            return {
                id: company._id,
                company_name: company.company_name,
                company_email: company.company_email,
                company_description: company.company_description,
                createdAt: company.createdAt,
            };
        } catch (error: any) {
            logger.error(`Failed to create company service: ${error.message}`);
            console.error(`Failed to create company service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async getAllCompany() {
        try {
            const companies = await Company.find({});

            return {
                companies,
                totalCompanies: companies.length,
            };
        } catch (error: any) {
            logger.error(`Failed to get all company service: ${error.message}`);
            console.error(`Failed to get all company service: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async findById(companyId: string) {
        try {
            const company = await Company.findById(companyId);

            if (!company) {
                console.error(`Company already exists ${company}`);
                logger.error(`Company already exists  ${company}`);
                throw new AppError("Company already exists", 409);
            }

            return company
        } catch (error: any) {
            logger.error(`Failed to get company with id:${companyId} and error is: ${error.message}`);
            console.error(`Failed to get company with id:${companyId} and error is: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}

export const companyService = new CompanyService();
