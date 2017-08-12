'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GenericColorSchema = Schema({
    code: String,
    name: String
});

module.exports = mongoose.model('genericcolor', GenericColorSchema);
