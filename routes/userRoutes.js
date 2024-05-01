import express from 'express';

import {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
