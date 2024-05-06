import express from 'express';

import {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getOwnedVehicles,
  addSoldOwnedVehicles,
} from '../controllers/userController.js';

import {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp('user'));
router.post('/login', login('user'));
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword('user'));
router.patch('/resetPassword/:token', resetPassword('user'));

// Protects all routes after this middleware
router.use(protect('user'));

router.patch('/updateMyPassword', updatePassword('user'));
// router.get('/me'); // Yet to define this route

router.route('/:id/owned-vehicles').get(getOwnedVehicles);
router.route('/:id/deal-complete').post(addSoldOwnedVehicles);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
