import Car from '../models/carModel.js';

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
