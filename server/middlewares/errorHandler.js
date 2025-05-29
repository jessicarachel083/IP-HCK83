// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error('🚨 ERROR:', err.message);
    console.error('Stack:', err.stack);
  
    // Send error response
    res.status(err.statusCode || 500).json({
      error: true,
      message: err.message || 'Something went wrong!',
      details: err.errors || undefined // Sequelize validation errors
    });
  };
  
  module.exports = errorHandler;