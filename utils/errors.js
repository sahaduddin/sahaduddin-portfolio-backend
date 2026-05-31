class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends APIError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class NotFoundError extends APIError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

class InternalServerError extends APIError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

module.exports = {
  APIError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
};
