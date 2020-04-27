/* eslint-disable consistent-return */
// const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const User = require('../models/user-schema');

// const DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Ashwin',
//     email: 'hello@world.com',
//     password: 'test'
//   }
// ];

const getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });
  let users;
  try {
    users = await User.find({}, '-password'); // -password -> exclude password and show rest
  }
  catch (err) {
    const body = {
      message: 'Fetching users failed',
      errorCause: err
    };
    const error = new HttpError(body, 500);
    return next(error);
  }
  res.json(({ users: users.map((user) => user.toObject({ getters: true })) }));
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    // throw new HttpError('Invalid data submitted', 422);
    const err = new HttpError('Invalid data submitted', 422);
    return next(err);
  }
  const {
    email, name, password
  } = req.body;

  // const isExisting = DUMMY_USERS.find((u) => u.email === email);

  // if (isExisting) {
  //   throw new HttpError('Email already registered', 422);
  // }

  let isExisting;

  try {
    isExisting = await User.findOne({ email });
  }
  catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  if (isExisting) {
    const error = new HttpError('Email already registered', 422);
    return next(error);
  }

  // const createdUser = {
  //   // id: uuid(),
  //   email,
  //   name,
  //   password,
  //   image
  // };

  const createdUser = new User({
    email,
    name,
    password,
    image: req.file.path,
    places: []
  });

  // DUMMY_USERS.push(createdUser);
  // res.status(201).json({ user: createdUser });

  try {
    await createdUser.save();
  }
  catch (err) {
    const body = {
      message: 'Sign up failed, please try again',
      errorCause: err
    };
    const error = new HttpError(body, 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // const identifiedUser = DUMMY_USERS.find((u) => {
  //   if (u.email === email && u.password === password) {
  //     return u;
  //   }
  // });

  // if (!identifiedUser) {
  //   throw new HttpError('Could not find user', 401);
  //  }

  let isExistingUser;

  try {
    isExistingUser = await User.findOne({ email });
  }
  catch (err) {
    const body = {
      message: 'Login failed, please try again',
      errorCause: err
    };
    const error = new HttpError(body, 500);
    return next(error);
  }

  if (!isExistingUser || isExistingUser.password !== password) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  res.json({ message: 'Logged In', user: isExistingUser.toObject({ getters: true }) });
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
