const logger = require('../config/logger');

function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logStr = `${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      logger.error(`[HTTP] ${logStr}`);
    } else if (res.statusCode >= 400) {
      logger.warn(`[HTTP] ${logStr}`);
    } else {
      logger.info(`[HTTP] ${logStr}`);
    }
  });

  next();
}

module.exports = requestLogger;
