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

const router = Router();

// Create company
router.post('/', createCompanyValidator, validate, companyController.createCompany);

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get company by ID
router.get('/:id', getCompanyByIdValidator, validate, companyController.getCompanyById);

// Find company by email or name
router.get('/find/:identifier', findOneCompanyValidator, validate, companyController.findOneCompany);

// Update company
router.put('/:id', updateCompanyValidator, validate, companyController.updateCompany);

// Delete company
router.delete('/:id', deleteCompanyValidator, validate, companyController.deleteCompany);

export default router;