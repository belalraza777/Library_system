export function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        message: statusCode === 500 ? 'Internal server error' : error.message,
    });
}