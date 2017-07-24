'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  itemcode: String,
  shortitemcode: String,
  itemname: String,
  description: String,
  model: String,
  newfrom: Date,
  active: String,
  dimensions: {
    depth: Number,
    height: Number,
    width: Number
  },
  weight: Number,
  price: Number,
  subgroupcode: String
});

module.exports = mongoose.model('Item', ItemSchema);
