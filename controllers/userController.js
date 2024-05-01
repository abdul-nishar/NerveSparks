import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(
  readFileSync(`${__dirname}/../dev-data/data/userData.json`)
);

export const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};

export const createUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

export const getUser = async (req, res) => {
  const user = await users.find((el) => el.user_id === req.params.id);

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

export const updateUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};

export const deleteUser = (req, res) => {
  res.status(400).json({
    status: 'Error',
    message: 'This route has not yet been implemented',
  });
};
