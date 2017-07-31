'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateSchema = Schema({
    code: String,
    name: String
});

module.exports = mongoose.model('state', StateSchema, 'states');
