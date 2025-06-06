const CompanyService = require('../../../src/services/companyService');
const Company = require('../../../src/models/company');
const { NotFoundError, ValidationError } = require('../../../src/utils/errors');

jest.mock('../../../src/models/company');

describe('CompanyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCompany', () => {
        const mockCompanyData = {
            id: '1',
            name: 'Test Company',
            city: 'Test City'
        };

        it('should successfully create a company', async () => {
            Company.findById.mockResolvedValueOnce(null);
            Company.create.mockResolvedValueOnce('1');
            Company.findById.mockResolvedValueOnce(mockCompanyData);

            const result = await CompanyService.createCompany(mockCompanyData);
            expect(result).toEqual(mockCompanyData);
            expect(Company.create).toHaveBeenCalledWith(mockCompanyData);
        });

        it('should throw ValidationError when id is missing', async () => {
            const invalidData = { name: 'Test Company' };
            await expect(CompanyService.createCompany(invalidData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError when name is missing', async () => {
            const invalidData = { id: '1' };
            await expect(CompanyService.createCompany(invalidData))
                .rejects
                .toThrow(ValidationError);
        });

        it('should throw ValidationError if company already exists', async () => {
            Company.findById.mockResolvedValueOnce(mockCompanyData);
            await expect(CompanyService.createCompany(mockCompanyData))
                .rejects
                .toThrow(ValidationError);
        });
    });

    describe('getAllCompanies', () => {
        const mockCompanies = [
            { id: '1', name: 'Company 1' },
            { id: '2', name: 'Company 2' }
        ];

        it('should return all companies without filters', async () => {
            Company.findAll.mockResolvedValueOnce(mockCompanies);
            const result = await CompanyService.getAllCompanies({}, {});
            expect(result).toEqual(mockCompanies);
        });

        it('should apply filters correctly', async () => {
            const filters = { name: 'Test' };
            Company.findAll.mockResolvedValueOnce([mockCompanies[0]]);
            
            const result = await CompanyService.getAllCompanies(filters, {});
            expect(Company.findAll).toHaveBeenCalledWith(filters, {});
            expect(result).toHaveLength(1);
        });

        it('should apply pagination correctly', async () => {
            const pagination = { limit: 10, offset: 0 };
            await CompanyService.getAllCompanies({}, pagination);
            expect(Company.findAll).toHaveBeenCalledWith({}, pagination);
        });
    });

    describe('getCompanyById', () => {
        it('should return company when found', async () => {
            const mockCompany = { id: '1', name: 'Test Company' };
            Company.findById.mockResolvedValueOnce(mockCompany);

            const result = await CompanyService.getCompanyById('1');
            expect(result).toEqual(mockCompany);
        });

        it('should throw NotFoundError when company not found', async () => {
            Company.findById.mockResolvedValueOnce(null);
            await expect(CompanyService.getCompanyById('1'))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('updateCompany', () => {
        const mockCompany = { id: '1', name: 'Updated Company' };

        it('should update company successfully', async () => {
            Company.findById.mockResolvedValueOnce({ id: '1' });
            Company.update.mockResolvedValueOnce(true);
            Company.findById.mockResolvedValueOnce(mockCompany);

            const result = await CompanyService.updateCompany('1', mockCompany);
            expect(result).toEqual(mockCompany);
        });

        it('should throw NotFoundError when updating non-existent company', async () => {
            Company.findById.mockResolvedValueOnce(null);
            await expect(CompanyService.updateCompany('1', mockCompany))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('deleteCompany', () => {
        it('should delete company successfully', async () => {
            Company.findById.mockResolvedValueOnce({ id: '1' });
            Company.delete.mockResolvedValueOnce(true);

            const result = await CompanyService.deleteCompany('1');
            expect(result).toBeTruthy();
        });

        it('should throw NotFoundError when deleting non-existent company', async () => {
            Company.findById.mockResolvedValueOnce(null);
            await expect(CompanyService.deleteCompany('1'))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});