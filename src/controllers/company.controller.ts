import { Request, Response, NextFunction } from "express";
import { companyService } from "../services/company.service";
import { CreateCompanyDTO } from "../types/company/company-create.dto";
import { UpdateCompanyDTO } from "../types/company/company-update.dto";
import { logger } from "../config/logger";

class CompanyController {
    async createCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const payload: CreateCompanyDTO = req.body;
            const company = await companyService.createCompany(payload);

            res.status(201).json({
                success: true,
                message: "Company created successfully",
                data: company
            });
        } catch (error) {
            logger.error(`Failed to create company: ${error}`)
            console.error(`Failed to create company: ${error}`)
            next(error);
        }
    }

    async getAllCompanies(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await companyService.getAllCompany();

            res.status(200).json({
                success: true,
                message: "Companies retrieved successfully",
                companies: result.companies,
                totalCompanies: result.totalCompanies
            });
        } catch (error) {
            logger.error(`Failed to get all companies: ${error}`)
            console.error(`Failed to get all companies: ${error}`)
            next(error);
        }
    }

    async getCompanyById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (Array.isArray(id)) {
                throw new Error("Invalid identifier parameter");
            }
            const company = await companyService.findById(id);

            res.status(200).json({
                success: true,
                message: "Company retrieved successfully",
                data: company
            });
        } catch (error) {
            logger.error(`Failed to get company and error is: ${error}`)
            console.error(`Failed to get company and error is: ${error}`)
            next(error);
        }
    }

    async findOneCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { identifier } = req.params;
            if (Array.isArray(identifier)) {
                throw new Error("Invalid identifier parameter");
            }
            const company = await companyService.findOneCompany(identifier);

            res.status(200).json({
                success: true,
                message: "Company found successfully",
                data: company
            });
        } catch (error) {
            logger.error(`Failed to get company and error is: ${error}`)
            console.error(`Failed to get company and error is: ${error}`)
            next(error);
        }
    }

    async deleteCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (Array.isArray(id)) {
                throw new Error("Invalid identifier parameter");
            }
            const message = await companyService.deleteCompany(id);

            res.status(200).json({
                success: true,
                message
            });
        } catch (error) {
            logger.error(`Failed to delete company and error is: ${error}`)
            console.error(`Failed to delete company and error is: ${error}`)
            next(error);
        }
    }

    async updateCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (Array.isArray(id)) {
                throw new Error("Invalid identifier parameter");
            }
            const updatePayload: UpdateCompanyDTO = req.body;
            const updatedCompany = await companyService.updateCompany(id, updatePayload);

            res.status(200).json({
                success: true,
                message: "Company updated successfully",
                data: updatedCompany
            });
        } catch (error) {
            logger.error(`Failed to update company and error is: ${error}`)
            console.error(`Failed to update company and error is: ${error}`)
            next(error);
        }
    }
}

export const companyController = new CompanyController();