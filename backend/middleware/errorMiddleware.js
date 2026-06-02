const errorMiddleware = (err, req, res, next) => {
  // If response headers have already been sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[Error Handler] ${req.method} ${req.url} - Error:`, err);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'An unexpected internal server error occurred.',
    // Only return stack trace in non-production environments
    stack: isProd ? undefined : err.stack
  });
};

module.exports = errorMiddleware;
