import User from '../models/userModel.js';
import { db } from '../server.js';
import catchAsync from '../utils/catchAsync.js';
import SoldVehicle from '../models/soldVehicles.js';

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

export const addSoldOwnedVehicles = catchAsync(async (req, res, next) => {
  // Creating a new instance of sold Vehicle
  const { insertedId } = await db.collection('sold_vehicles').insertOne(
    new SoldVehicle({
      car_id: req.body.carId,
      vehicle_info: {
        ...req.body.vehicleInfo,
        'Date-sold': new Date(Date.now()),
      },
    })
  );

  const vehicleId = (
    await db.collection('sold_vehicles').findOne({ _id: insertedId })
  ).vehicle_id;

  // Updating the status of the deal in deals collection
  const deal = await db
    .collection('deals')
    .findOne({ ['car_id']: req.body.carId });

  await db
    .collection('deals')
    .updateOne(
      { ['deal_id']: deal.deal_id },
      { $set: { 'deal_info.status': 'completed' } }
    );

  // Updating the vehicle_info array of the user
  await db
    .collection('users')
    .updateOne(
      { ['user_id']: req.params.id },
      { $push: { vehicle_info: vehicleId } }
    );

  // Updating the sold_vehicles array of the dealership

  await db
    .collection('dealerships')
    .updateOne(
      { ['deals']: deal.deal_id },
      { $push: { sold_vehicles: vehicleId } }
    );
  res.status(201).json({
    status: 'success',
  });
});
