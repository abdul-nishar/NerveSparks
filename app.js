import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import GlobalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

const app = express();

// app.enable('trust proxy')
app.set('trust proxy', 3);

// Routers
import carRouter from './routes/carRoutes.js';
import userRouter from './routes/userRoutes.js';
import dealershipRouter from './routes/dealershipRoutes.js';

// Global Middleware
app.use(cors());

app.options('*', cors());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Limit Requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body to req.body
app.use(express.json());

app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization agianst XSS
app.use(xss());

// Middleware to compress text that is going to be sent to clients
app.use(compression());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side' });
});
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dealerships', dealershipRouter);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error Handling Middleware
app.use(GlobalErrorHandler);

export default app;
