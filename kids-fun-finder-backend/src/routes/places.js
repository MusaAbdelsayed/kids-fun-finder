const express = require('express');
const router = express.Router();
// Import the controller object directly
const placesController = require('../controllers/placesController'); // Ensure path is correct relative to routes/places.js

// Define routes
// No need for .bind() as functions are directly exported methods
router.get('/', placesController.getPlaces);
router.get('/:id', placesController.getPlaceById); // Example for getting a single place

// CRUD operations for places
router.post('/', placesController.createPlace);
router.put('/:id', placesController.updatePlace);
router.delete('/:id', placesController.deletePlace);

module.exports = router;
