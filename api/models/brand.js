'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrandSchema = Schema({
    code: String,
    name: String,
    active: Boolean
});

module.exports = mongoose.model('brand', BrandSchema);
