import Car from '../models/carModel.js';
import { db } from '../server.js';
import catchAsync from '../utils/catchAsync.js';

import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './handlerFactory.js';

export const getAllCars = getAll('cars');

export const createCar = createOne('cars', Car);

export const deleteCar = deleteOne('cars');

export const updateCar = updateOne('cars');

export const getCar = getOne('cars');

export const getDealsForCar = catchAsync(async (req, res, next) => {
  const deals = await db
    .collection('deals')
    .find({ ['car_id']: req.params.id })
    .toArray();

  console.log(deals);

  res.status(200).json({
    status: 'success',
    result: deals.length,
    data: {
      data: deals,
    },
  });
});

export const getDealershipsForCar = catchAsync(async (req, res, next) => {
  const dealerships = await db
    .collection('dealerships')
    .find({ ['cars']: req.params.id })
    .toArray();

  console.log(dealerships);

  res.status(200).json({
    status: 'success',
    result: dealerships.length,
    data: {
      data: dealerships,
    },
  });
});
