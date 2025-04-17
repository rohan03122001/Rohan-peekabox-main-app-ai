const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const bunyan = require('bunyan');
const http = require('http'); 
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const logger = require('./config/logger');
const { Interceptor } = require('./middleware/responseInterceptor');
const { ErrorHandler } = require('./middleware/errorHandler');
const { CONFIG } = require('./config/config');
const { CONSTANTS } = require('./config/constants');
const { routerV1 } = require('./Routes/index');
const { Redis } = require('./cache/redis');
const { AWS } = require('./config/aws');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cron jobs
const {
  runBrandArchiveCronJob,
  runStoreArchiveCronJob,
} = require('./Util/cronJobs.util');

// Create a Bunyan logger
const log = bunyan.createLogger({ name: 'peekabox-be-platform' });



// 1. Security middleware first
app.use(
  helmet({
    frameguard: {
      action: 'deny', // Completely prevent framing
    },
  }),
);

app.use(cookieParser());

const allowedOrigins = {
  STAGING: ['https://peekabox-partners.vercel.app'],
  PRODUCTION: ['https://peekabox-partners.vercel.app'],
};

const corsOptions = {
  origin: (origin, callback) => {
    const environment = CONFIG.NODE_ENV;
    const currentAllowedOrigins = allowedOrigins[environment];

    if (
      (!origin && environment != CONSTANTS.Environments.PRODUCTION) ||
      currentAllowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
   allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: ['Set-Cookie'],
  credentials: true,
};

//Updated
//app.use(cors(corsOptions));

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true, 
  allowedHeaders: ['Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',], // Set your allowed headers here
}));

// 2. Basic middleware
app.use(
  mongoSanitize({
    replaceWith: '_', // Replace prohibited characters with this
    onSanitize: ({ req, key }) => {
      log.warn(`Attempted NoSQL injection detected: ${key}`); // Log sanitization attempts
    },
  }),
);
app.use(logger.requestIdMiddleware());
app.use(logger.requestLogger());
app.use(Interceptor.responseInterceptor);

// 3. CORS error handler (after basic middleware but before routes)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS_ERROR',
      message: 'Origin not allowed',
    });
  }
  next(err);
});

// 4. API Routes
app.use('/api/v1', routerV1);
// app.use('/api/users/auth', authRoutes);

// 5. 404 Handler (after routes but before error handlers)
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// 6. Error handling middleware (always at the end, but before server start)
// app.use(logger.errorLogger());
app.use(ErrorHandler.defaultErrorHandler);
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    success: false,
    error: true,
    data: null,
    errorMessage: 'Something went wrong',
  });
});

const connectMongo = async (retryCount = 0) => {
  const maxRetries = 3;

  try {
    await mongoose.connect(CONFIG.MONGODB_STRING, {});

    logger.info(
      'MongoDB connected successfully',
      'MONGODB_CONNECTED_SUCCESSFULLY',
      'MONGODB_CONNECTED_SUCCESSFULLY',
    );
  } catch (error) {
    logger.error(
      `MongoDB connection attempt ${retryCount + 1} failed`,
      'MONGODB_CONNECTION_ERROR',
      'MONGODB_CONNECTION_ERROR',
      error,
    );

    if (retryCount < maxRetries) {
      return connectMongo(retryCount + 1);
    }

    throw new Error('All MongoDB connection attempts failed');
  }
};

const connectDatabases = async () => {
  try {
    await Promise.all([connectMongo(), Redis.connectRedis(), AWS.initialize()]);
    log.info('All database connections established');
  } catch (err) {
    log.error('Failed to connect to databases', err);
    process.exit(1); // Crash and let container/process manager handle restart
  }
};

connectDatabases();

// 8. Start server
app.listen(CONFIG.PORT,'0.0.0.0' , () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
  // runBrandArchiveCronJob();
  // runStoreArchiveCronJob();
});

module.exports = app;
