/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */

// NOTE: Middlewares are always parsed from top to bottom, so order matters!

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const MONGO_URI = 'mongodb+srv://ashwin1014:CCVUfJ3MNclVdIAd@cluster0-tcq8f.mongodb.net/places?retryWrites=true&w=majority';
const MONGO_URI = 'mongodb://127.0.0.1:27017/mern?retryWrites=false&?replicaSet=rs';
// const MONGO_URI = 'mongodb://ashwin1014:27017,ashwin1014:27018,ashwin1014:27019/places?replicaSet=rs';

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

const app = express();

// HAndle CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  next();
});

app.use(bodyParser.json()); // need to parse body before it reaches routes

app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);

// handle route not found
app.use((req, res, next) => {
  const error = new HttpError('Route not found', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
    .json({ message: error.message || 'Unknown Error Occurred' });
});

const fixDeprecationWarnings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(MONGO_URI, fixDeprecationWarnings)
  .then(() => {
    app.listen(5000);
    console.info('Connection Established, Server Started');
  })
  .catch((err) => {
    console.error('Server not started', err);
  });