// services/company.service.ts
import bcrypt from "bcrypt";
import { logger } from "../config/logger";
import { CreateCompanyDTO } from "../types/company/company-create.dto";
import { AppError } from "../utils/AppError";
import { Company } from "../models/company.model";
import { hashPassword } from "../utils/password";
import { UpdateCompanyDTO } from "../types/company/company-update.dto";

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

    async findOneCompany(exists: string) {
        try {
            const existsCompany = await Company.findOne({
                $or: [
                    { company_email: exists },
                    { company_name: exists },
                ],
            });

            if (!existsCompany) {
                console.error(`Company does not exists ${exists}`);
                logger.error(`Company does not exists  ${exists}`);
                throw new AppError("Company does not exists", 409);
            }

            return existsCompany
        } catch (error: any) {
            logger.error(`Failed to get company with email or name:${exists} and error is: ${error.message}`);
            console.error(`Failed to get company with email or name:${exists} and error is: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async findCompanyByEmail(email: string) {
        try {
            const existsCompany = await Company.findOne({
              company_email:email
            }).select("+password");

            if (!existsCompany) {
                console.error(`Company does not exists ${email}`);
                logger.error(`Company does not exists  ${email}`);
                throw new AppError("Company does not exists", 409);
            }

            return existsCompany
        } catch (error: any) {
            logger.error(`Failed to get company with email:${email} and error is: ${error.message}`);
            console.error(`Failed to get company with email:${email} and error is: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }


    async deleteCompany(companyId: string) {
        try {
            await this.findById(companyId)


            await Company.findByIdAndDelete(companyId)
            return "Company Deleted Successfully"
        } catch (error: any) {
            logger.error(`Failed to delete company with id is: ${companyId} and error is: ${error.message}`);
            console.error(`Failed to delete company with id is: ${companyId} and error is: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }

    async updateCompany(companyId: string, updateCompanyPayload: UpdateCompanyDTO) {
        try {
            await this.findById(companyId)
            const updateCompany = await Company.findByIdAndUpdate(companyId, {
                ...updateCompanyPayload
            }, {
                new: true
            })
            return updateCompany
        } catch (error: any) {
            logger.error(`Failed to update company with id is: ${companyId} and error is: ${error.message}`);
            console.error(`Failed to update company with id is: ${companyId} and error is: ${error.message}`);
            throw error instanceof AppError
                ? error
                : new AppError("Internal Server Error", 500);
        }
    }
}

export const companyService = new CompanyService();
