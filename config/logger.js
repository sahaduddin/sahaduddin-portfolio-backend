const env = require('./env');

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}]: ${message}`;
}

const logger = {
  info: (message) => {
    console.log(formatMessage(levels.INFO, message));
  },
  warn: (message) => {
    console.warn(formatMessage(levels.WARN, message));
  },
  error: (message, error = null) => {
    console.error(formatMessage(levels.ERROR, message));
    if (error && error.stack) {
      console.error(error.stack);
    }
  },
  debug: (message) => {
    if (env.nodeEnv === 'development') {
      console.log(formatMessage(levels.DEBUG, message));
    }
  }
};

module.exports = logger;
