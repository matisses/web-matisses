'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ColorSchema = Schema({
    codigo: String,
    nombre: String,
    codigoHexa: String,
    imagenTextura: String
});

module.exports = mongoose.model('Color', ColorSchema);
