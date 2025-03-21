import express, { Express } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error';
import { configureSecurityMiddleware } from './middleware/security';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';
import docsRoutes from './routes/docs.routes';
import { requestDebugger, RequestMonitor, memoryDebugger } from './utils/debug';

// Load environment variables
dotenv.config();

const app: Express = express();

// Start request monitoring
RequestMonitor.startMonitoring();

// Configure security middleware
configureSecurityMiddleware(app);

// Debug middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(requestDebugger);
}

// Body parsing middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Apply rate limiting to all routes
app.use('/api', apiLimiter);


// Routes
app.use('/api/auth', authRoutes);
app.use('/docs', docsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Memory usage check (every 5 minutes in development)
if (process.env.NODE_ENV !== 'production') {
  setInterval(memoryDebugger, 300000);
}

// Error handling middleware
app.use(errorHandler);

// Test database connection
testConnection()
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default app; 