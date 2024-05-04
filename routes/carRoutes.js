import express from 'express';

import {
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
  createCar,
  getDealsForCar,
  getDealershipsForCar
} from '../controllers/carController.js';

const router = express.Router();

router.route('/').get(getAllCars).post(createCar);

router.route('/:id/deals').get(getDealsForCar);
router.route('/:id/dealerships').get(getDealershipsForCar);
router.route('/:id').get(getCar).patch(updateCar).delete(deleteCar);

export default router;
