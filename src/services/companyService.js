const Company = require('../models/companyModel');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../constants');

class CompanyService {
    static async createCompany(data) {
        try {
            // Validate required fields
            if (!data.name) {
                throw new ValidationError('Company name is required');
            }

            // Create company
            const companyId = await Company.create(data);
            return this.getCompanyById(companyId);
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error(`Failed to create company: ${error.message}`);
        }
    }

    static async getAllCompanies(filters, pagination) {
        return await Company.findAll(filters, pagination);
    }

    static async getCompanyById(id) {
        const company = await Company.findById(id);
        if (!company) {
            throw new NotFoundError('Company not found');
        }
        return company;
    }

    static async updateCompany(id, data) {
        const exists = await Company.findById(id);
        if (!exists) {
            throw new NotFoundError('Company not found');
        }

        // Remove id from update data if present
        delete data.id;

        await Company.update(id, data);
        return this.getCompanyById(id);
    }

    static async deleteCompany(id) {
        const exists = await Company.findById(id);
        if (!exists) {
            throw new NotFoundError('Company not found');
        }

        return await Company.delete(id);
    }
}

module.exports = CompanyService;