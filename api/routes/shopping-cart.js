'use strict'

var express = require('express');
var ShoppingCartController = require('../controllers/shopping-cart');

var api = express.Router();

api.post('/guardar/', ShoppingCartController.saveShoppingCart);

module.exports = api;
