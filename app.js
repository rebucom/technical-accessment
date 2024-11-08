// app.js
import express from 'express';
import cors from 'cors';
import createLogger from './src/config/logger.js';
import morgan from 'morgan';
import helmet from 'helmet';
import errorHandler from './src/controllers/errorController.js';
import AppError from './src/utils/appError.js';

const app = express();
let io;

// Initialize global logger
global.createLogger = createLogger({ label: 'Messages' });

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    optionsSuccessStatus: 204,
  })
);

// Logging middleware
app.use(morgan('combined', { stream: createLogger.stream }));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io setup
export const setIO = (ioInstance) => {
  io = ioInstance;
};

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Error handling
app.use(errorHandler);

export default app;
