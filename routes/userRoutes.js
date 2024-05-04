import express from 'express';

import {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getOwnedVehicles,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id/owned-vehicles').get(getOwnedVehicles);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
