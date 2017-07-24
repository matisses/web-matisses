'use strict'

var express = require('express');
var ItemController = require('../controllers/item');

var api = express.Router();

api.get('/item/consultar/:referencia?', ItemController.consultar);
api.get('/item/nuevos/', ItemController.consultarNuevos);

module.exports = api;
