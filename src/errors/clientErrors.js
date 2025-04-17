const { ErrorCodes } = require('./errorCodes');
const AppError = require('./baseError');

class ValidationError extends AppError {
  constructor(message, context = {}) {
    super(message, 400, context);
    this.name = 'ValidationError';
    this.publicMessage = message;
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.VALIDATION_ERROR;
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource', context = {}) {
    super(`${resource} not found`, 404, context);
    this.name = 'NotFoundError';
    this.publicMessage = `${resource} not found`;
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.NOT_FOUND;
  }
}

class InvalidCredentialsError extends AppError {
  constructor(context = {}) {
    super('Invalid email or password', 401, context);
    this.name = 'InvalidCredentialsError';
    this.publicMessage = 'Invalid email or password';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.INVALID_CREDENTIALS;
  }
}

class FetchError extends AppError {
  constructor(message = 'Failed to fetch data', context = {}) {
    super(message, 500, context);
    this.name = 'FetchError';
    this.publicMessage = 'Failed to retrieve data from the server';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.FETCH_FAILED;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', context = {}) {
    super(message, 401, context);
    this.name = 'UnauthorizedError';
    this.publicMessage = 'Unauthorized access';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.UNAUTHORIZED;
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', context = {}) {
    super(message, 403, context);
    this.name = 'ForbiddenError';
    this.publicMessage = 'Access forbidden';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.FORBIDDEN;
  }
}
class ConflictError extends AppError {
  constructor(message, context = {}) {
    super(message, 409, context);
    this.name = 'ConflictError';
    this.publicMessage = message;
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.CONFLICT;
  }
}

class InvalidOTPError extends AppError {
  constructor(message = 'Invalid or expired OTP', context = {}) {
    super(message, 401, context); // Using 401 Unauthorized
    this.name = 'InvalidOTPError';
    this.publicMessage = 'The OTP you entered is incorrect or has expired';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.INVALID_OTP; // Assuming you have this code
  }
}

class TokenExpiredError extends AppError {
  constructor(context = {}) {
    super('Access token has expired', 401, context);
    this.name = 'TokenExpiredError';
    this.publicMessage = 'Your session has expired. Please log in again.';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.TOKEN_EXPIRED;
  }
}

class RefreshTokenNotFoundError extends AppError {
  constructor(context = {}) {
    super('Refresh token not found', 401, context);
    this.name = 'RefreshTokenNotFoundError';
    this.publicMessage = 'Invalid refresh token. Please log in again.';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.REFRESH_TOKEN_NOT_FOUND;
  }
}

class InvalidRefreshTokenError extends AppError {
  constructor(context = {}) {
    super('Invalid refresh token', 401, context);
    this.name = 'InvalidRefreshTokenError';
    this.publicMessage = 'Your session is invalid. Please log in again.';
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.INVALID_REFRESH_TOKEN;
  }
}

class ProductNotAvailableError extends AppError {
  constructor(resource, context = {}) {
    super(`${resource} not found`, 404, context);
    this.name = 'NotFoundError';
    this.publicMessage = `${resource} not found`;
    this.clientErrorCode =
      ErrorCodes.ClientErrorCodes.PRODUCT_UNAVAILABLE_ERROR;
  }
}

class MaxProductQuantityExceededError extends AppError {
  constructor(resource, maxQuantity, context = {}) {
    super(`${resource} max quantity exceeded`, 404, context);
    this.name = 'MaxQuantityExceeded';
    this.publicMessage = { maxQuantity };
    this.context = context;
    this.clientErrorCode =
      ErrorCodes.ClientErrorCodes.PRODUCT_MAX_QUANTITY_EXCEEDED_ERROR;
  }
}

class OrderInconsistentStateError extends AppError {
  constructor(orderId, context = {}) {
    super(`Order ${orderId} is in inconsistent state`, 400, context);
    this.name = 'OrderInconsistentState';
    this.publicMessage = `Order ${orderId} is in inconsistent state`;
    this.context = context;
    this.clientErrorCode =
      ErrorCodes.ClientErrorCodes.ORDER_INCONSISTENT_STATE_ERROR;
  }
}

class DeliveryNotOfferedError extends AppError {
  constructor(storeId, context = {}) {
    super(`Delivery is not offered by store ${storeId}`, 400, context);
    this.name = 'DeliveryNotOffered';
    this.publicMessage = `Delivery is not offered by store ${storeId}`;
    this.context = context;
    this.clientErrorCode =
      ErrorCodes.ClientErrorCodes.DELIVERY_NOT_OFFERED_ERROR;
  }
}

const ClientErrors = {
  ValidationError,
  FetchError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InvalidCredentialsError,
  InvalidOTPError,
  TokenExpiredError,
  RefreshTokenNotFoundError,
  InvalidRefreshTokenError,
  ProductNotAvailableError,
  MaxProductQuantityExceededError,
  OrderInconsistentStateError,
  DeliveryNotOfferedError,
};

module.exports = { ClientErrors };
