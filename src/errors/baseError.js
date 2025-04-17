class AppError extends Error {
  constructor(message, statusCode, context = {}) {
    super(message);
    this.statusCode = statusCode;
    this.context = context;
    this.publicMessage = 'An unexpected error occurred'; // Default public message
    this.isOperational = true; // To distinguish operational errors from programming errors
  }
}

module.exports = AppError;
