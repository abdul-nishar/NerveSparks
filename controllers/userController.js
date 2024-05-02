import User from '../models/userModel.js';

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
