'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventarioSchema = Schema({
    item: {
        type: Schema.ObjectId,
        ref: 'Item'
    },
    almacen: {
        codigo: String,
        nombre: String
    },
    cantidad: Number
});

module.exports = mongoose.model('Inventario', InventarioSchema);
