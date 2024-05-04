import express from 'express';
import morgan from 'morgan';

import GlobalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

const app = express();

// Routers
import carRouter from './routes/carRoutes.js';
import userRouter from './routes/userRoutes.js';
import dealershipRouter from './routes/dealershipRoutes.js';

// Global Middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body to req.body
app.use(express.json());

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
