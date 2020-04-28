/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
// const { v4: uuid } = require('uuid');
const fs = require('fs');
const { validationResult } = require('express-validator');

const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
// const getCoordsForAddress = require('../util/location');
const Place = require('../models/place-schema');
const User = require('../models/user-schema');
// const mongoose = require('mongoose');

// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871515
//     },
//     address: '20 W 34th St, NY 10001',
//     creator: 'u1'
//   }
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  // const place = DUMMY_PLACES.find((p) => (p.id === placeId));
  let place;

  try {
    place = await Place.findById(placeId);
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!place) {
    // eslint-disable-next-line max-len
    // return res.status(404).json({ message: 'Could not find place for provided Id' }); => only if not using error middleware in app.js
    // Below method of error handling only in 'Synchronous Code', if async use next()
    // const error = new Error('Could not find place for provided Id');
    // error.code = 404;
    // throw error;
    const error = new HttpError('Could not find place for provided Id', 404);
    return next(error);
  }

  // res.json({ place });
  res.json({ place: place.toObject({ getters: true }) });
};

// eslint-disable-next-line consistent-return
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = DUMMY_PLACES.filter((p) => (p.creator === userId));

  // let places;
  let userPlaces;
  try {
    // places = await Place.find({ creator: userId });
    userPlaces = await User.findById(userId).populate('places'); // alternate syntax
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!userPlaces || userPlaces.length === 0) {
    // return res.status(404).json({ message: 'Could not find place for provided User Id' });
    // const error = new Error('Could not find place for provided Id');
    // error.code = 404;
    // return next(error);
    return next(new HttpError('Invalid inputs. Check your data', 404));
  }
  // res.json({ places });
  res.json({ places: userPlaces.places.map((place) => place.toObject({ getters: true })) });
};

const simpleCreatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('All fields need to be filled', 422));
  }
  const {
    title, description, coordinates, address, creator, image
  } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator,
    image
  });
  try {
    await createdPlace.save();
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

// some problem TODO
const addPlaceToUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('All fields need to be filled', 422));
  }
  const {
    title, description, coordinates, address, creator, image
  } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator,
    image
  });

  let user;

  try {
    user = await User.findById(creator);
  }
  catch (err) {
    const error = new HttpError(
      'Creating Place failed, please try again',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find user for provided id',
      404
    );
    return next(error);
  }

  if (user) {
    try {
      user.places.push(createdPlace);
      await user.save();
    }
    catch (err) {
      const error = new HttpError(err, 500);
      return next(error);
    }
  }

  res.status(200).json({ message: 'Added Successfully' });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    // throw new HttpError('Could not find place for provided Id', 422);
    // throw cannot be used in async functions
    // When using next, u need to return to stop execution. throw automatically stops execution
    return next(new HttpError('All fields need to be filled', 422));
  }
  const {
    title, description, coordinates, address, creator
  } = req.body; // data comes from bodyParser

  // use below method if you need to get coordinates from google geocoding api

  // let location;

  // try {
  //   location = await getCoordsForAddress(address);
  // }
  // catch (err) {
  //   return next(err);
  // }

  // const createdPlace = {
  //   id: uuid(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator
  // };

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: req.userData.userId,
    image: req.file.path
  });

  // DUMMY_PLACES.unshift(createdPlace);

  let user;

  try {
    user = await User.findById(req.userData.userId);
  }
  catch (err) {
    const error = new HttpError(
      'Creating Place failed, please try again',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find user for provided id',
      404
    );
    return next(error);
  }

  try {
    // await createdPlace.save();
    // eslint-disable-next-line max-len
    // need to add 2 operations, not directly related to one another, but if any 1 fails, all operations shpuld be reverted.
    // To achieve this we use transactions & sessions
    // Start session -> initiate transaction -> once complete, close session
    const currentSession = await mongoose.startSession();
    currentSession.startTransaction();
    await createdPlace.save({ session: currentSession });
    user.places.push(createdPlace);
    await user.save({ session: currentSession });
    await currentSession.commitTransaction();
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace }); // successfully created
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    // throw new HttpError('Could not find place for provided Id', 422);
    const err = new HttpError('Could not find place for provided Id', 422);
    return next(err);
  }
  const {
    title, description
  } = req.body; // data comes from bodyParser
  const placeId = req.params.pid;

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  // updatedPlace.title = title;
  // updatedPlace.description = description;

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  let place;

  try {
    place = await Place.findById(placeId);
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
 
  // place is a mongoose obj thats why.toString()
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this place!', 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) }); // updated created
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError('Could not find place for provided Id', 422);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  // res.status(200).json({ message: 'Deleted Successfully' });
  let place;
  try {
    // populate allows you to refer a document stored in another collection and work with that data in existing document
    place = await Place.findById(placeId).populate('creator');
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for provided id');
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this place!', 401);
    return next(error);
  }

  const imagePath = place.image;

  try {
    // await place.remove();
    const currentSession = await mongoose.startSession();
    currentSession.startTransaction();
    await place.remove({ session: currentSession });
    place.creator.places.pull(place);
    await place.creator.save({ session: currentSession });
    await currentSession.commitTransaction();
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  fs.unlink(imagePath, err => {
    console.log(err);
  });
  res.status(200).json({ message: 'Deleted Successfully' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
exports.simpleCreatePlace = simpleCreatePlace;
exports.addPlaceToUser = addPlaceToUser;
