import express from 'express';

import {
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
  createCar,
  getDealsForCar,
  getDealershipsForCar,
} from '../controllers/carController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(getAllCars)
  .post(protect, restrictTo('admin', 'dealership'), createCar);

router.route('/:id/deals').get(getDealsForCar);
router.route('/:id/dealerships').get(getDealershipsForCar);
router
  .route('/:id')
  .get(getCar)
  .patch(protect, restrictTo('admin', 'dealership'), updateCar)
  .delete(protect, restrictTo('admin', 'dealership'), deleteCar);

export default router;
