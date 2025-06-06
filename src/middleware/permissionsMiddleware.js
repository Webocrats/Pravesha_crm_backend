const Permission = require('../models/permissionModel');
const { ForbiddenError } = require('../utils/errors');
const { ERROR_MESSAGES } = require('../constants');

const checkPermission = (page, action) => {
    return async (req, res, next) => {
        try {
            const hasPermission = await Permission.checkUserPermission(
                req.user.id,
                page,
                action
            );

            if (!hasPermission && !req.user.is_superior) {
                throw new ForbiddenError(ERROR_MESSAGES.PERMISSION_DENIED);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { checkPermission };