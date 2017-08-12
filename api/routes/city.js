'use strict'

var express = require('express');
var CityController = require('../controllers/city');

var api = express.Router();

api.get('/listarPrincipales/', CityController.listPrincipalCities);
api.get('/listarOtrasCiudades/', CityController.listOtherCities);

module.exports = api;
