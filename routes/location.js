const express = require('express');
const locationController = require('../controllers/locationController');

const locationRoutes  = express.Router();

// locationRoutes.post('/countries', locationController.addCountry);
// locationRoutes.get('/countries', locationController.countries);

// locationRoutes.post('/states', locationController.addState);
// locationRoutes.get('/states', locationController.states);

locationRoutes.post('/zones', locationController.addZone);
locationRoutes.get('/zones', locationController.zones);

locationRoutes.post('/lga', locationController.addLGA);
locationRoutes.post('/lga/list', locationController.addLGAList);
locationRoutes.get('/lga', locationController.lgas);
locationRoutes.get('/lga/:zone_id', locationController.lgasByZone);


module.exports = locationRoutes;