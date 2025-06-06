const CompanyService = require('../services/companyService');
const { responseHandler } = require('../utils/responseHandler');

class CompanyController {
    static async createCompany(req, res) {
        try {
            const company = await CompanyService.createCompany(req.body);
            return responseHandler.success(res, 201, 'Company created successfully', company);
        } catch (error) {
            console.error('Error creating company:', error);
            return res.status(400).json({ 
                success: false, 
                message: error.message || 'Error creating company' 
            });
        }
    }

    static async getCompanies(req, res) {
        try {
            const filters = {
                name: req.query.name,
                city: req.query.city
            };
            const pagination = {
                limit: req.query.limit,
                offset: req.query.offset
            };
            const companies = await CompanyService.getAllCompanies(filters, pagination);
            return responseHandler.success(res, 200, 'Companies retrieved successfully', companies);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async getCompanyById(req, res) {
        try {
            const company = await CompanyService.getCompanyById(req.params.id);
            return responseHandler.success(res, 200, 'Company retrieved successfully', company);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async updateCompany(req, res) {
        try {
            const company = await CompanyService.updateCompany(req.params.id, req.body);
            return responseHandler.success(res, 200, 'Company updated successfully', company);
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }

    static async deleteCompany(req, res) {
        try {
            await CompanyService.deleteCompany(req.params.id);
            return responseHandler.success(res, 200, 'Company deleted successfully');
        } catch (error) {
            return responseHandler.error(res, error);
        }
    }
}

module.exports = CompanyController;