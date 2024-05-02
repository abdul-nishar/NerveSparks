import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import { db } from '../server.js';

export const deleteOne = (collection) =>
  catchAsync(async (req, res, next) => {
    let primaryId;

    if (collection === 'cars') primaryId = 'car_id';
    else if (collection === 'users') primaryId = 'user_id';

    const result = await db
      .collection(collection)
      .deleteOne({ [primaryId]: req.params.id });

    if (result.deletedCount === 0) {
      return next(new Error('No document found with this ID')); // Assuming catchAsync handles errors
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (collection) =>
  catchAsync(async (req, res, next) => {
    let primaryId;

    if (collection === 'cars') primaryId = 'car_id';
    else if (collection === 'users') primaryId = 'user_id';

    const result = await db.collection(collection).findOneAndUpdate(
      { [primaryId]: req.params.id },
      { $set: req.body },
      {
        returnOriginal: true,
      }
    );

    if (!result.value) {
      throw new Error('No document found with this ID');
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: result,
      },
    });
  });

export const createOne = (collection, Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await db.collection(collection).insertOne(new Model(req.body));
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (collection, popOptions) =>
  catchAsync(async (req, res, next) => {
    let primaryId;

    if (collection === 'cars') primaryId = 'car_id';
    else if (collection === 'users') primaryId = 'user_id';

    let query = db
      .collection(collection)
      .findOne({ [primaryId]: req.params.id });

    const doc = await query;

    console.log(doc);

    if (!doc) return next(new AppError('No document found with this ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (collection) =>
  catchAsync(async (req, res, next) => {
    // USING API FEATURES
    const features = await new APIFeatures(db, collection, req.query).filter();
    // .sort()
    // .fieldSelection()
    // .paginate();

    // EXECUTE QUERY
    const doc = await features.collection;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
