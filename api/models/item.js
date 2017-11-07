'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  itemcode: String,
  shortitemcode: String,
  itemname: String,
  description: String,
  urlmercadolibre: String,
  availablestock: Number,
  urlMercadolibre: String,
  model: String,
  newfrom: Date,
  active: String,
  precioVisible: Boolean,
  dimensions: {
    depth: Number,
    height: Number,
    width: Number
  },
  weight: Number,
  price: Number,
  subgroup: {
    code: String,
    name: String
  },
  group: {
    code: String,
    name: String
  },
  department: {
    code: String,
    name: String
  },
  descuento: Boolean
});

module.exports = mongoose.model('item', ItemSchema);
