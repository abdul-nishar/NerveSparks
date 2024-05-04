import User from '../models/userModel.js';
import { db } from '../server.js';
import catchAsync from '../utils/catchAsync.js';

import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './handlerFactory.js';

export const getAllUsers = getAll('users');

export const createUser = createOne('users', User);

export const getUser = getOne('users');

export const updateUser = updateOne('users');

export const deleteUser = deleteOne('users');

export const getOwnedVehicles = catchAsync(async (req, res, next) => {
  const ownedVehicles = [];
  const user = await db
    .collection('users')
    .findOne({ ['user_id']: req.params.id });

  if (!user) return next(new AppError('No user found with this ID', 404));

  const vehicleIds = user.vehicle_info;

  for (const vehicleId of vehicleIds) {
    const carId = (
      await db
        .collection('sold_vehicles')
        .findOne({ ['vehicle_id']: vehicleId })
    ).car_id;

    const car = await db.collection('cars').findOne({ ['car_id']: carId });

    const dealerInfo = await db
      .collection('dealerships')
      .find({ sold_vehicles: vehicleId })
      .toArray();

    ownedVehicles.push({
      car_data: car,
      dealer_info: dealerInfo,
    });
  }

  res.status(200).json({
    status: 'success',
    data: ownedVehicles,
  });
});
