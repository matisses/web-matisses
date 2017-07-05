'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
    name: String,
    referencia: String,
    refCorta: String,
    refProveedor: String,
    nombre: String,
    descripcion: String,
    modelo: String,
    fechaNuevo: Date,
    activo: Boolean,
    dimensiones: {
        alto: Number,
        ancho: Number,
        profundo: Number
    },
    peso: Number,
    precio: Number,
    subgrupo: String,
    marca: {
        type: Schema.ObjectId,
        ref: 'Marca'
    },
    materiales: [{
        type: Schema.ObjectId,
        ref: 'Material'
    }],
    color: {
        type: Schema.ObjectId,
        ref: 'Color'
    }
});

module.exports = mongoose.model('Item', ItemSchema);
