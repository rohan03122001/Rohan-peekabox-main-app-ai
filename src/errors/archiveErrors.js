const { ErrorCodes } = require('./errorCodes');
const AppError = require('./baseError');

class FailedToArchive extends AppError {
  constructor(message, context = {}) {
    super(message, 400, context);
    this.name = 'ArchiveError';
    this.publicMessage = message;
    this.clientErrorCode = ErrorCodes.ClientErrorCodes.BUSINESS_ERROR;
  }
}

const ProductErrors = {
  FailedToArchive,
};

module.exports = { ProductErrors };
