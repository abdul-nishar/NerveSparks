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

import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  protect,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp('dealership'));
router.post('/login', login('dealership'));
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword('dealership'));
router.patch('/resetPassword/:token', resetPassword('dealership'));

// Protects all routes after this middleware
router.use(protect('dealership'));

router.patch('/updateMyPassword', updatePassword('dealership'));
router.route('/:id/cars').get(getCarsInDealer).post(addCarsInDealer);
router.route('/:id/deals').get(getDealsInDealer).post(addDealsInDealer);
router.route('/:id/sold-vehicles').get(getSoldVehicles);

router.use(restrictTo('admin'));

router.route('/').get(getAllDealership).post(createDealership);
router
  .route('/:id')
  .get(getDealership)
  .patch(updateDealership)
  .delete(deleteDealership);

export default router;
