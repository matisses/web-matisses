'use strict'

var express = require('express');
var ItemController = require('../controllers/item');

var api = express.Router();

api.get('/consultar/:referencia?', ItemController.consultar);
api.get('/nuevos/', ItemController.consultarNuevos);
api.get('/filtrar/', ItemController.filtrar);

module.exports = api;
