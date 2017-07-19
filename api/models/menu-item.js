'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuItemSchema = Schema({
    code: String,
    name: String,
    route: String,
    parentId: String
});

module.exports = mongoose.model('menuitems', MenuItemSchema);
