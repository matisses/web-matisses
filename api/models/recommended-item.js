'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecommendedItemSchema = Schema({
  itemId: {
    type: Schema.ObjectId,
    ref: 'Item'
  },
  active: Boolean
});

module.exports = mongoose.model('recommendeditems', RecommendedItemSchema);
