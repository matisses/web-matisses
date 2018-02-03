'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShoppingCartSchema = Schema({
  metodoEnvio: Number,
  tiendaRecoge: String,
  fechacreacion: Date,
  precioNuevo: Boolean,
  items: [{
    _id: String,
    itemcode: String,
    selectedQuantity: Number,
    nuevoPrecio: Number
  }]
});

module.exports = mongoose.model('shoppingcart', ShoppingCartSchema, 'shoppingcart');
