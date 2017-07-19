'use strict'

var express = require('express');
var MenuItemController = require('../controllers/menu-item');

var api = express.Router();

api.get('/list/:parentId?', MenuItemController.listMenuItems);

module.exports = api;
