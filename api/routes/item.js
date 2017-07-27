'use strict'

var express = require('express');
var ItemController = require('../controllers/item');

var api = express.Router();

api.get('/nuevos/', ItemController.consultarNuevos);
api.get('/filtrar/', ItemController.filtrar);
api.get('/consultarfiltros/', ItemController.consultarFiltros);

module.exports = api;
