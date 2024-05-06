import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';
import User from '../models/userModel.js';
import { db } from '../server.js';
import Dealership from '../models/dealershipModel.js';
import { passwordVerification } from '../utils/genericFns.js';
import { ObjectId } from 'mongodb';
import { hashPassword } from '../utils/genericFns.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRY_TIME * 24 * 60 * 60 * 1000
    ),
    // Cookies can only be sent and received not modified
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  // the secure options makes sure that the cookie is only valid via https requests
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user: user,
  });
};

export const signUp = (role) =>
  catchAsync(async (req, res, next) => {
    let newUser;
    if (role === 'user') {
      newUser = await db.collection('users').insertOne(new User(req.body));
    } else if (role === 'dealership') {
      newUser = await db
        .collection('dealerships')
        .insertOne(new Dealership(req.body));
    }

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();
    createSendToken(newUser, 201, req, res);
  });

export const login = (role) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exists
    if (!email || !password) {
      return next(new AppError('Please enter email and password', 400));
    }
    // 2) Check if user exists
    let user;
    if (role === 'user') {
      user = await db.collection('users').findOne({ user_email: email });
    } else if (role === 'dealership') {
      user = await db
        .collection('dealerships')
        .findOne({ dealership_email: email });
    }

    if (!user || !(await passwordVerification(password, user.password))) {
      return next(new AppError('Please enter a valid email or password', 401));
    }
    // 3) If everything verifies, send token to client
    createSendToken(user, 200, req, res);
  });

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const protect = (role) =>
  catchAsync(async (req, res, next) => {
    let token;
    // 1) Check if token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
      token = req.cookies.jwt;
    }

    if (!token)
      return next(
        new AppError(
          'You are not logged in. Please log in to access this.',
          401
        )
      );

    // 2) Verifying the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Checking if user still exists i.e user is deleted or not
    let currentUser;
    if (role === 'user') {
      currentUser = new User(
        await db
          .collection('users')
          .findOne({ _id: ObjectId.createFromHexString(decoded.id) })
      );
    } else if (role === 'dealership') {
      currentUser = new Dealership(
        await db.collection('dealerships').findOne({ _id: decoded.id })
      );
    }

    if (!currentUser) {
      return next(
        new AppError('User to which this token belongs no longer exists', 401)
      );
    }
    // 4) Check if user changed password after the token was issued
    if (await currentUser.passwordChanged(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password. Please log in again.',
          401
        )
      );
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    // For client-side rendering
    res.locals.user = currentUser;
    next();
  });

export const isLoggedIn = (role) =>
  catchAsync(async (req, res, next) => {
    try {
      // 1) Checking for cookies
      if (!req.cookies.jwt) return next();

      // 2) Verifying the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Checking if user still exists i.e user is deleted or not
      let currentUser;

      if (role === 'user')
        currentUser = await db
          .collection('users')
          .findOne({ _id: ObjectId.createFromHexString(decoded._id) });
      else if (role === 'dealership')
        currentUser = await db
          .collection('dealerships')
          .findOne({ _id: ObjectId.createFromHexString(decoded._id) });

      if (!currentUser) {
        return next();
      }
      // 4) Check if user changed password after the token was issued
      if (currentUser.passwordChanged(decoded.iat)) {
        return next();
      }
      // Storing current user in the locals object
      res.locals.user = currentUser;
    } catch (error) {
      return next();
    }
    next();
  });

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );

    next();
  };

export const forgotPassword = (role) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    let user;
    if (role === 'user') {
      user = new User(
        await db.collection('users').findOne({ user_email: req.body.email })
      );
    } else if (role === 'dealership') {
      user = new Dealership(
        await db
          .collection('dealerships')
          .findOne({ dealership_email: req.body.email })
      );
    }

    if (!user)
      return next(
        new AppError('There is no user with this email address', 404)
      );

    // 2) Generate a random reset token
    const resetToken = await user.createPasswordResetToken();

    if (role === 'user') {
      await db
        .collection('users')
        .updateOne({ user_email: req.body.email }, { $set: user });
    } else if (role === 'dealership') {
      await db
        .collection('dealerships')
        .updateOne({ dealership_email: req.body.email }, { $set: user });
    }

    // 3) Send it to user's email address
    try {
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Your reset password token expires in 10 minutes. Please hurry!',
      //   message,
      // });
      const resetUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
      await new Email(user, resetUrl, role).sendPasswordReset();
      res.status(200).json({
        status: 'success',
        message: 'Password reset token has been sent to your email',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      return next(
        new AppError(
          'There was an error sending the email. Please try later.',
          500
        )
      );
    }
  });

export const resetPassword = (role) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    let user;

    if (role === 'user')
      user = await db.collection('users').findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    else if (role === 'dealership')
      user = await db.collection('dealerships').findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

    // 2) If user exists and token has not expired, change the password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = hashPassword(req.body.password);
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    const email = user.user_email;

    if (role === 'user')
      await db
        .collection('users')
        .updateOne({ user_email: email }, { $set: user });
    else if (role === 'dealership')
      await db
        .collection('dealerships')
        .updateOne({ dealership_email: email }, { $set: user });

    // 3) Log the user in and send JWT token
    createSendToken(user, 201, req, res);
  });

export const updatePassword = (role) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    let user;
    if (role === 'user')
      user = await db
        .collection('users')
        .findOne({ user_email: req.user.user_email });
    else if (role === 'dealership')
      user = await db
        .collection('dealerships')
        .findOne({ dealership_id: req.user.dealership_id });
    // 2) Check if POSTED current password is correct

    if (
      !user ||
      !(await passwordVerification(req.body.passwordCurrent, user.password))
    )
      return next(new Error('Incorrect email or password'));
    // 3) If so, change password
    user.password = hashPassword(req.body.newPassword);

    console.log(user);

    if (role === 'user')
      await db
        .collection('users')
        .updateOne({ user_email: req.user.user_email }, { $set: user });
    else if (role === 'dealership')
      user = await db
        .collection('dealerships')
        .findOne(
          { dealership_email: req.user.dealership_email },
          { $set: user }
        );
    // // 4) Login user
    createSendToken(user, 201, req, res);
  });
