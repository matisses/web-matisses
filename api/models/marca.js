'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MarcaSchema = Schema({
    codigo: String,
    nombre: String,
    imagenLogo: String
});

module.exports = mongoose.model('Marca', MarcaSchema);
