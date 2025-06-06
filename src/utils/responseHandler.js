class ResponseHandler {
    static success(res, statusCode, message, data = null) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

module.exports = { responseHandler: ResponseHandler };