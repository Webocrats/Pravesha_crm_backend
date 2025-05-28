const handleSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        data
    });
};

const handleError = (res, error) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: error.message
    });
};

module.exports = {
    handleSuccess,
    handleError
};