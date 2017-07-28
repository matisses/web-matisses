'use strict'

var express = require('express');
var StockController = require('../controllers/stock');

var api = express.Router();

api.get('/consultarstock/:itemcode', StockController.consultarStockItem);

module.exports = api;
