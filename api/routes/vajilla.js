'use strict'

var express = require('express');
var VajillaController = require('../controllers/vajilla');

var api = express.Router();

api.get('/', VajillaController.list);
api.get('/items/:_id', VajillaController.listItems);
api.post('/', VajillaController.save);
api.post('/edit', VajillaController.edit);
api.delete('/remove/:_id', VajillaController.remove);

module.exports = api;
