'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = Schema({
  metodoEnvio: Number,
  tiendaRecoge: String,
  fechacreacion: Date,
  items: [{
    _id: String,
    itemcode: String,
    selectedQuantity: Number
  }]
});

module.exports = mongoose.model('shoppingcart', ShoppingCartSchema, 'shoppingcart');
