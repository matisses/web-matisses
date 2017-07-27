'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = Schema({
  code: String,
  name: String,
  cares: String,
  active: Boolean
});

module.exports = mongoose.model('material', MaterialSchema);
