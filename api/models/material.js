'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MaterialSchema = Schema({
    codigo: String,
    nombre: String
});

module.exports = mongoose.model('Material', MaterialSchema);
