/* eslint-disable linebreak-style */
const axios = require('axios');

const API_KEY = 'AIzaSyDu242gucmEj5jT4aDSugTaeX6m4hiWv9Y';

const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?${encodeURIComponent(address)}&key=${API_KEY}`);

  const { data } = response;

  console.log(data);

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not find location for specified address', 422);
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
