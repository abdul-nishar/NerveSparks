import express from 'express';
import {
  getAllDealership,
  createDealership,
  getDealership,
  updateDealership,
  deleteDealership,
  getCarsInDealer,
  getDealsInDealer,
  getSoldVehicles,
  addCarsInDealer,
  addDealsInDealer,
} from '../controllers/dealershipController.js';

const router = express.Router();

router.route('/').get(getAllDealership).post(createDealership);

router.route('/:id/cars').get(getCarsInDealer).post(addCarsInDealer);
router.route('/:id/deals').get(getDealsInDealer).post(addDealsInDealer);
router.route('/:id/sold-vehicles').get(getSoldVehicles);

router
  .route('/:id')
  .get(getDealership)
  .patch(updateDealership)
  .delete(deleteDealership);

export default router;
