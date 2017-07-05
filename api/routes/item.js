'use strict'

var express = require('express');
var ItemController = require('../controllers/item');

var api = express.Router();

api.get('/item/consultar/:referencia?', ItemController.consultar);

module.exports = api;
