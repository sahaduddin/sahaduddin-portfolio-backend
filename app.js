const env = require('./config/env');
const logger = require('./config/logger');
const express = require('express');
const cors = require('cors');

// Import custom middleware layers
const requestLogger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const { NotFoundError } = require('./utils/errors');

// Import aggregated API router
const apiRoutes = require('./routes');

const app = express();

// Advanced CORS policies matching environment
const corsOrigin = env.corsOrigin;
const allowedOrigins = corsOrigin === '*'
  ? null
  : corsOrigin.split(',').map(origin => origin.trim()).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (corsOrigin === '*') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: corsOrigin !== '*'
};

app.use(cors(corsOptions));
app.use(express.json());

// 1. Register HTTP request logging middleware
app.use(requestLogger);

// 2. Mount central index routes at /api
app.use('/api', apiRoutes);

// 3. Mount 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Requested endpoint '${req.method} ${req.originalUrl}' does not exist.`));
});

// 4. Mount centralized error handling middleware
app.use(errorHandler);

// Launch Node application
app.listen(env.port, () => {
  logger.info(`[Bootstrap] Express Server initialized in [${env.nodeEnv}] mode on port ${env.port}`);
});
