import express from 'express';

import carRouter from './routes/carRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use('/api/v1/cars', carRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side' });
});

const port = 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
