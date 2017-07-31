'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CitySchema = Schema({
    code: String,
    name: String,
    state: String
});

module.exports = mongoose.model('city', CitySchema);
