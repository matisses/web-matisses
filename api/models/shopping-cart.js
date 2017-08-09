'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = Schema({
  fechacreacion: Date,
  items: [{
    _id: String,
    itemcode: String,
    selectedQuantity: Number
  }]
});

module.exports = mongoose.model('shoppingcart', ShoppingCartSchema, 'shoppingcart');
