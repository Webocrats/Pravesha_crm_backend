class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class AuthenticationError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    ForbiddenError
};