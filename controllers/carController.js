import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cars = JSON.parse(
  readFileSync(`${__dirname}/../dev-data/data/carData.json`)
);

export const getAllCars = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: {
      cars: cars,
    },
  });
};

export const createCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

export const deleteCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

export const updateCar = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

export const getCar = async (req, res) => {
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
