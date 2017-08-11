'use strict'

var express = require('express');
var MenuItemController = require('../controllers/menu-item');

var api = express.Router();

api.get('/list/:parentId?', MenuItemController.listMenuItems);
api.post('/edit', MenuItemController.edit);
api.post('/save', MenuItemController.save);
api.delete('/remove/:id', MenuItemController.remove);
api.get('/recursive/:id?', MenuItemController.loadMenuRecursively);

module.exports = api;
