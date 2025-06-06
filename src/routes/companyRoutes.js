const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionsMiddleware');
const { PERMISSIONS } = require('../constants');

try {
    console.log('Setting up company routes...');
    console.log('CheckPermission middleware:', checkPermission);
    console.log('CompanyController:', CompanyController);

    // Create company
    try {
        console.log('Setting up POST route...');
        router.post('/', 
            (req, res, next) => {
                console.log('Auth middleware executing...');
                return verifyToken(req, res, next);
            },
            (req, res, next) => {
                console.log('Permission middleware executing...');
                return checkPermission(PERMISSIONS.PAGES.COMPANIES, PERMISSIONS.ACTIONS.CREATE)(req, res, next);
            },
            (req, res) => {
                console.log('Controller executing...');
                return CompanyController.createCompany(req, res);
            }
        );
        console.log('POST route setup complete');
    } catch (error) {
        console.error('Error setting up POST route:', error);
    }

    // Get all companies
    try {
        console.log('Setting up GET (all) route...');
        router.get('/', 
            (req, res, next) => {
                console.log('Auth middleware executing...');
                return verifyToken(req, res, next);
            },
            (req, res, next) => {
                console.log('Permission middleware executing...');
                return checkPermission(PERMISSIONS.PAGES.COMPANIES, PERMISSIONS.ACTIONS.VIEW)(req, res, next);
            },
            (req, res) => {
                console.log('Controller executing...');
                return CompanyController.getCompanies(req, res);
            }
        );
        console.log('GET (all) route setup complete');
    } catch (error) {
        console.error('Error setting up GET (all) route:', error);
    }

    // Get company by ID
    try {
        console.log('Setting up GET (by ID) route...');
        router.get('/:id', 
            (req, res, next) => {
                console.log('Auth middleware executing...');
                return verifyToken(req, res, next);
            },
            (req, res, next) => {
                console.log('Permission middleware executing...');
                return checkPermission(PERMISSIONS.PAGES.COMPANIES, PERMISSIONS.ACTIONS.VIEW)(req, res, next);
            },
            (req, res) => {
                console.log('Controller executing...');
                return CompanyController.getCompanyById(req, res);
            }
        );
        console.log('GET (by ID) route setup complete');
    } catch (error) {
        console.error('Error setting up GET (by ID) route:', error);
    }

    // Update company
    try {
        console.log('Setting up PUT route...');
        router.put('/:id', 
            (req, res, next) => {
                console.log('Auth middleware executing...');
                return verifyToken(req, res, next);
            },
            (req, res, next) => {
                console.log('Permission middleware executing...');
                return checkPermission(PERMISSIONS.PAGES.COMPANIES, PERMISSIONS.ACTIONS.EDIT)(req, res, next);
            },
            (req, res) => {
                console.log('Controller executing...');
                return CompanyController.updateCompany(req, res);
            }
        );
        console.log('PUT route setup complete');
    } catch (error) {
        console.error('Error setting up PUT route:', error);
    }

    // Delete company
    try {
        console.log('Setting up DELETE route...');
        router.delete('/:id', 
            (req, res, next) => {
                console.log('Auth middleware executing...');
                return verifyToken(req, res, next);
            },
            (req, res, next) => {
                console.log('Permission middleware executing...');
                return checkPermission(PERMISSIONS.PAGES.COMPANIES, PERMISSIONS.ACTIONS.DELETE)(req, res, next);
            },
            (req, res) => {
                console.log('Controller executing...');
                return CompanyController.deleteCompany(req, res);
            }
        );
        console.log('DELETE route setup complete');
    } catch (error) {
        console.error('Error setting up DELETE route:', error);
    }

} catch (error) {
    console.error('Fatal error in company routes setup:', error);
}

module.exports = router;