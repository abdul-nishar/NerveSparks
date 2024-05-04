import { db } from '../server.js';
import AppError from '../utils/appError.js';

import Dealership from '../models/dealershipModel.js';
import catchAsync from '../utils/catchAsync.js';
import {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} from './handlerFactory.js';

export const getAllDealership = getAll('dealerships');

export const createDealership = createOne('dealerships', Dealership);

export const getDealership = getOne('dealerships');

export const updateDealership = updateOne('dealerships');

export const deleteDealership = deleteOne('dealerships');

export const getCarsInDealer = catchAsync(async (req, res, next) => {
  const dealership = await db
    .collection('dealerships')
    .findOne({ ['dealership_id']: req.params.id });

  if (!dealership)
    return next(new AppError('No dealership found with this ID', 404));

  const carIds = dealership.cars;

  const cars = await Promise.all(
    carIds.map(async (id) => {
      const car = await db.collection('cars').findOne({ ['car_id']: id });
      if (!car) return next(new AppError('No car found with this ID', 404));
      return car;
    })
  );

  res.status(200).json({
    status: 'success',
    result: cars.length,
    data: {
      data: cars,
    },
  });
});

export const addCarsInDealer = catchAsync(async (req, res, next) => {
  await db.collection('dealerships').updateOne(
    { ['dealership_id']: req.params.id },
    {
      $addToSet: {
        cars: {
          $each: [req.body.carId],
        },
      },
    },
    { upsert: true }
  );

  res.status(201).json({
    status: 'success',
    data: null,
  });
});

export const getDealsInDealer = catchAsync(async (req, res, next) => {
  const dealership = await db
    .collection('dealerships')
    .findOne({ ['dealership_id']: req.params.id });

  if (!dealership)
    return next(new AppError('No dealership found with this ID', 404));

  const dealIds = dealership.deals;

  const deals = await Promise.all(
    dealIds.map(async (id) => {
      const deal = await db.collection('deals').findOne({ ['deal_id']: id });
      if (!deal) return next(new AppError('No deal found with this ID', 404));
      return deal;
    })
  );

  res.status(200).json({
    status: 'success',
    result: deals.length,
    data: {
      data: deals,
    },
  });
});

export const addDealsInDealer = catchAsync(async (req, res, next) => {
  await db.collection('dealerships').updateOne(
    { ['dealership_id']: req.params.id },
    {
      $addToSet: {
        deals: {
          $each: [req.body.dealId],
        },
      },
    },
    { upsert: true }
  );

  res.status(201).json({
    status: 'success',
    data: null,
  });
});

export const getSoldVehicles = catchAsync(async (req, res, next) => {
  const soldVehicles = [];
  const dealer = await db
    .collection('dealerships')
    .findOne({ ['dealership_id']: req.params.id });

  if (!dealer)
    return next(new AppError('No dealership found with this ID', 404));

  const vehicleIds = dealer.sold_vehicles;

  for (const vehicleId of vehicleIds) {
    const carId = (
      await db
        .collection('sold_vehicles')
        .findOne({ ['vehicle_id']: vehicleId })
    ).car_id;

    const car = await db.collection('cars').findOne({ ['car_id']: carId });

    const ownerInfo = await db
      .collection('users')
      .find({ vehicle_info: vehicleId })
      .toArray();

    soldVehicles.push({
      car_data: car,
      owner_info: ownerInfo,
    });
  }

  res.status(200).json({
    status: 'success',
    results: soldVehicles.length,
    data: soldVehicles,
  });
});
