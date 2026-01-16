import { Router } from 'express';
import { companyController } from '../controllers/company.controller';
import { validate } from '../middlewares/validation.middleware';
import {
    createCompanyValidator,
    updateCompanyValidator,
    getCompanyByIdValidator,
    findOneCompanyValidator,
    deleteCompanyValidator
} from '../validator/company.validator';

export const companyRouter = Router();

// Create company
companyRouter.post('/', createCompanyValidator, validate, companyController.createCompany);

// Get all companies
companyRouter.get('/', companyController.getAllCompanies);

// Get company by ID
companyRouter.get('/:id', getCompanyByIdValidator, validate, companyController.getCompanyById);

// Find company by email or name
companyRouter.get('/find/:identifier', findOneCompanyValidator, validate, companyController.findOneCompany);

// Update company
companyRouter.put('/:id', updateCompanyValidator, validate, companyController.updateCompany);

// Delete company
companyRouter.delete('/:id', deleteCompanyValidator, validate, companyController.deleteCompany);

