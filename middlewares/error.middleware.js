function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Handle Mongoose validation errors specifically
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
}

export default errorHandler;
