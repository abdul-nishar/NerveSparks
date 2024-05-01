import express from 'express';

import {
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
  createCar,
} from '../controllers/carController.js';

const router = express.Router();

router.route('/').get(getAllCars).post(createCar);
router.route('/:id').get(getCar).patch(updateCar).delete(deleteCar);

export default router;
