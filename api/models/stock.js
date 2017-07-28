'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StockSchema = Schema({
    itemCode: String,
    whsCode: String,
    quantity: Number
});

module.exports = mongoose.model('stock', StockSchema, 'stock');
