export function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Internal server error' : error.message,
    });
}