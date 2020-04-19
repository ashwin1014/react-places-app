/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  // adding unique adds an Index to speed up querying
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }] // Array since it can have multiple places
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
