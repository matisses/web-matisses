'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = Schema({
  fechacreacion: Date,
  items: [{
    _id: String,
    itemcode: String,
    quantity: Number
  }]
});

module.exports = mongoose.model('shoppingcart', ShoppingCartSchema, 'shoppingcart');
