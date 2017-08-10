'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuItemSchema = Schema({
  name: String,
  department: String,
  group: String,
  subgroup: String,
  parentId: String,
  position: Number,
  menuItemAfter: String,
  menuItemBefore: String
});

module.exports = mongoose.model('menuitems', MenuItemSchema);
