'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecommendedItemSchema = Schema({
  itemcode: {
    type: Number,
    ref: 'item'
  },
  active: Boolean
});

module.exports = mongoose.model('recommendeditems', RecommendedItemSchema);
