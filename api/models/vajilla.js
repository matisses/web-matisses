'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CrockerySchema = Schema({
    name: String,
    brand: String,
    coleccion: String,
    price: Number,
    items: Number,
    pieces: Number,
    detail: [
      {
        itemcode: String,
        quantity: Number
      }
    ]
});

module.exports = mongoose.model('crockery', CrockerySchema);
