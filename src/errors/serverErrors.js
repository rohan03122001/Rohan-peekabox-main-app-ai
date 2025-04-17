const { ErrorCodes } = require('./errorCodes');
const AppError = require('./baseError');

class DatabaseError extends AppError {
  constructor(message, context = {}) {
    super(message, 500, context);
    this.name = 'DatabaseError';
    this.internalCode = ErrorCodes.InternalErrorCodes.DB_QUERY;
  }
}

class ExternalServiceError extends AppError {
  constructor(message, context = {}) {
    super(message, 502, context);
    this.name = 'ExternalServiceError';
    this.internalCode = ErrorCodes.InternalErrorCodes.EXTERNAL_API;
  }
}

class BusinessError extends AppError {
  constructor(message, context = {}) {
    super(message, 400, context);
    this.name = 'BusinessError';
    this.publicMessage = message; // Business rules violations can be exposed
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.BUSINESS_ERROR;
  }
}

const ServerErrors = {
  DatabaseError,
  ExternalServiceError,
  BusinessError,
};

module.exports = { ServerErrors };
