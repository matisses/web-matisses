'use strict'

var express = require('express');
var VajillaController = require('../controllers/vajilla');

var api = express.Router();

api.get('/', VajillaController.list);
api.get('/items/:_id', VajillaController.listItems);
api.post('/', VajillaController.save);

module.exports = api;
