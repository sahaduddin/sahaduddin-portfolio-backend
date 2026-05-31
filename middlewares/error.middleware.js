const env = require('../config/env');
const logger = require('../config/logger');
const ApiResponse = require('../utils/response');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (statusCode === 500) {
    logger.error(`[Error Handler] Server Exception: ${message}`, err);
  } else {
    logger.warn(`[Error Handler] Bad Request Alert: ${message}`);
  }
  
  // Mask stack traces in production environment
  const responseData = env.nodeEnv === 'development' ? { stack: err.stack } : null;
  
  const response = ApiResponse.error(message, statusCode, responseData);
  return response.send(res);
}

module.exports = errorHandler;
