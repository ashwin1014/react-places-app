/* eslint-disable linebreak-style */
const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');

const router = express.Router();
// GET A SPECIFIC PLACE BY PLACE ID
router.get('/:pid', placesControllers.getPlaceById);
// RETRIEVE LIST OF ALL PLACES FOR A GIVEN USER ID
router.get('/user/:uid', placesControllers.getPlacesByUserId);
// Add PLACE
router.post('/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('coordinates').not().isEmpty(),
    check('address').not().isEmpty()],
  placesControllers.createPlace);
// dummy api
router.post('/createonly',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('coordinates').not().isEmpty(),
    check('address').not().isEmpty()],
  placesControllers.simpleCreatePlace);
router.patch('/updateuserplace',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('coordinates').not().isEmpty(),
    check('address').not().isEmpty()],
  placesControllers.addPlaceToUser);
// update place
router.patch('/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })],
  placesControllers.updatePlaceById);
// delete place
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
