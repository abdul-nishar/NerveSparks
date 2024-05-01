import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const cars = JSON.parse(
  readFileSync(`${__dirname}/dev-data/data/carData.json`)
);

const users = JSON.parse(
  readFileSync(`${__dirname}/dev-data/data/userData.json`)
);

const getAllCars = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: {
      cars: cars,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};

const createCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const deleteCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const updateCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const getCar = async (req, res) => {
  const car = await cars.find((el) => el.car_id === req.params.id);

  if (!car) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      car: car,
    },
  });
};

const createUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const getUser = async (req, res) => {
  const user = await users.find((el) => el.user_id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

const updateUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const deleteUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

const carRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/cars', carRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the server side' });
});

carRouter.route('/').get(getAllCars).post(createCar);
carRouter.route('/:id').get(getCar).patch(updateCar).delete(deleteCar);
userRouter.route('/').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
